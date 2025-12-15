import {
  getOrderForPaypal,
  updateOrder,
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
import { findUserById } from "../../../../repositories/user/user.repository.js";
import { sendEmailConfirmation } from "./helper/ticketEmailConfirmation.js";
import { ENV } from "../../../../config/env.conf.js";
import jwt from "jsonwebtoken";
import { updateAdminWallet } from "../../../../repositories/admin/updateAdminWallet.js";

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
      await updateAdminWallet(payload.net_amount, session);

      await updateOrderStatus(order._id, ORDER_STATUS.PAID, session);
      await makeTicketSold(order.eventId, order.seat, session);
      const qrData = jwt.sign(
        {
          orderId: order._id,
          eventId: event._id,
          userId: order.userId,
        },
        ENV.QR_DATA_JWT_SECRET,
        { expiresIn: ENV.CREATE_ORDER_QR_CODE_EXPIRY }
      );

      const payloadForUpdate = {
        status: ORDER_STATUS.CONFIRMED,
        qrData,
      };
      order = await updateOrder(order._id, payloadForUpdate, session);
    });

    await finalizeBookingLocks({
      lockIds: [order.lockId],
      userId: order.userId.toString(),
    });

    const user = await findUserById(order.userId);

    await sendEmailConfirmation(user, order);
  } catch (error) {
    if (order && order.status === ORDER_STATUS.PAID) {
      await updateOrderStatus(order._id, ORDER_STATUS.REFUND_REQUIRED);
    }
    console.log(error);
  } finally {
    session.endSession();
  }
};
