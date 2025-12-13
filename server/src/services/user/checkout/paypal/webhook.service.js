import {
  getOrderForPaypal,
  updateOrderStatus,
} from "../../../../repositories/user/order.repository.js";
import {
  ERRORS,
  ORDER_STATUS,
} from "../../../../utility/constants/constants.js";
import { createMoneyTransaction } from "../../../../repositories/user/transaction.repository.js";
import { buildTransactionPayload } from "./helper/transactionPayload.helper.js";
import mongoose from "mongoose";
import { AppError } from "../../../../utility/helpers.js";
import { STATUS_CODE } from "../../../../utility/constants/statusCode.js";
import { makeTicketSold } from "../../../../repositories/user/event.repository.js";
import { finalizeBookingLocks } from "../../seatLock.service.js";
// import { finalizeTicketLogic } from "../ticket/ticket.service.js";

export const processPaypalCapture = async (capture, event) => {
  const session = await mongoose.startSession();
  let order = null;

  try {
    await session.withTransaction(async () => {
      const paypalOrderId = capture?.supplementary_data?.related_ids?.order_id;

      order = await getOrderForPaypal(paypalOrderId, session);

      if (!order) {
        throw new AppError(
          STATUS_CODE.NOTFOUND,
          ERRORS.ORDER_NOTFOUND_FOR_PAYPAL_ID.CODE,
          ERRORS.ORDER_NOTFOUND_FOR_PAYPAL_ID.MSG
        );
      }

      const payload = buildTransactionPayload(order, capture, event);
      await createMoneyTransaction(payload, session);

      await updateOrderStatus(order._id, ORDER_STATUS.PAID, session);
      await makeTicketSold(order.eventId, order.seat, session);
      await updateOrderStatus(order._id, ORDER_STATUS.CONFIRMED, session);
    });

    await finalizeBookingLocks({
      lockIds: [order.lockId],
      userId: order.userId.toString(),
    });
  } catch (error) {
    if (order && order.status === ORDER_STATUS.PAID) {
      await updateOrderStatus(order._id, ORDER_STATUS.REFUND_REQUIRED);
    }
    console.log(error);
  } finally {
    session.endSession();
  }
};
