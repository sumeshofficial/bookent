import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import Organizer from "../models/organizer.model.js";
import { reverseGeocoding } from "./user.service.js";

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

  if (existingUser && existingUser.authProvider !== "google") {
    throw new Error("User already exists. Please login instead.");
  }

  if (existingUser.authProvider === "google") {
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

export const findOrganizerById = async (id) => {
  return await Organizer.findById(id);
};

// Verify Token and Get User
export const verifyTokenAndGetUser = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");
  if (!user) throw new Error("User not found");

  if (user.role === "user" && user.location) {
    const response = await reverseGeocoding({
      lat: user.location.latitude,
      lng: user.location.longitude,
    });

    user.location = {
      ...user.location,
      address: response,
    };
  }

  return user;
};

export const findAdmin = async ({ email }) => {
  return await User.findOne({ email });
};
