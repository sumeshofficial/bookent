import dotenv from "dotenv";
import User from "../models/user.model.js";
import axios from "axios";
dotenv.config();

const GOOGLE_MAP_URI = process.env.GOOGLE_MAP_URI;

// Update user
export const updateUserService = async ({ id, data }) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { $set: data },
    { new: true }
  );

  return updatedUser;
};

// Get all user
export const getAllUsers = async ({ limit, skip, search, sort, status }) => {
  const query = {
    role: "user",
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
  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }
  if (sort === "highestSpend") {
    sortOption = { spending: -1 };
  }
  if (sort === "lowestSpend") {
    sortOption = { spending: 1 };
  }

  const users = await User.find(query).sort(sortOption).skip(skip).limit(limit);

  const totalUsers = await User.countDocuments({ ...query, role: "user" });
  return { totalUsers, users };
};

// Update user status
export const updateUserStatus = async ({ userId, newStatus }) => {
  await User.updateOne(
    { _id: userId },
    {
      status: newStatus,
    }
  );
};

// Reverse Geocoding
export const reverseGeocoding = async ({ lat, lng }) => {
  const LOCATION_API_KEY = process.env.LOCATION_API_KEY;
  const response = await axios.get(
    `${GOOGLE_MAP_URI}/geocode/json?latlng=${lat},${lng}&key=${LOCATION_API_KEY}`
  );
  if (response.data.status === "OK") {
    const formattedAddress = response.data.results[0].formatted_address;
    return formattedAddress;
  } else {
    return null;
  }
};
