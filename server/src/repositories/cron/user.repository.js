import User from "../../models/user.model.js";

export const updateWallet = async (order, refundAmount, session) => {
  await User.updateOne(
    { _id: order.userId },
    {
      $inc: { wallet: refundAmount },
    },
    { session }
  );
};
