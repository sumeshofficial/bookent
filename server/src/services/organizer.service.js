import Organizer from "../models/organizer.model.js";
import dotenv from "dotenv";
import Stadium from "../models/stadium.model.js";
import Event from "../models/event.model.js";
import logger from "../config/logger.js";
dotenv.config();

// Create organizer
export const createOrganizer = async ({
  userId,
  organizationDetails,
  bankAccountDetails,
}) => {
  return Organizer.create({
    userId,
    organizationDetails,
    bankAccountDetails,
  });
};

// Check organizer exists
export const checkOrganizer = async ({ userId }) => {
  const organizer = await Organizer.findOne({ userId });
  return organizer;
};

// Get all organizers
export const getAllOrganizers = async ({
  limit,
  skip,
  search,
  sort,
  status,
}) => {
  const query = {
    ...(search
      ? {
          $or: [
            { "organizationDetails.name": { $regex: search, $options: "i" } },
          ],
        }
      : {}),
    ...(status && status !== "all" ? { status } : {}),
  };

  let sortOption = { createdAt: -1 };
  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }
  if (sort === "a-z") {
    sortOption = { "organizationDetails.name": 1 };
  }
  if (sort === "z-a") {
    sortOption = { "organizationDetails.name": -1 };
  }

  const organizers = await Organizer.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const totalOrganizers = await Organizer.countDocuments({ ...query });
  return { totalOrganizers, organizers };
};

// Update organizer request
export const updateRequest = async ({ id, status }) => {
  const organizer = await Organizer.findById(id);

  organizer.status = status;
  if (status === "approved") {
    organizer.isVerified = true;
  }
  await organizer.save();
};

// Create stadium
export const createStadiumFn = async (payload) => {
  const stadium = await Stadium.create(payload);
  return stadium;
};

// Find Stadiums
export const findStadiums = async (organizerId) => {
  const stadiums = await Stadium.find({ organizerId }).lean();
  return stadiums;
};

// Check stadium is exists
export const stadiumExists = async (name, organizerId) => {
  const exists = await Stadium.exists({
    "stadiumDetails.stadiumName": { $regex: new RegExp(`^${name}$`, "i") },
    organizerId,
  });

  return exists;
};

// Create Event
export const createEvent = async (data) => {
  return await Event.create(data);
};

// Fetch events
export const fetchEventsWithOrganizerId = async ({
  query,
  sortOption,
  skip,
  limit,
}) => {
  const events = await Event.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await Event.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  return { events, total, totalPages };
};

// Fetch Event by id
export const findEvent = async (organizerId, eventId) => {
  return await Event.findOne({ _id: eventId, organizer: organizerId });
};

// Update event
export const updateEvent = async (eventId, newData) => {
  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    { $set: newData },
    { new: true }
  );
  return updatedEvent;
};
