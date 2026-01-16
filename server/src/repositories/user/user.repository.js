import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.conf.js";
import { AppError } from "../../utility/helpers.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { ERRORS } from "../../utility/constants/constants.js";

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

// Update user Password
export const updateUserPassword = async (userId, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.USER_NOT_FOUND.CODE,
      ERRORS.USER_NOT_FOUND.MSG
    );
  }

  user.password = newPassword;
  await user.save();

  return true;
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

export const validatePassword = async (userId, currentPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user || !user.password) {
    return false;
  }

  const isMatch = await user.isValidPassword(currentPassword);
  if (!isMatch) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.PASSWORD_NOT_MATCH.CODE,
      ERRORS.PASSWORD_NOT_MATCH.MSG
    );
  }

  return user;
};

export const updateUserWalletBalance = async (userId, amount, session) => {
  const result = await User.updateOne(
    {
      _id: userId,
      wallet: { $gte: amount },
    },
    {
      $inc: { wallet: -amount },
    }
  ).session(session);

  if (result.modifiedCount === 0) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.INSUFFICIENT_WALLET_BALANCE.CODE,
      ERRORS.INSUFFICIENT_WALLET_BALANCE.MSG
    );
  }
};