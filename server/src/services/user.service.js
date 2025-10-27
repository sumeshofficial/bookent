import dotenv from "dotenv";
import User from "../models/user.model.js";
dotenv.config();

// Update user
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

// Get all user
export const getAllUsers = async ({
  role,
  limit,
  skip,
  search,
  sort,
  status,
}) => {
  try {
    const query = {
      role,
      ...(search
        ? {
            $or: [
              { fullname: { $regex: search, $options: "i" } },
              { email: { $regex: `^${search}[^@]*`, $options: "i" } },
            ],
          }
        : {}),
      ...(status && status !== "all" ? { status } : {}),
    };

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "highestSpend") sortOption = { spending: -1 };
    if (sort === "lowestSpend") sortOption = { spending: 1 };

    const users = await User.find( query )
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({ ...query, role: "user" });
    return { totalUsers, users };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update user status
export const updateUserStatus = async ({ userId, newStatus }) => {
  try {
    await User.updateOne(
      { _id: userId },
      {
        status: newStatus,
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};
