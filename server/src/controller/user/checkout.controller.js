import {
  checkoutPageDetails,
  paypalCaptureOrder,
  paypalCreateOrder,
} from "../../services/user/checkout/checkout.service.js";
import { validateSeatLock } from "../../services/user/checkout/helper/validateSeatLock.helper.js";
import { STATUS_CODE, ERRORS } from "../../utility/constants.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

// Checkout page deatails
export const checkoutDetailsController = asyncHandler(async (req, res) => {
  const { lockId } = req.body;
  const user = req.user;

  if (!lockId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const ticketDetails = await checkoutPageDetails(lockId, user._id);

  sendResponse(res, ticketDetails, STATUS_CODE.SUCCESS);
});

// Paypal create order controller
export const createPaypalOrderController = asyncHandler(async (req, res) => {
  const { lockId } = req.body;
  const user = req.user;

  if (!lockId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const ticketDetails = await checkoutPageDetails(lockId, user._id);
  const result = await paypalCreateOrder(ticketDetails);

  sendResponse(res, result, STATUS_CODE.CREATED);
});

// Capture Paypal order controller
export const capturePaypalOrderController = asyncHandler(async (req, res) => {
  const { lockId, orderID } = req.body;
  const user = req.user;

  if (!lockId || !orderID) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  await validateSeatLock(lockId, user._id);
  const result = await paypalCaptureOrder(orderID);

  sendResponse(res, result, STATUS_CODE.CREATED);
});
