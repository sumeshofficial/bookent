import {
  CURRENCY_CODE,
  ORDER_STATUS,
  PAYMENT_METHOD,
} from "../../../../utility/constants/constants.js";
import { generatePublicOrderId } from "../../helper/generateOrderId.js";

export const buildDbOrderPayloadForWallet = ({
  userId,
  event,
  section,
  breakdown,
  couponCode,
}) => {
  const orderId = generatePublicOrderId();
  return {
    userId,
    orderId,
    status: ORDER_STATUS.PAID,
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
      discount: breakdown.discountAmount || 0,
      grandTotal: breakdown.finalGrandTotal,
    },
    appliedCoupon: couponCode
      ? {
          code: couponCode,
          discount: breakdown.discountAmount,
        }
      : null,
    qrData: null,
    paymentMethod: PAYMENT_METHOD.WALLET,
  };
};
