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
export const updateRequest = async ({ id, status, reason }) => {
  const organizer = await Organizer.findById(id);

  organizer.status = status;
  if (status === "rejected") {
    organizer.rejectReason = reason;
  }
  if (status === "approved") {
    organizer.isVerified = true;
    organizer.rejectReason = null;
  }
  await organizer.save();

  return organizer;
};

// Find Stadiums
export const findStadiums = async () => {
  const stadiums = await Stadium.find({ isDeleted: false }).lean();
  return stadiums;
};

// Check stadium is exists
export const stadiumExists = async (name, stadiumId) => {
  const query = {
    "stadiumDetails.stadiumName": {
      $regex: new RegExp(`^${name}$`, "i"),
    },
    isDeleted: false,
  };

  if (stadiumId) {
    query._id = { $ne: stadiumId };
  }

  return Stadium.exists(query);
};

// Fetch events
export const fetchEventsWithOrganizerId = async ({
  query,
  sortOption,
  skip,
  limit,
}) => {
  console.log(limit);
  const events = await Event.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await Event.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  return { events, total, totalPages };
};

// Fetch Event by id
export const findEvent = async (organizerId, eventSlug) => {
  return await Event.findOne({
    slug: eventSlug,
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

// Update organizer profile
export const updateOrganizerService = async ({ id, data }) => {
  const updateFields = {};

  if (data.fullname) {
    updateFields.fullname = data.fullname;
  }

  if (data.email) {
    updateFields.email = data.email;
  }

  if (data.status) {
    updateFields.status = data.status;
  }

  if (data.profileImage) {
    updateFields.profileImage = data.profileImage;
  }

  if (data.organizationDetails) {
    Object.entries(data.organizationDetails).forEach(([key, value]) => {
      updateFields[`organizationDetails.${key}`] = value;
    });
  }

  if (data.bankAccountDetails) {
    Object.entries(data.bankAccountDetails).forEach(([key, value]) => {
      updateFields[`bankAccountDetails.${key}`] = value;
    });
  }

  const updatedOrganizer = await Organizer.findOneAndUpdate(
    { _id: id },
    {
      $set: updateFields,
    },
    { new: true, runValidators: true, lean: true }
  );

  return updatedOrganizer;
};

// Find all stadiums for organizer
export const findAllStadiumsWithOrgnaizerId = async ({
  query,
  sortOption,
  skip,
  limit,
}) => {
  const stadiums = await Stadium.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Stadium.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  return { stadiums, total, totalPages };
};

// Find stadium
export const findStadium = async (organizerId, stadiumSlug) => {
  const stadium = await Stadium.findOne({
    organizerId,
    slug: stadiumSlug,
    isDeleted: false,
  }).lean();
  return stadium;
};

// Update stadium
export const updateStadiumService = async (stadiumId, data) => {
  return Stadium.findByIdAndUpdate(stadiumId, { $set: data }, { new: true });
};
