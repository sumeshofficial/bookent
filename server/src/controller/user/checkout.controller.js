import {
  checkoutPageDetails,
  getTicket,
  orderStatus,
  paypalCaptureOrder,
  paypalCreateOrder,
} from "../../services/user/checkout/checkout.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
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
  const result = await paypalCreateOrder(ticketDetails, user._id);

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

  await paypalCaptureOrder(orderID, lockId, user._id);

  sendResponse(res, { message: "Payment Captured" }, STATUS_CODE.CREATED);
});

// Check Order Status
export const getOrderStatusController = asyncHandler(async (req, res) => {
  const paypalOrderId = req.params.orderId;
  if (!paypalOrderId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const status = await orderStatus(paypalOrderId);

  sendResponse(res, { status }, STATUS_CODE.SUCCESS);
});

export const getTicketController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const user = req.user

  if (!orderId) {
    throw new Error(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const ticket = await getTicket(orderId);

  sendResponse(res, ticket, STATUS_CODE.SUCCESS);
});
