import {
  CURRENCY_CODE,
  ORDER_STATUS,
  PAYMENT_METHOD,
} from "../../../../utility/constants/constants.js";

export const buildDbOrderPayload = ({
  result,
  userId,
  lockId,
  event,
  section,
  breakdown,
  qrData,
}) => {
  return {
    userId,
    status: ORDER_STATUS.PENDING_PAYPAL_ORDER,
    lockId,
    eventId: event._id,
    eventDetails: event,
    seat: {
      sectionId: section._id,
      qty: section.qty,
      price: section.price,
      category: section.name,
    },
    total_amount: {
      value: breakdown.finalGrandTotal,
      currency: CURRENCY_CODE.USD,
    },
    pricingBreakDown: {
      ticketPrice: breakdown.finalUnitAmount,
      orderAmount: breakdown.finalItemTotal,
      baseFee: breakdown.finalBaseFee,
      gst: breakdown.finalGst,
      bookingFee: breakdown.finalBookingFee,
      grandTotal: breakdown.finalGrandTotal,
    },
    qrData,
    paymentMethod: PAYMENT_METHOD.PAYPAL,
    paypalOrderId: result.id,
  };
};