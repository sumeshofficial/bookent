import User from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

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
export const createUser = async ({
  fullname,
  email,
  password,
  authProvider,
}) => {
  const newUser = {
    fullname,
    email,
    password,
    authProvider,
  };

  const user = await User.create(newUser);
  return user;
};

// handling google authentication
export const handleGoogleAuth = async (profile) => {
  const email = profile.emails?.[0]?.value;
  const displayName = profile.displayName;
  const profileImage = profile.photos?.[0]?.value;
  const role = profile.role;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      fullname: displayName,
      email,
      role,
      profileImage,
      isVerified: true,
      authProvider: "google",
    });
  }

  return user;
};

// Checking the user is still active
export const findUserById = async (id) => {
  return await User.findById(id);
};

// Verify Token and Get User
export const verifyTokenAndGetUser = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");
  if (!user) throw new Error("User not found");

  return user;
};