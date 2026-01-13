import Transaction from "../../models/transaction.model.js";
import {
  MONGO_SCHEMA,
  PAYMENT_METHOD,
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

        receiver_model: MONGO_SCHEMA.USER,
        receiver_id: order.userId,

        initiated_by_model: MONGO_SCHEMA.USER,
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

export const createPayoutTransaction = async ({
  payoutResult,
  payoutAmount,
  event,
  session,
  adminId,
}) => {
  await Transaction.create(
    [
      {
        order_id: null,
        paymentMethod: PAYMENT_METHOD.PAYPAL,
        paypal_capture_id: payoutResult.payout_batch_id,
        type: TRANSACTION_TYPE.TRANSFER,
        status: TRANSACTION_STATUS.COMPLETED,
        transaction_direction: TRANSACTION_DIRECTION.DEBIT,
        amount: {
          value: payoutAmount,
          currency: "USD",
        },
        transaction_fees: {
          value: 0,
        },
        net_amount: {
          value: payoutAmount,
          currency: "USD",
        },
        receiver_model: MONGO_SCHEMA.ORGANIZER,
        receiver_id: event.organizer,

        initiated_by_model: MONGO_SCHEMA.USER,
        initiated_by: adminId,

        reason: TRANSACTION_REASON.ORGANIZER_PAYOUT,
        metadata: {
          eventId: event._id,
          payout_batch_id: payoutResult.payout_batch_id,
        },
      },
    ],
    { session }
  );
};
