import { calculateGrandTotal } from "../utils/priceCalculator.js";
import { calculateBaseFee } from "../utils/baseFeeCalculator.js";
import { FEE_CONFIG } from "../constants/feeConfig.js";

export const useCheckoutLogic = () => {
  // REPLACE THIS WITH API DATA IN FUTURE
  const ticketPrice = 1500;

  // CALCULATE BASE FEE (Formula)
  const baseFee = calculateBaseFee(ticketPrice);

  // GST (18%) on base fee only
  const gst = +(baseFee * FEE_CONFIG.gstPercent).toFixed(2);

  // Final booking fee
  const bookingFee = +(baseFee + gst).toFixed(2);

  const tickets = {
    title: "Kerala Blasters VS NorthEast United FC",
    count: 2,
    venue: "JLN Stadium, Kochi",
    date: "21 October 2025",
    time: "08:00 PM",
    section: "South Lower (1500)",
  };

  const fees = {
    orderAmount: ticketPrice,
    baseFee,
    gst,
    bookingFee,
  };

  return {
    tickets,
    fees,
    grandTotal: calculateGrandTotal({
      orderAmount: ticketPrice,
      bookingFee,
    }),
  };
};