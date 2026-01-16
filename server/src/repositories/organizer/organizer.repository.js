import Organizer from "../../models/organizer.model.js";

// Check organizer exists
export const checkOrganizer = async (userId) => {
  return Organizer.findOne({ userId });
};

export const findOrganizerById = async (id) => {
  return Organizer.findById(id);
};

// Create organizer
export const createOrganizer = async (payload) => {
  return Organizer.create(payload);
};

export const getOrganizers = async (filters) => {
  return Organizer.find(filters.query)
    .sort(filters.sortOption)
    .skip(filters.skip)
    .limit(filters.limit);
};

export const countOrganizers = async (query) => {
  return Organizer.countDocuments({ ...query });
};

export const updateOrganizer = async (id, updatedFields) => {
  return Organizer.findOneAndUpdate(
    { _id: id },
    {
      $set: updatedFields,
    },
    { new: true, runValidators: true, lean: true }
  );
};
