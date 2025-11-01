import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const REDIS_URI = process.env.REDIS_URI || "redis://127.0.0.1:6379";

const redisClient = createClient({
  url: REDIS_URI,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.on("connect", () => console.log("Redis Connected"));

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("Redis connection failed:", error);
  }
};

export { redisClient, connectRedis };
