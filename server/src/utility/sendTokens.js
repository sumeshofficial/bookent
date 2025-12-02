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

  console.log("SendToken", refreshToken);

  res.cookie(`${user.role}_refreshToken`, refreshToken, {
    httpOnly: true,
    sameSite: "lax", // Production "none"
    secure: false, // Production true
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return accessToken;
};
