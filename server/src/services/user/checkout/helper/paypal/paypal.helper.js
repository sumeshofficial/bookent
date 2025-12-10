import Decimal from "decimal.js";
import { convertToUSD } from "../../../../../utility/helpers.js";
import { CheckoutPaymentIntent } from "@paypal/paypal-server-sdk";

export const preparePaypalBreakdown = (section, pricing, rateDecimal) => {
  const usdGrandTotal = convertToUSD(pricing.grandTotal, rateDecimal);
  const usdGst = convertToUSD(pricing.gst, rateDecimal);
  const usdBookingFee = convertToUSD(pricing.bookingFee, rateDecimal);
  const usdSectionPrice = convertToUSD(section.price, rateDecimal);

  const finalUnitAmount = usdSectionPrice.toFixed(2);
  const finalItemTotal = new Decimal(finalUnitAmount)
    .times(section.qty)
    .toFixed(2, Decimal.ROUND_HALF_UP);

  const finalGst = usdGst.toFixed(2, Decimal.ROUND_HALF_UP);
  const finalBookingFeeRaw = usdBookingFee.toFixed(2, Decimal.ROUND_HALF_UP);

  const validatedSum = new Decimal(finalItemTotal)
    .plus(finalGst)
    .plus(finalBookingFeeRaw);

  const finalGrandTotal = usdGrandTotal.toFixed(2, Decimal.ROUND_DOWN);
  const differenceToAbsorb = new Decimal(finalGrandTotal).minus(validatedSum);

  const finalBookingFee = new Decimal(finalBookingFeeRaw)
    .plus(differenceToAbsorb)
    .toFixed(2);

  return {
    finalUnitAmount,
    finalItemTotal,
    finalGst,
    finalBookingFee,
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
            currencyCode: "USD",
            value: breakdown.finalGrandTotal,
            breakdown: {
              itemTotal: {
                currencyCode: "USD",
                value: breakdown.finalItemTotal,
              },
              taxTotal: {
                currencyCode: "USD",
                value: breakdown.finalGst,
              },
              handling: {
                currencyCode: "USD",
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
                currencyCode: "USD",
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
