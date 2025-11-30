import { redisClient } from "../../config/redis.conf.js";
import dotenv from "dotenv";
import { AppError } from "../../utility/helpers.js";
import { STATUS_CODE } from "../../utility/constants.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const LOCK_TTL_MS = Number(process.env.LOCK_TTL); // 2 minutes default
const LOCKMETA_TTL_PAD = Number(process.env.LOCKMETA_TTL); // 5 seconds padding
const PUB_CHANNEL = process.env.CHANNEL;

// ---------------------------- REDIS KEY HELPERS ---------------------------- //

const inventoryKey = (eventId, sectionId) =>
  `inventory:${eventId}:${sectionId}`;

const lockKey = (eventId, sectionId, lockId) =>
  `lock:${eventId}:${sectionId}:${lockId}`;

const lockMetaKey = (lockId) => `lockmeta:${lockId}`;

const userLocksKey = (eventId, userId) => `userlocks:${eventId}:${userId}`;

// ========================================================================== //
//                        1) LOCK SECTION QUANTITY                            //
// ========================================================================== //

export const lockSectionQuantity = async ({
  eventId,
  sectionId,
  qty,
  userId,
}) => {
  if (qty <= 0) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      "INVALID_QTY",
      "Quantity must be greater than 0"
    );
  }

  const lockId = uuidv4();

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
      return {err = "INSUFFICIENT"}
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

  if (Array.isArray(res) && res[0] === "OK") {
    await redisClient.publish(
      PUB_CHANNEL,
      JSON.stringify({
        eventId,
        sectionId,
        qty,
        status: "locked",
        lockedBy: userId,
      })
    );

    return { success: true, lockId };
  }

  if (res && res.message === "INSUFFICIENT") {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      "INSUFFICIENT_SEATS",
      "Not enough tickets available"
    );
  }

  throw new AppError(
    STATUS_CODE.SERVER_ERROR,
    "LOCK_FAILED",
    "Failed to lock tickets"
  );
};

// ========================================================================== //
//                            2) CONFIRM BOOKING                              //
// ========================================================================== //

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
      throw new AppError(
        STATUS_CODE.BAD_REQUEST,
        "INVALID_LOCK",
        "One or more locks are invalid"
      );
    }
    if (m.userId !== String(userId)) {
      throw new AppError(
        STATUS_CODE.FORBIDDEN,
        "LOCK_NOT_OWNED",
        "One or more locks do not belong to this user"
      );
    }
  }

  // 🔥 NOTE: YOU SHOULD WRITE BOOKING TO DB HERE BEFORE RELEASING LOCKS
  // Example:
  // await Booking.create({ eventId: metas[0].eventId, details: metas });

  const pipeline2 = redisClient.multi();

  for (let i = 0; i < lockIds.length; i++) {
    const lockId = lockIds[i];
    const m = metas[i];
    const lKey = lockKey(m.eventId, m.sectionId, lockId);

    pipeline2.del(lKey); // delete lock key
    pipeline2.del(lockMetaKey(lockId)); // delete meta
    pipeline2.sRem(userLocksKey(m.eventId, m.userId), lKey);

    pipeline2.publish(
      PUB_CHANNEL,
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

// ========================================================================== //
//                       3) MANUAL RELEASE (cancel)                           //
// ========================================================================== //

export const releaseLockById = async ({ lockId }) => {
  const meta = await redisClient.hGetAll(lockMetaKey(lockId));

  if (!meta || !meta.eventId) {
    return { success: false };
  }

  const { eventId, sectionId, userId } = meta;
  const qty = Number(meta.qty || 0);
  const lKey = lockKey(eventId, sectionId, lockId);

  const pipeline = redisClient.multi();
  pipeline.del(lKey);
  pipeline.del(lockMetaKey(lockId));
  pipeline.sRem(userLocksKey(eventId, userId), lKey);
  pipeline.incrBy(inventoryKey(eventId, sectionId), qty);

  pipeline.publish(
    PUB_CHANNEL,
    JSON.stringify({
      eventId,
      sectionId,
      qty,
      status: "available",
      restored: qty,
    })
  );

  await pipeline.exec();

  return { success: true };
};

// ========================================================================== //
//                4) RELEASE ALL LOCKS WHEN USER DISCONNECTS                  //
// ========================================================================== //

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

// ========================================================================== //
//                      5) HANDLE TTL EXPIRATION EVENT                        //
// ========================================================================== //

export const handleExpiredLockKey = async (expiredKey) => {
  console.log("expiredKey:", expiredKey);
  if (!expiredKey.startsWith("lock:")) {
    return;
  }

  const lockId = expiredKey.split(":").pop();
  const meta = await redisClient.hGetAll(lockMetaKey(lockId));

  if (!meta || !meta.eventId) {
    return;
  }

  const { eventId, sectionId, userId } = meta;
  const qty = Number(meta.qty || 0);

  const pipeline = redisClient.multi();
  pipeline.incrBy(inventoryKey(eventId, sectionId), qty);
  pipeline.del(lockMetaKey(lockId));
  pipeline.sRem(userLocksKey(eventId, userId), expiredKey);

  console.log(
    PUB_CHANNEL,
    JSON.stringify({
      eventId,
      sectionId,
      qty,
      status: "available",
      restored: qty,
    })
  );

  pipeline.publish(
    PUB_CHANNEL,
    JSON.stringify({
      eventId,
      sectionId,
      qty,
      status: "available",
      restored: qty,
    })
  );

  await pipeline.exec();
};
