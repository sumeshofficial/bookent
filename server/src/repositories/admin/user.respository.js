import User from "../../models/user.model.js";

export const countUsers = async (match = {}) => {
  return User.countDocuments(match);
};

export const getAllUsersService = async ({
  query,
  sortOption,
  skip,
  limit,
}) => {
  return User.find(query).sort(sortOption).skip(skip).limit(limit);
};