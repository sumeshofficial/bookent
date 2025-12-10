import { redisClient } from "../../config/redis.conf.js";
import dotenv from "dotenv";
import { SOCKET_EVENTS, ERRORS } from "../../utility/constants.js";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../../config/envConfig.js";

dotenv.config();

const LOCK_TTL_MS = Number(ENV.LOCK_TTL);
const LOCKMETA_TTL_PAD = Number(ENV.LOCKMETA_TTL);

const inventoryKey = (eventId, sectionId) =>
  `inventory:${eventId}:${sectionId}`;

const lockKey = (eventId, sectionId, lockId) =>
  `lock:${eventId}:${sectionId}:${lockId}`;

const lockMetaKey = (lockId) => `lockmeta:${lockId}`;

const userLocksKey = (eventId, userId) => `userlocks:${eventId}:${userId}`;

export const lockSectionQuantity = async ({
  eventId,
  sectionId,
  qty,
  userId,
}) => {
  if (qty <= 0) {
    throw new Error(ERRORS.INVALID_QUANTITY.MSG);
  }

  const lockId = uuidv4();

  console.log(await redisClient.get(`inventory:${eventId}:${sectionId}`));

  const lua = `
    local invKey = KEYS[1]
    local lockKey = KEYS[2]
    local lockMetaKey = KEYS[3]
    local userLocks = KEYS[4]

    local qty = tonumber(ARGV[1])
    local lockMetaJson = ARGV[2]
    local lockTtl = tonumber(ARGV[3])
    local metaTtl = tonumber(ARGV[4])

    local current = tonumber(redis.call("GET", invKey) or "0")
    if current < qty then
      return {"INSUFFICIENT"}
    end

    redis.call("DECRBY", invKey, qty)
    redis.call("SET", lockKey, "1", "PX", lockTtl)

    redis.call("HMSET", lockMetaKey, unpack(cjson.decode(lockMetaJson)))
    redis.call("PEXPIRE", lockMetaKey, metaTtl)

    redis.call("SADD", userLocks, lockKey)

    return {"OK"}
  `;

  const metaObj = {
    eventId,
    sectionId,
    qty: String(qty),
    userId: String(userId),
    released: "0",
  };

  const metaArray = [];
  for (const k in metaObj) {
    metaArray.push(k, metaObj[k]);
  }

  const res = await redisClient.eval(lua, {
    keys: [
      inventoryKey(eventId, sectionId),
      lockKey(eventId, sectionId, lockId),
      lockMetaKey(lockId),
      userLocksKey(eventId, userId),
    ],
    arguments: [
      String(qty),
      JSON.stringify(metaArray),
      String(LOCK_TTL_MS),
      String(LOCK_TTL_MS + LOCKMETA_TTL_PAD),
    ],
  });

  console.log(await redisClient.get(`inventory:${eventId}:${sectionId}`));

  if (Array.isArray(res) && res[0] === "OK") {
    await redisClient.publish(
      SOCKET_EVENTS.SEAT_UPDATE,
      JSON.stringify({
        eventId,
        sectionId,
        qty,
        status: "locked",
        lockedBy: userId,
        lockId: lockId,
        expiresAt: Date.now() + LOCK_TTL_MS,
      })
    );

    return { success: true, lockId };
  }

  if (res && res[0] === "INSUFFICIENT") {
    throw new Error(ERRORS.INSUFFICIENT_TICKETS.MSG);
  }

  throw new Error(ERRORS.LOCK_FAILED.MSG);
};

export const confirmBookingByLock = async ({
  lockIds = [],
  userId,
  bookingMeta = {},
}) => {
  const pipeline = redisClient.multi();

  for (const lockId of lockIds) {
    pipeline.hGetAll(lockMetaKey(lockId));
  }

  const metas = (await pipeline.exec()).map(([, data]) => data);

  for (const m of metas) {
    if (!m || !m.userId) {
      throw new Error(ERRORS.INVALID_LOCK.MSG);
    }
    if (m.userId !== String(userId)) {
      throw new Error(ERRORS.UNAUTHORIZED_LOCK.MSG);
    }
  }

  const pipeline2 = redisClient.multi();

  for (let i = 0; i < lockIds.length; i++) {
    const lockId = lockIds[i];
    const m = metas[i];
    const lKey = lockKey(m.eventId, m.sectionId, lockId);

    pipeline2.del(lKey); // delete lock key
    pipeline2.del(lockMetaKey(lockId)); // delete meta
    pipeline2.sRem(userLocksKey(m.eventId, m.userId), lKey);

    pipeline2.publish(
      SOCKET_EVENTS.SEAT_UPDATE,
      JSON.stringify({
        eventId: m.eventId,
        sectionId: m.sectionId,
        qty: m.qty,
        status: "booked",
        bookedBy: m.userId,
      })
    );
  }

  await pipeline2.exec();

  return { success: true };
};

