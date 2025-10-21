import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import RefreshToken from "../models/refreshToken.model.js";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

// Creating JWT access token
export const generateAccessToken = ({userId, role }) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// Creating JWT refresh token
export const generateRefreshToken = async ({userId, role }) => {
  const tokenId = uuidv4();
  const token = jwt.sign({ userId, role, tokenId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  await RefreshToken.create({
    userId,
    tokenId,
  });
  return token;
};

// Verify refresh Token
export const verifyRefreshToken = async (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const dbToken = await RefreshToken.findOne({
      tokenId: payload.tokenId
    });
    if (!dbToken) throw new Error("Invalid refresh token");
    return payload;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

// Revoke Refresh Token
export const revokeRefreshToken = async (tokenId) => {
  try {
    await RefreshToken.deleteOne({ tokenId });
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
