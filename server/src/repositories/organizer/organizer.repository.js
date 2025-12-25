import Organizer from "../../models/organizer.model.js";

// Check organizer exists
export const checkOrganizer = async (userId) => {
  return Organizer.findOne({ userId });
};
