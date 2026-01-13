import { otpTemplate, sendEmail } from "./email.service.js";
import { redisClient } from "../../config/redis.conf.js";
import dotenv from "dotenv";
import { ENV } from "../../config/env.conf.js";

dotenv.config();

const redisExpiresIn = ENV.REDIS_OTP_EXPIRES_IN;

// Generate OTP
export const generateOtp = async ({ email, userData, purpose }) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = `otp:${email}:${purpose}`;

  await redisClient.del(redisKey);

  const redisData = {
    ...userData,
    otp: otpCode,
    purpose,
  };

  await redisClient.setEx(redisKey, redisExpiresIn, JSON.stringify(redisData));

  await sendEmail({
    to: email,
    subject: "Email otp verification",
    html: otpTemplate(otpCode, userData.fullname),
  });
};

// Check OTP is expired or not
export const checkOtp = async (email, purpose) => {
  const redisKey = `otp:${email}:${purpose}`;
  const data = await redisClient.get(redisKey);
  if (!data) {
    return null;
  }
  return JSON.parse(data);
};

// Verify User
export const delOtp = async (email, purpose) => {
  const redisKey = `otp:${email}:${purpose}`;
  await redisClient.del(redisKey);
};
