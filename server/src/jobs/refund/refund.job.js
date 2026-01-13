import mongoose from "mongoose";
import { findAllOrders } from "../../repositories/cron/order.repository.js";
import { updateWallet } from "../../repositories/cron/user.repository.js";
import { createRefundTransaction } from "../../repositories/cron/transaction.repository.js";
import {
  ORDER_STATUS,
  REFUND_STATUS,
} from "../../utility/constants/constants.js";
import logger from "../../config/logger.js";
import { updateAdminWallet } from "../../repositories/admin/updateAdminWallet.js";

export const processRefund = async () => {
  logger.info("Refund job started");
  const query = {
    refundStatus: REFUND_STATUS.PENDING,
  };
  const orders = await findAllOrders(query);

  for (const order of orders) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const refundAmount = order.pricingBreakDown.orderAmount;

      await updateAdminWallet(-refundAmount, session);
      await updateWallet(order, refundAmount, session);

      await createRefundTransaction({
        order,
        refundAmount,
        session,
      });

      order.status = ORDER_STATUS.REFUNDED;
      order.refundStatus = REFUND_STATUS.COMPLETED;
      order.refundedAmount = refundAmount;
      order.refundHistory.push({
        refund_id: `RF-${Date.now()}`,
        status: REFUND_STATUS.COMPLETED,
        amount: refundAmount,
        refundedAt: new Date(),
        reason: order.refundReason,
      });

      await order.save({ session });

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      logger.error(
        `Refund failed for order ${order.orderId} ${error.stack || error.message}`
      );

      await session.abortTransaction();
      session.endSession();

      await order.updateOne({
        refundStatus: REFUND_STATUS.FAILED,
      });
    }
  }
  logger.info("Refund job finished");
};
