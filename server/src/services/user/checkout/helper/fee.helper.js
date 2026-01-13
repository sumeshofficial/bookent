import { FEE_CONFIG } from "../../../../utility/constants/constants.js";

export const calculateBaseFee = (ticketPrice) => {
  const baseFee = ticketPrice * FEE_CONFIG.bookingFeePercent;
  return +baseFee.toFixed(2);
};

export const calculateGrandTotal = ({ orderAmount, bookingFee }) => {
  return +(orderAmount + bookingFee).toFixed(2);
};
