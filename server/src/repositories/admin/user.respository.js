import User from "../../models/user.model.js";

export const countUsers = async (match = {}) => {
  return User.countDocuments(match);
};