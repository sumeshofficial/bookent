import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import {
  blacklistToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "./token.service.js";
import { ENV } from "../config/env.conf.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../repositories/user/user.repository.js";

// handling google authentication
export const handleGoogleAuth = async (profile) => {
  const email = profile.emails?.[0]?.value;
  const displayName = profile.displayName;
  const profileImage = profile?.photos?.[0]?.value;
  const role = profile.role;
  const googleId = profile.id;

  const existingUser = await findUserByEmail(email);

  if (existingUser && existingUser?.authProvider !== "google") {
    throw new Error("User already exists. Please login instead.");
  }

  if (existingUser?.authProvider === "google") {
    return existingUser;
  }

  return await createUser({
    fullname: displayName,
    email,
    role,
    googleId,
    profileImage,
    isVerified: true,
    authProvider: "google",
  });
};

// Verify Token and Get User
export const verifyTokenAndGetUser = async (token) => {
  const decoded = jwt.verify(token, ENV.JWT_SECRET);

  const user = await findUserById(decoded.id);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// logout.service.js
export const handleLogout = async (res, tokenName, token) => {
  const refreshToken = res.req.cookies[tokenName];

  // Decode expiry for blacklist
  if (token) {
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    await blacklistToken(token, expiresIn);
  }

  res.clearCookie(tokenName, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });

  if (!refreshToken) {
    return;
  }

  const payload = await verifyRefreshToken(refreshToken);
  await revokeRefreshToken(payload.tokenId);
};
