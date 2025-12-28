import jwt from "jsonwebtoken";
import { ENV } from "../../../../config/env.conf.js";

export const generateOrderQr = (order) => {
  return jwt.sign(
    {
      orderId: order.orderId,
      eventId: order.eventId,
      userId: order.userId,
    },
    ENV.QR_DATA_JWT_SECRET,
    { expiresIn: ENV.CREATE_ORDER_QR_CODE_EXPIRY }
  );
};
