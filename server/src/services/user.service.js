import dotenv from "dotenv";
import axios from "axios";
import { ENV } from "../config/env.conf.js";
import {
  countUsers,
  getAllUsersService,
} from "../repositories/admin/user.respository.js";
import { findEvents } from "../repositories/user/event.repository.js";
dotenv.config();

const GOOGLE_MAP_URI = ENV.GOOGLE_MAP_URI;

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

  const users = await getAllUsersService({
    query,
    sortOption,
    skip,
    limit,
  });

  const totalUsers = await countUsers({ ...query, role: "user" });
  return { totalUsers, users };
};

// Reverse Geocoding
export const reverseGeocoding = async ({ lat, lng }) => {
  const LOCATION_API_KEY = ENV.LOCATION_API_KEY;
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

// Find Events
export const findEventsForUser = async (searchQuery = "") => {
  const regex = new RegExp(searchQuery, "i");

  const search = [
    { eventTitle: regex },
    { sportType: regex },
    { tags: { $in: [regex] } },
    { stadiumName: regex },
    { city: regex },
  ];
  return await findEvents(search);
};
