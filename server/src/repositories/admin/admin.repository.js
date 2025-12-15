import User from "../../models/user.model.js";

export const getAdminWallet = async () => {
  return User.findOne({ role: "admin" });
};
