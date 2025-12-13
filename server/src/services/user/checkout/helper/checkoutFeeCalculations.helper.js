import { FEE_CONFIG } from "../../../../utility/constants/constants.js";
import { calculateBaseFee, calculateGrandTotal } from "./fee.helper.js";

export const checkoutFeeCalculations = (meta, sectionTicketDetails) => {
  const ticketPrice = Number(sectionTicketDetails);
  const qty = Number(meta.qty);

  const orderAmount = +(ticketPrice * qty).toFixed(2);
  const baseFee = calculateBaseFee(orderAmount);
  const gst = +(baseFee * FEE_CONFIG.gstPercent).toFixed(2);

  const bookingFee = +(baseFee + gst).toFixed(2);

  const grandTotal = calculateGrandTotal({
    orderAmount,
    bookingFee,
  });

  return { ticketPrice, orderAmount, baseFee, gst, bookingFee, grandTotal };
};
