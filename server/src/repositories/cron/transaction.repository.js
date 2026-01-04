import Transaction from "../../models/transaction.model.js";
import {
  TRANSACTION_DIRECTION,
  TRANSACTION_REASON,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../utility/constants/constants.js";

export const createRefundTransaction = async ({
  order,
  refundAmount,
  session,
}) => {
  await Transaction.create(
    [
      {
        order_id: order._id,

        paymentMethod: order.paymentMethod,

        type: TRANSACTION_TYPE.REFUND,
        status: TRANSACTION_STATUS.COMPLETED,

        transaction_direction: TRANSACTION_DIRECTION.DEBIT,

        amount: {
          value: refundAmount,
          currency: order.total_amount.currency,
        },

        transaction_fees: {
          value: 0,
        },

        net_amount: {
          value: refundAmount,
          currency: order.total_amount.currency,
        },

        receiver_model: "User",
        receiver_id: order.userId,

        initiated_by: order.userId,

        reason: TRANSACTION_REASON.WALLET_REFUND,

        metadata: {
          orderId: order.orderId,
          eventId: order.eventId,
          refundReason: order.refundReason,
        },
      },
    ],
    { session }
  );
};
