import { sendMail } from "../utility/mailer.js";
import { redisClient } from "../config/redis.conf.js";
import { ENV } from "../config/envConfig.js";

const redisExpiresIn = ENV.REDIS_OTP_EXPIRES_IN;

// Generate OTP
export const generateOtp = async ({ email, userData, purpose }) => {
  const otpCode = crypto.randomInt(100000, 1000000).toString();
  const redisKey = `otp:${email}:${purpose}`;

  await redisClient.del(redisKey);

  const redisData = {
    ...userData,
    otp: otpCode,
    purpose,
  };

  await redisClient.setEx(redisKey, redisExpiresIn, JSON.stringify(redisData));

  await sendMail(email, otpCode, userData.fullname);
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
