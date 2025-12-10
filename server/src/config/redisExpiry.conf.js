import { createClient } from "redis";
import logger from "./logger.js";
import { handleExpiredLockKey } from "../services/user/seatLock.service.js";
import { REDIS_EVENTS } from "../utility/constants.js";
import { ENV } from "./envConfig.js";

export const initRedisExpiryListener = async () => {
  const sub = createClient({ url: ENV.REDIS_URI });
  sub.on(REDIS_EVENTS.ERROR, (e) => logger.error(`redis expiry sub err ${e}`));
  await sub.connect();
  await sub.pSubscribe(REDIS_EVENTS.EXPIRED, async (message) => {
    logger.info("expired key ->", message);
    await handleExpiredLockKey(message);
  });
  logger.info("Redis expiry listener ready");
};
