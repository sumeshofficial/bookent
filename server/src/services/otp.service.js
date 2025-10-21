import { Error } from "mongoose";
import Otp from "../models/otp.model.js";
import { sendMail } from "../utility/mailer.js";
import User from "../models/user.model.js";

// Generate OTP
export const generateOtp = async (user, purpose) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await Otp.deleteMany({ userId: user._id, purpose });

    const otpDoc = await Otp.create({
      userId: user._id,
      otp: otpCode,
      purpose,
    });

    await sendMail(user.email, otpCode, user.fullname);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Check OTP is expired or not
export const checkOtp = async (userId) => {
  return await Otp.findOne({ userId });
};

// Verify User
export const verifyUser = async (user, purpose) => {
  user.isVerified = true;
  const verifiedUser = await user.save();
  await Otp.deleteMany({ userId: user._id, purpose });
  return verifiedUser;
};
