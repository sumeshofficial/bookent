import {
  checkoutPageDetails,
  getTicket,
  orderStatus,
  paypalCaptureOrder,
  paypalCreateOrder,
  walletCreateOrder,
} from "../../services/user/checkout/checkout.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

// Checkout page deatails
export const checkoutDetailsController = asyncHandler(async (req, res) => {
  const { lockId, appliedCoupon } = req.body;
  const user = req.user;

  if (!lockId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const ticketDetails = await checkoutPageDetails(
    lockId,
    user._id,
    appliedCoupon
  );

  sendResponse(res, ticketDetails, STATUS_CODE.SUCCESS);
});

// Paypal create order controller
export const createPaypalOrderController = asyncHandler(async (req, res) => {
  const { lockId, couponCode } = req.body;
  const user = req.user;

  if (!lockId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const ticketDetails = await checkoutPageDetails(lockId, user._id);
  const result = await paypalCreateOrder(ticketDetails, user._id, couponCode);

  sendResponse(res, result, STATUS_CODE.CREATED);
});

// Capture Paypal order controller
export const capturePaypalOrderController = asyncHandler(async (req, res) => {
  const { lockId, orderID, couponCode = "" } = req.body;
  const user = req.user;

  if (!lockId || !orderID) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const order = await paypalCaptureOrder(orderID, lockId, user._id, couponCode);

  sendResponse(res, order, STATUS_CODE.CREATED);
});

// Check Order Status
export const getOrderStatusController = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user._id;
  if (!orderId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const status = await orderStatus(orderId, userId);

  sendResponse(res, { status }, STATUS_CODE.SUCCESS);
});

export const getTicketController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  if (!orderId) {
    throw new Error(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const ticket = await getTicket(orderId, userId);

  sendResponse(res, ticket, STATUS_CODE.SUCCESS);
});

export const createOrderWithWallet = asyncHandler(async (req, res) => {
  const { lockId, couponCode } = req.body;
  const user = req.user;

  if (!lockId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const ticketDetails = await checkoutPageDetails(lockId, user._id);
  const result = await walletCreateOrder(ticketDetails, user, couponCode);

  sendResponse(res, result, STATUS_CODE.CREATED);
});
