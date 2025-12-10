import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/envConfig.js";

// Check user is exists
export const isUserExists = async (email) => {
  return await User.exists({ email });
};

// Create a new user
export const createUser = async ({ ...data }) => {
  const user = await User.create(data);
  return user;
};

// Checking the user is still active
export const findUserById = async (id) => {
  return await User.findById(id);
};

// Find user by email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Find user
export const finduser = async (email) => {
  const user = await User.findOne({ email }).select("+password");
  return user;
};

// Update password
export const updatePassword = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  user.password = password;
  await user.save();

  return user;
};

// Verify Token and Get User
export const verifyTokenAndGetUser = async (token) => {
  const decoded = jwt.verify(token, ENV.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Update user
export const updateUserService = async ({ id, data }) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { $set: data },
    { new: true }
  );

  return updatedUser;
};

// Update user status
export const updateUserStatus = async (userId, newStatus) => {
  await User.updateOne(
    { _id: userId },
    {
      status: newStatus,
    }
  );
};
