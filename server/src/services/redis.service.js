import dotenv from "dotenv";
import { redisClient } from "../config/redis.conf.js";

dotenv.config();

// Store data in Redis
export const storeInRedis = async (key, expiresIn, data) => {
  await redisClient.setEx(key, expiresIn, data);
};

// Get data from Redis
export const getRedisData = async (key) => {
  return await redisClient.get(key);
};

// Delete data from Redis
export const deleteRedisData = async (key) => {
  return await redisClient.del(key);
};
