import { FEE_CONFIG } from "../constants/feeConfig";

export const calculateBaseFee = (ticketPrice) => {
  const baseFee = ticketPrice * FEE_CONFIG.bookingFeePercent; // 7%
  return +baseFee.toFixed(2);
};