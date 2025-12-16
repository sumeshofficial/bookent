import Order from "../../models/order.model.js";

export const verifyUserTicket = async (orderId, userId) => {
  console.log(orderId, userId);
  return Order.findOneAndUpdate(
    { _id: orderId, userId: userId },
    {
      $set: {
        "qrData.isUsed": true,
        "qrData.usedAt": new Date(),
      },
    },
    { new: true }
  );
};
