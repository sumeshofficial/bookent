import { Error } from "mongoose";
import Otp from "../models/otp.model.js";
import { sendMail } from "../utility/mailer.js";
import { redisClient } from "../config/redis.conf.js";

// Generate OTP
export const generateOtp = async ({ email, userData, purpose }) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `otp:${email}:${purpose}`;

  try {
    await redisClient.del(redisKey);

    const redisData = {
      ...userData,
      otp: otpCode,
      purpose,
    };

    await redisClient.setEx(redisKey, 300, JSON.stringify(redisData));

    await sendMail(email, otpCode, userData.fullname);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Check OTP is expired or not
export const checkOtp = async (email, purpose) => {
  const redisKey = `otp:${email}:${purpose}`;
  const data = await redisClient.get(redisKey);
  if (!data) return null;
  return JSON.parse(data);
};

// Verify User
export const delOtp = async (email, purpose) => {
  const redisKey = `otp:${email}:${purpose}`;
  await redisClient.del(redisKey);
};
