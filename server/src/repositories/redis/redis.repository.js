import { redisClient } from "../../config/redis.conf.js";

// Store data in Redis
export const storeInRedis = async (key, data) => {
  await redisClient.set(key, data);
};

// Store data in Redis
export const storeInRedisWithExpiry = async (key, expiresIn, data) => {
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
