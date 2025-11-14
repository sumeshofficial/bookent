import { createClient } from "redis";
import dotenv from "dotenv";
import logger from "./logger.js";
dotenv.config();

const REDIS_URI = process.env.REDIS_URI;

// Redis configuration
const redisClient = createClient({
  url: REDIS_URI,
});

redisClient.on("error", (err) => logger.error("Redis Error:", err));
redisClient.on("connect", () => logger.info("Redis Connected"));

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    logger.error("Redis connection failed:", error);
  }
};

export { redisClient, connectRedis };
