import { createClient } from "redis";
import logger from "./logger.js";
import { handleExpiredLockKey } from "../services/user/seatLock.service.js";

export const initRedisExpiryListener = async () => {
  const sub = createClient({ url: process.env.REDIS_URI });
  sub.on("error", (e) => logger.error("redis expiry sub err", e));
  await sub.connect();
  await sub.pSubscribe("__keyevent@0__:expired", async (message) => {
    logger.info("expired key ->", message);
    await handleExpiredLockKey(message);
  });
  logger.info("Redis expiry listener ready");
};
