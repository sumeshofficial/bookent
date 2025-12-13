import dotenv from "dotenv";
import User from "../models/user.model.js";
import axios from "axios";
import Event from "../models/event.model.js";
import { ENV } from "../config/env.conf.js";
dotenv.config();

const GOOGLE_MAP_URI = ENV.GOOGLE_MAP_URI;

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
  return await Event.find({
    $or: search,
    eventStatus: "Published",
    isDeleted: false,
  })
    .populate("stadium")
    .sort({ createdAt: -1 })
    .lean();
};

export const filterAndSortService = async ({
  query,
  sortQuery,
  skip,
  limit,
}) => {
  const events = await Event.find(query)
    .populate("stadium")
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .lean();

  return events;
};

// Event details
export const eventDetails = async (eventSlug) => {
  return await Event.findOne({
    slug: eventSlug,
    eventStatus: { $nin: ["Draft", "Completed"] },
    isDeleted: false,
  })
    .populate("stadium")
    .populate("organizer")
    .lean();
};
