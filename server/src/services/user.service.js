import dotenv from "dotenv";
import User from "../models/user.model.js";
dotenv.config();

export const updateUserService = async ({ data }) => {
  try {
    const { _id, ...updateData } = data;

    const updatedUser = await User.findOneAndUpdate(
      { _id },
      { $set: updateData }, 
      { new: true, runValidators: true }
    );

    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
