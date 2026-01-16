import Organizer from "../../models/organizer.model.js";
import Stadium from "../../models/stadium.model.js";

// Create stadium
export const createStadiumRepo = async (payload) => {
  const stadium = await Stadium.create(payload);
  return stadium;
};

// Check organizer exists
export const checkOrganizerWithUserId = async (userId) => {
  const organizer = await Organizer.findOne({ userId }).lean();
  return organizer;
};

// Find stadium
export const findStadiumWithId = async (organizerId, stadiumId) => {
  const stadium = await Stadium.findOne({
    _id: stadiumId,
    organizerId,
    isDeleted: false,
  }).lean();
  return stadium;
};

// Delete Stadium
export const softDeleteStadiumService = async (stadiumId, organizerId) => {
  return Stadium.updateOne(
    { _id: stadiumId, organizerId },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    }
  );
};

export const findStadiums = async () => {
  return Stadium.find({ isDeleted: false }).lean();
};

export const isStadiumExists = async (query) => {
  return Stadium.exists(query);
};

export const getStadiums = async ({ query, sortOption, skip, limit }) => {
  return Stadium.find(query).sort(sortOption).skip(skip).limit(limit).lean();
};

export const countStadiums = async (query) => {
  return Stadium.countDocuments(query);
};

// Find stadium
export const findStadium = async (organizerId, stadiumSlug) => {
  return Stadium.findOne({
    organizerId,
    slug: stadiumSlug,
    isDeleted: false,
  }).lean();
};

// Update stadium
export const updateStadiumService = async (stadiumId, data) => {
  return Stadium.findByIdAndUpdate(stadiumId, { $set: data }, { new: true });
};