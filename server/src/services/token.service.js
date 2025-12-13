import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import RefreshToken from "../models/refreshToken.model.js";
import { v4 as uuidv4 } from "uuid";
import { getRedisData, storeInRedis } from "./redis.service.js";
import { ENV } from "../config/env.conf.js";
dotenv.config();

const userRefreshTokenExpiresIn = ENV.JWT_USER_REFRESH_TOKEN_EXPIRES_IN;
const adminRefreshTokenExpiresIn = ENV.JWT_ADMIN_REFRESH_TOKEN_EXPIRES_IN;
const accessTokenExpiresIn = ENV.JWT_ACCESS_TOKEN_EXPIRES_IN;

// Creating JWT access token
export const generateAccessToken = ({ userId, role }) => {
  return jwt.sign({ id: userId, role }, ENV.JWT_SECRET, {
    expiresIn: accessTokenExpiresIn,
  });
};

// Creating JWT refresh token
export const generateRefreshToken = async ({ userId, role }) => {
  const expiresIn =
    role === "user" ? userRefreshTokenExpiresIn : adminRefreshTokenExpiresIn;

  const tokenId = uuidv4();
  console.log(
    expiresIn,
    { userId, role, tokenId },
    "expiresIn",
    ENV.JWT_REFRESH_SECRET
  );
  const token = jwt.sign({ userId, role, tokenId }, ENV.JWT_REFRESH_SECRET, {
    expiresIn,
  });
  await RefreshToken.create({
    userId,
    tokenId,
  });
  return token;
};

// Verify refresh Token
export const verifyRefreshToken = async (token) => {
  const payload = jwt.verify(token, ENV.JWT_REFRESH_SECRET);
  const dbToken = await RefreshToken.findOne({
    tokenId: payload.tokenId,
  });
  if (!dbToken) {
    throw new Error("Invalid refresh token");
  }
  return payload;
};

// Revoke Refresh Token
export const revokeRefreshToken = async (tokenId) => {
  await RefreshToken.deleteOne({ tokenId });
};

// Add token to blacklist
export const blacklistToken = async (token, expiresInSeconds) => {
  if (!expiresInSeconds || expiresInSeconds <= 0) {
    return;
  }
  const key = `blacklist:${token}`;
  await storeInRedis(key, expiresInSeconds, "blacklisted");
};

// Check if token is blacklisted
export const isTokenBlacklisted = async (token) => {
  const key = `blacklist:${token}`;
  return await getRedisData(key);
};
