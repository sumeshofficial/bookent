import Organizer from "../models/organizer.model.js";
import dotenv from "dotenv";
import Stadium from "../models/stadium.model.js";
import Event from "../models/event.model.js";
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
export const findStadiums = async () => {
  const stadiums = await Stadium.find().lean();
  return stadiums;
};

// Check stadium is exists
export const stadiumExists = async (name) => {
  const exists = await Stadium.exists({
    "stadiumDetails.stadiumName": { $regex: new RegExp(`^${name}$`, "i") },
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
  return await Event.findOne({
    _id: eventId,
    organizer: organizerId,
    isDeleted: false,
  });
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

export const eventExists = async (eventId) => {
  return Event.exists({ _id: eventId, isDeleted: false });
};

// Delete Event
export const deleteEventService = async (organizerId, eventId) => {
  console.log(organizerId, eventId);
  return await Event.updateOne(
    { organizer: organizerId, _id: eventId },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    }
  );
};

export const updateOrganizerService = async ({ id, data }) => {
  const updatedUser = await Organizer.findOneAndUpdate(
    { _id: id },
    { $set: data },
    { new: true, runValidators: true, lean: true }
  );

  return updatedUser;
};
