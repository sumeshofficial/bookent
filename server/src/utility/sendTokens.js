import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/token.service.js";
import dotenv from "dotenv";
dotenv.config();

// Send Token as cookie
export const sendTokens = async (res, user) => {
  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });
  const refreshToken = await generateRefreshToken({
    userId: user._id,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return accessToken;
};

// Send Token as cookie
export const sendTokensForAdmin = async (res, user) => {
  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });
  const refreshToken = await generateRefreshToken({
    userId: user._id,
    role: user.role,
  });

  res.cookie("admin_refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return accessToken;
};
