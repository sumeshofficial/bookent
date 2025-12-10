import { createClient } from "redis";
import dotenv from "dotenv";
import logger from "./logger.js";
import { REDIS_EVENTS } from "../utility/constants.js";
import { ENV } from "./envConfig.js";
dotenv.config();

const REDIS_URI = ENV.REDIS_URI;

// Redis configuration
const redisClient = createClient({
  url: REDIS_URI,
});

redisClient.on(REDIS_EVENTS.ERROR, (err) => logger.error("Redis Error:", err));
redisClient.on(REDIS_EVENTS.CONNECT, () => logger.info("Redis Connected"));

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      await redisClient.configSet(REDIS_EVENTS.NOTIFY, REDIS_EVENTS.EX);
    }
  } catch (error) {
    logger.error("Redis connection failed:", error);
  }
};

export { redisClient, connectRedis };
