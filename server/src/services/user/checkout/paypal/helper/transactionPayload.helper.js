import {
  CURRENCY_CODE,
  PAYMENT_METHOD,
  TRANSACTION_DIRECTION,
  TRANSACTION_REASON,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../../../../../utility/constants/constants.js";

export const buildTransactionPayload = (order, capture, event) => {
  return {
    order_id: order._id,
    paymentMethod: PAYMENT_METHOD.PAYPAL,
    paypal_capture_id: capture.id,
    type: TRANSACTION_TYPE.SALE,
    status: TRANSACTION_STATUS.COMPLETED,
    transaction_direction: TRANSACTION_DIRECTION.CREDIT,

    amount: {
      value: Number(capture.amount.value),
      currency: capture.amount.currency_code,
    },

    transaction_fees: {
      value: Number(
        capture.seller_receivable_breakdown?.paypal_fee?.value || 0
      ),
      currency:
        capture.seller_receivable_breakdown?.paypal_fee?.currency_code ||
        CURRENCY_CODE.USD,
    },

    net_amount: {
      value: Number(
        capture.seller_receivable_breakdown?.net_amount?.value ||
          capture.amount.value
      ),
      currency:
        capture.seller_receivable_breakdown?.net_amount?.currency_code ||
        capture.amount.currency_code,
    },

    wallet_id: null,

    initiated_by: order.userId,

    reason: TRANSACTION_REASON.BOOKING_PAYMENT,

    receiver_model: null,
    receiver_id: null,

    processor_response: capture,
    metadata: {
      paypal_event_id: event.id,
      paypal_event_type: event.event_type,
    },
  };
};
