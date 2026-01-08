import {
  CURRENCY_CODE,
  PAYMENT_METHOD,
  TRANSACTION_DIRECTION,
  TRANSACTION_REASON,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../../../utility/constants/constants.js";

export const buildWalletTransactionPayload = (order) => {
  return {
    order_id: order._id,
    paymentMethod: PAYMENT_METHOD.WALLET,
    type: TRANSACTION_TYPE.SALE,
    status: TRANSACTION_STATUS.COMPLETED,
    transaction_direction: TRANSACTION_DIRECTION.CREDIT,

    amount: {
      value: Number(order.total_amount.value),
      currency: CURRENCY_CODE.USD,
    },

    net_amount: {
      value: Number(order.total_amount.value),
      currency: CURRENCY_CODE.USD,
    },

    initiated_by: order.userId,

    reason: TRANSACTION_REASON.BOOKING_PAYMENT,

    receiver_model: null,
    receiver_id: null,
  };
};
