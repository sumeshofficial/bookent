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
