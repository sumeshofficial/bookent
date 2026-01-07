import axios from "axios";
import logger from "../../config/logger.js";
import { findOrganizerById } from "../../repositories/organizer/organizer.repository.js";
import { ENV } from "../../config/env.conf.js";
import { getPayPalAccessToken } from "../user/checkout/paypal/helper/getPaypalAccessToken.js";

const PAYPAL_API_BASE = ENV.PAYPAL_API_BASE;

export const createOrganizerPayout = async ({
  organizerId,
  amount,
  currency = "USD",
}) => {
  const organizer = await findOrganizerById(organizerId);

  if (!organizer || !organizer.paypalEmail) {
    throw new Error("Organizer PayPal email not configured");
  }

  const access_token = await getPayPalAccessToken();

  const payload = {
    sender_batch_header: {
      sender_batch_id: `PO-${organizerId}-${Date.now()}`,
      recipient_type: "EMAIL",
      email_subject: "You have received a payout",
      email_message:
        "Your event payout has been transferred to your PayPal account.",
    },
    items: [
      {
        recipient_wallet: "PAYPAL",
        receiver: organizer.paypalEmail,
        sender_item_id: `ITEM-${Date.now()}`,
        amount: {
          value: amount.toFixed(2),
          currency,
        },
      },
    ],
  };

  const response = await axios.post(
    `${PAYPAL_API_BASE}/v1/payments/payouts`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.data?.batch_header?.payout_batch_id) {
    logger.error("Invalid PayPal payout response", response.data);
    throw new Error("PayPal payout failed");
  }

  logger.info(
    `Organizer payout initiated: ${response.data.batch_header.payout_batch_id}`
  );

  return {
    payout_batch_id: response.data.batch_header.payout_batch_id,
    batch_status: response.data.batch_header.batch_status,
  };
};
