import Decimal from "decimal.js";
import { CheckoutPaymentIntent } from "@paypal/paypal-server-sdk";
import { CURRENCY_CODE } from "../../../../../utility/constants/constants.js";

export const preparePaypalBreakdown = (section, pricing) => {
  const unitAmount = new Decimal(section.price).toFixed(2);

  const itemTotal = new Decimal(section.price).mul(section.qty).toFixed(2);
  const orderAmount = new Decimal(pricing.orderAmount).toFixed(2);

  const baseFee = new Decimal(pricing.baseFee).toFixed(2);
  const gst = new Decimal(pricing.gst).toFixed(2);

  const bookingFee = new Decimal(pricing.bookingFee).toFixed(2);

  const grandTotal = new Decimal(pricing.grandTotal).toFixed(2);

  const discount = new Decimal(pricing.discount || 0);

  const expectedTotal = new Decimal(itemTotal)
    .plus(bookingFee)
    .minus(discount)
    .toFixed(2);

  const actualTotal = new Decimal(grandTotal).toFixed(2);

  if (expectedTotal !== actualTotal) {
    throw new Error(
      `PayPal amount mismatch: expected ${expectedTotal}, got ${actualTotal}`
    );
  }

  const discountAmount = discount.toFixed(2);

  return {
    finalUnitAmount: unitAmount,
    finalItemTotal: itemTotal,
    finalOrderAmount: orderAmount,
    finalBaseFee: baseFee,
    finalGst: gst,
    finalBookingFee: bookingFee,
    finalGrandTotal: grandTotal,
    discountAmount,
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
                value: breakdown.finalBaseFee,
              },
              shippingDiscount: {
                currencyCode: CURRENCY_CODE.USD,
                value: breakdown.discountAmount || "0.00",
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
