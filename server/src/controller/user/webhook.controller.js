import logger from "../../config/logger.js";
import { verifyPayPalWebhook } from "../../services/user/checkout/paypal/verifyHook.service.js";
import { processPaypalCapture } from "../../services/user/checkout/paypal/webhook.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler } from "../../utility/helpers.js";

export const paypalWebhookController = asyncHandler(async (req, res) => {
  const headers = req.headers;

  const payload = {
    auth_algo: headers["paypal-auth-algo"],
    cert_url: headers["paypal-cert-url"],
    transmission_id: headers["paypal-transmission-id"],
    transmission_sig: headers["paypal-transmission-sig"],
    transmission_time: headers["paypal-transmission-time"],
    webhook_id: process.env.PAYPAL_WEBHOOK_ID,
    webhook_event: req.body,
  };

  const isValid = await verifyPayPalWebhook(payload);

  if (!isValid) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.INVALID_WEBHOOK.CODE,
      ERRORS.INVALID_WEBHOOK.MSG
    );
  }

  const event = req.body;

  switch (event.event_type) {
    case "PAYMENT.CAPTURE.COMPLETED": {
      const capture = event.resource;
      await processPaypalCapture(capture, event);
      break;
    }

    default:
      logger.info(`Unhandled PayPal event: ${event.event_type}`);
  }

  res.sendStatus(STATUS_CODE.SUCCESS);
});
