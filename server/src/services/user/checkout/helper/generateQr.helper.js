import jwt from "jsonwebtoken";
import { ENV } from "../../../../config/env.conf.js";

export const generateOrderQr = (order) => {
  return jwt.sign(
    {
      orderId: order.orderId,
      eventId: order.eventId._id || order.eventDetails._id,
      userId: order.userId,
    },
    ENV.QR_DATA_JWT_SECRET,
    { expiresIn: ENV.CREATE_ORDER_QR_CODE_EXPIRY }
  );
};
