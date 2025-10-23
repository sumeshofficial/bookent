import Organizer from "../models/organizer.model.js";

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

export const checkOrganizer = ({ userId }) => {
  return Organizer.findOne({ userId });
};
