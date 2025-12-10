import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import Organizer from "../models/organizer.model.js";
import {
  blacklistToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "./token.service.js";
import { ENV } from "../config/envConfig.js";

// Check user is already exists
export const isUserExists = async (email) => {
  return await User.exists({ email });
};

// Find user
export const finduser = async (email) => {
  const user = await User.findOne({ email }).select("+password");
  return user;
};

// Create a new user
export const createUser = async ({ ...data }) => {
  const user = await User.create(data);
  return user;
};

// Update password
export const updatePassword = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  user.password = password;
  await user.save();

  return user;
};

// handling google authentication
export const handleGoogleAuth = async (profile) => {
  const email = profile.emails?.[0]?.value;
  const displayName = profile.displayName;
  const profileImage = profile?.photos?.[0]?.value;
  const role = profile.role;
  const googleId = profile.id;

  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser?.authProvider !== "google") {
    throw new Error("User already exists. Please login instead.");
  }

  if (existingUser?.authProvider === "google") {
    return existingUser;
  }

  return await User.create({
    fullname: displayName,
    email,
    role,
    googleId,
    profileImage,
    isVerified: true,
    authProvider: "google",
  });
};

// Checking the user is still active
export const findUserById = async (id) => {
  return await User.findById(id);
};

// Find user by email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Find organizer by id
export const findOrganizerById = async (id) => {
  return await Organizer.findById(id);
};

// Verify Token and Get User
export const verifyTokenAndGetUser = async (token) => {
  const decoded = jwt.verify(token, ENV.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password").lean();
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Find Admin
export const findAdmin = async ({ email }) => {
  return await User.findOne({ email });
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
