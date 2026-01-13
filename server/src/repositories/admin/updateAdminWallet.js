import User from "../../models/user.model.js";

export const updateAdminWallet = async (amount, session) => {
  const res = await User.updateOne(
    { role: "admin" },
    { $inc: { wallet: amount } },
    { session }
  );

  if (res.modifiedCount === 0) {
    throw new Error("Admin wallet update failed");
  }
};