export const releaseLockById = async ({ lockId }) => {
  const meta = await redisClient.hGetAll(lockMetaKey(lockId));

  if (!meta || !meta.eventId) {
    return { success: false };
  }

  const { eventId, sectionId, userId } = meta;
  const qty = Number(meta.qty || 0);
  const lKey = lockKey(eventId, sectionId, lockId);

  if (meta.released === "1") {
    return { success: false, reason: "Already released" };
  }

  await redisClient.hSet(lockMetaKey(lockId), "released", "1");

  const pipeline = redisClient.multi();
  pipeline.del(lKey);
  pipeline.del(lockMetaKey(lockId));
  pipeline.sRem(userLocksKey(eventId, userId), lKey);
  pipeline.incrBy(inventoryKey(eventId, sectionId), qty);

  pipeline.publish(
    SOCKET_EVENTS.SEAT_UPDATE,
    JSON.stringify({
      eventId,
      sectionId,
      qty,
      userId,
      status: "available",
      restored: qty,
    })
  );

  await pipeline.exec();

  return { success: true };
};

export const releaseAllLocksForUser = async ({ eventId, userId }) => {
  const setKey = userLocksKey(eventId, userId);
  const lockKeys = await redisClient.sMembers(setKey);
  if (!lockKeys.length) {
    return [];
  }

  for (const fullLockKey of lockKeys) {
    const lockId = fullLockKey.split(":").pop();
    await releaseLockById({ lockId });
  }

  return lockKeys;
};

export const handleExpiredLockKey = async (expiredKey) => {
  const lockId = expiredKey.split(":").pop();
  const meta = await redisClient.hGetAll(lockMetaKey(lockId));

  if (!meta || !meta.eventId) {
    return;
  }

  const { eventId, sectionId, userId } = meta;
  const qty = Number(meta.qty || 0);

  if (meta.released === "1") {
    return;
  }

  await redisClient.hSet(lockMetaKey(lockId), "released", "1");

  const pipeline = redisClient.multi();
  pipeline.incrBy(inventoryKey(eventId, sectionId), qty);
  pipeline.del(lockMetaKey(lockId));
  pipeline.sRem(userLocksKey(eventId, userId), expiredKey);

  pipeline.publish(
    SOCKET_EVENTS.SEAT_UPDATE,
    JSON.stringify({
      eventId,
      sectionId,
      userId,
      qty,
      status: "available",
      restored: qty,
      isExpired: true,
    })
  );

  await pipeline.exec();
};

export const getAllCurrentLocks = async (eventId) => {
  const pattern = `lock:${eventId}:*:*`;
  const lockKeys = await redisClient.keys(pattern);

  if (!lockKeys || lockKeys.length === 0) {
    return {};
  }

  const aggregated = {};

  for (const fullLockKey of lockKeys) {
    const parts = fullLockKey.split(":");
    const lockId = parts[parts.length - 1];

    const meta = await redisClient.hGetAll(lockMetaKey(lockId));
    if (!meta || !meta.sectionId) {
      continue;
    }

    const sectionId = meta.sectionId;
    const qty = Number(meta.qty || 0);

    if (!aggregated[sectionId]) {
      aggregated[sectionId] = {
        sectionId,
        qty: 0,
        status: "locked",
        lockedBy: meta.userId,
        locks: [],
      };
    }

    aggregated[sectionId].qty += qty;
    aggregated[sectionId].locks.push({
      lockId,
      userId: meta.userId,
      qty,
    });
  }

  return aggregated;
};
