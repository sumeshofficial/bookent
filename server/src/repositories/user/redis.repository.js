import { redisClient } from "../../config/redis.conf.js";

export const getAllHashFields = async (key) => {
  return redisClient.hGetAll(key);
};

export const isDataExists = async (key) => {
  return await redisClient.exists(key);
};

export const extendExpiry = async (key, ttl_extend) => {
  await redisClient.expire(key, ttl_extend);
};
