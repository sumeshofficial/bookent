import Order from "../../models/order.model.js";
import {
  ORDER_STATUS,
  REFUND_STATUS,
} from "../../utility/constants/constants.js";

export const enqueueEventRefund = async (eventId, session) => {
  await Order.updateMany(
    {
      eventId,
      status: ORDER_STATUS.CONFIRMED,
      refundStatus: REFUND_STATUS.NOT_REQUIRED,
    },
    {
      $set: {
        refundStatus: REFUND_STATUS.PENDING,
        refundReason: "EVENT_CANCELLED",
      },
    },
    session
  );
};
