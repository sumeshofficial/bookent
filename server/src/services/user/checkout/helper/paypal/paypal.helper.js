import Decimal from "decimal.js";
import { CheckoutPaymentIntent } from "@paypal/paypal-server-sdk";
import { CURRENCY_CODE } from "../../../../../utility/constants/constants.js";

export const preparePaypalBreakdown = (section, pricing) => {
  const grandTotal = pricing.grandTotal;
  const gst = pricing.gst;
  const bookingFee = pricing.bookingFee;
  const sectionPrice = section.price;
  const baseBookingPrice = pricing.baseFee;

  const finalUnitAmount = sectionPrice.toFixed(2);
  const finalItemTotal = new Decimal(finalUnitAmount)
    .times(section.qty)
    .toFixed(2, Decimal.ROUND_HALF_UP);

  const finalGst = gst.toFixed(2, Decimal.ROUND_HALF_UP);
  const finalBookingFeeRaw = bookingFee.toFixed(2, Decimal.ROUND_HALF_UP);
  const finalBaseFee = baseBookingPrice.toFixed(2, Decimal.ROUND_HALF_UP);

  const validatedSum = new Decimal(finalItemTotal)
    .plus(finalGst)
    .plus(finalBookingFeeRaw);

  const finalGrandTotal = grandTotal.toFixed(2, Decimal.ROUND_DOWN);
  const differenceToAbsorb = new Decimal(finalGrandTotal).minus(validatedSum);

  const finalBookingFee = new Decimal(finalBookingFeeRaw)
    .plus(differenceToAbsorb)
    .toFixed(2);

  return {
    finalUnitAmount,
    finalItemTotal,
    finalGst,
    finalBookingFee,
    finalBaseFee,
    finalGrandTotal,
  };
};

export const buildPaypalOrderPayload = (lockId, event, section, breakdown) => {
  return {
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          referenceId: lockId,
          description: `${event.title} - ${section.name} (${section.qty} tickets)`,

          amount: {
            currencyCode: CURRENCY_CODE.USD,
            value: breakdown.finalGrandTotal,
            breakdown: {
              itemTotal: {
                currencyCode: CURRENCY_CODE.USD,
                value: breakdown.finalItemTotal,
              },
              taxTotal: {
                currencyCode: CURRENCY_CODE.USD,
                value: breakdown.finalGst,
              },
              handling: {
                currencyCode: CURRENCY_CODE.USD,
                value: breakdown.finalBookingFee,
              },
            },
          },

          items: [
            {
              name: event.title,
              description: `${section.name} Section`,
              quantity: `${section.qty}`,
              unitAmount: {
                currencyCode: CURRENCY_CODE.USD,
                value: breakdown.finalUnitAmount,
              },
            },
          ],
        },
      ],
    },
    prefer: "return=minimal",
  };
};

export const buildPaypalOrderCapturePayload = (orderID) => {
  return {
    id: orderID,
    prefer: "return=representation",
  };
};
