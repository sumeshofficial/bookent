import axios from "axios";
import { getPayPalAccessToken } from "./helper/getPaypalAccessToken.js";
import { AppError } from "../../../../utility/helpers.js";
import { STATUS_CODE } from "../../../../utility/constants/statusCode.js";
import { ERRORS } from "../../../../utility/constants/constants.js";

export async function verifyPayPalWebhook(payload) {
  const accessToken = await getPayPalAccessToken();

  const response = await axios.post(
    "https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.data.verification_status !== "SUCCESS") {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.INVALID_WEBHOOK.CODE,
      ERRORS.INVALID_WEBHOOK.MSG
    );
  }

  return true;
}
