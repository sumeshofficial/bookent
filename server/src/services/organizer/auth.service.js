import { redisClient } from "../../config/redis.conf.js";
import { otpTemplate, sendEmail } from "../notifications/email.service.js";
import dotenv from "dotenv";
import { AppError } from "../../utility/helpers.js";
import { STATUS_CODE } from "../../utility/constants.js";
import { checkOrganizer } from "../../repositories/organizer/organizer.repository.js";

dotenv.config();

export const sendOtp = async (data) => {
  const { email, purpose, userId } = data;
  if (!email || !purpose) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      "ALL_FIELDS_ARE_REQUIRED",
      "email and purpose are required."
    );
  }

  const organizer = await checkOrganizer(userId);

  if (!organizer) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      "ORGANIZER_NOT_FOUND",
      "Organizer not found"
    );
  }

  await createOtp({ email, organizer, purpose });

  return email;
};

const redisExpiresIn = process.env.REDIS_OTP_EXPIRES_IN;

export const createOtp = async ({ email, organizer, purpose }) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  const redisKey = `otp:${email}:${purpose}`;

  await redisClient.del(redisKey);

  const redisData = {
    otp: otpCode,
    purpose,
  };

  await redisClient.setEx(redisKey, redisExpiresIn, JSON.stringify(redisData));

  await sendEmail({
    to: email,
    subject: "Email otp verification",
    html: otpTemplate(otpCode, organizer.fullname),
  });
};
