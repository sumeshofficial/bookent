import { ERRORS, ORDER_STATUS } from "../../../utility/constants/constants.js";
import { AppError } from "../../../utility/helpers.js";
import dotenv from "dotenv";
import { validateEvent } from "../../helper/validateEvent.helper.js";
import { validateSeatLock } from "./helper/validateSeatLock.helper.js";
import { checkoutFeeCalculations } from "./helper/checkoutFeeCalculations.helper.js";
import { validateStadium } from "./helper/validateStadium.helper.js";
import { OrdersController } from "@paypal/paypal-server-sdk";
import { client } from "../../../config/paypal.conf.js";
import {
  buildPaypalOrderCapturePayload,
  buildPaypalOrderPayload,
  preparePaypalBreakdown,
} from "./helper/paypal/paypal.helper.js";
import { formatCheckoutDetails } from "./helper/formatCheckoutDetails.js";
import { extendExpiry } from "../../../repositories/user/redis.repository.js";
import { ENV } from "../../../config/env.conf.js";
import {
  createOrder,
  getOrderForPaypal,
  updateOrderStatus,
} from "../../../repositories/user/order.repository.js";
import { buildDbOrderPayload } from "./helper/buildOrderPayload.js";
import { STATUS_CODE } from "../../../utility/constants/statusCode.js";
import { reserveTicket } from "../../../repositories/user/event.repository.js";
import mongoose from "mongoose";
import { buildTicket } from "./helper/buildTicket.js";
import { applyCouopn } from "../coupon/coupon.service.js";
import {
  getCoupon,
  updateCoupon,
} from "../../../repositories/user/coupon.repository.js";
import {
  getUserCouponUsage,
  updateCouponUsage,
} from "../../../repositories/user/couponUsage.repository.js";
dotenv.config();

const ordersController = new OrdersController(client);
const LOCK_EXTEND_TTL = ENV.LOCK_EXTEND_TTL;
const LOCKMETA_EXTEND_TTL = ENV.LOCKMETA_EXTEND_TTL;

// Checkout page details
export const checkoutPageDetails = async (lockId, userId) => {
  const meta = await validateSeatLock(lockId, userId);
  const event = await validateEvent(meta.eventId);
  const stadium = await validateStadium(event.stadium);

  const sectionTicketDetails = event.ticketSetup?.find(
    (ticket) => ticket.sectionId === meta.sectionId
  )?.seatPrice;

  const sectionShape = stadium.shapes?.find(
    (shape) => shape.id === meta.sectionId
  );

  if (!sectionShape || !sectionTicketDetails) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.TICKET_NOT_FOUND.CODE,
      ERRORS.TICKET_NOT_FOUND.MSG
    );
  }

  const fee = checkoutFeeCalculations(meta, sectionTicketDetails);

  const { eventDetails, sectionDetails, pricingDetails } =
    formatCheckoutDetails(meta, event, sectionShape, sectionTicketDetails, fee);

  return {
    lockId,
    isValid: true,
    event: eventDetails,
    section: sectionDetails,
    pricing: pricingDetails,
  };
};

// Paypal Create Order
export const paypalCreateOrder = async (ticketDetails, userId, couponCode) => {
  const session = await mongoose.startSession();
  try {
    const { lockId, event, section, pricing } = ticketDetails;
    let finalPricing = pricing;

    if (couponCode) {
      finalPricing = await applyCouopn(couponCode, pricing);
    }

    const breakdown = preparePaypalBreakdown(section, finalPricing);
    const collect = buildPaypalOrderPayload(lockId, event, section, breakdown);

    // 👉 PREVENT coupon overuse BEFORE PayPal order creation
    if (couponCode) {
      const coupon = await getCoupon(couponCode);

      // per-user limit
      const userUsage = await getUserCouponUsage(coupon._id, userId);
      if (userUsage && userUsage.usedCount >= coupon.perUserLimit) {
        throw new AppError(
          STATUS_CODE.BAD_REQUEST,
          ERRORS.COUPON_USAGE_LIMIT.CODE,
          ERRORS.COUPON_USAGE_LIMIT.MSG
        );
      }

      // global usage limit (soft check)
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError(
          STATUS_CODE.BAD_REQUEST,
          ERRORS.COUPON_CANNOT_BE_USED.CODE,
          ERRORS.COUPON_CANNOT_BE_USED.MSG
        );
      }
    }

    const { result } = await ordersController.createOrder(collect);

    const payload = buildDbOrderPayload({
      result,
      userId,
      lockId,
      event,
      section,
      breakdown,
      couponCode,
    });

    await session.withTransaction(async () => {
      const reserveResult = await reserveTicket({
        event,
        section,
        session,
      });

      if (reserveResult.modifiedCount === 0) {
        throw new AppError(
          STATUS_CODE.BAD_REQUEST,
          ERRORS.SEATS_NOT_AVAILABLE.CODE,
          ERRORS.SEATS_NOT_AVAILABLE.MSG
        );
      }

      await createOrder(payload, session);
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new AppError(
      error?.status || STATUS_CODE.SERVER_ERROR,
      error?.code || ERRORS.PAYPAL_ORDER_ERROR.CODE,
      error?.code || ERRORS.PAYPAL_ORDER_ERROR.MSG
    );
  } finally {
    session.endSession();
  }
};

// Capture Paypal Order
export const paypalCaptureOrder = async (
  orderID,
  lockId,
  userId,
  couponCode
) => {
  const meta = await validateSeatLock(lockId, userId);

  const lockKey = `lock:${meta.eventId}:${meta.sectionId}:${lockId}`;
  const lockMetaKey = `lockmeta:${lockId}`;
  await extendExpiry(lockKey, LOCK_EXTEND_TTL);
  await extendExpiry(lockMetaKey, LOCK_EXTEND_TTL + LOCKMETA_EXTEND_TTL);

  const collect = buildPaypalOrderCapturePayload(orderID);

  try {
    const { result } = await ordersController.captureOrder(collect);

    if (result?.status !== "COMPLETED") {
      await updateOrderStatus(orderID, ORDER_STATUS.ABANDONED);

      throw new AppError(
        STATUS_CODE.SERVER_ERROR,
        ERRORS.PAYPAL_ORDER_CAPTURE_ERROR.CODE,
        ERRORS.PAYPAL_ORDER_CAPTURE_ERROR.MSG
      );
    }

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        if (couponCode) {
          const coupon = await getCoupon(couponCode, session);
          await updateCoupon(coupon._id, session);
          await updateCouponUsage(coupon._id, userId, session);
        }
      });
    } finally {
      session.endSession();
    }

    return result;
  } catch (error) {
    console.log(error);
    await updateOrderStatus(orderID, ORDER_STATUS.ABANDONED);
    throw new AppError(
      error.response?.status || STATUS_CODE.SERVER_ERROR,
      error.response?.data?.name || ERRORS.PAYPAL_ORDER_CAPTURE_ERROR.CODE,
      error.response?.data?.message || ERRORS.PAYPAL_ORDER_CAPTURE_ERROR.MSG
    );
  }
};

// Get Order Status
export const orderStatus = async (paypalOrderId) => {
  console.log(paypalOrderId);
  const order = await getOrderForPaypal(paypalOrderId);

  if (!order) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.ORDER_NOTFOUND_FOR_PAYPAL_ID.CODE,
      ERRORS.ORDER_NOTFOUND_FOR_PAYPAL_ID.MSG
    );
  }

  let status;
  switch (order.status) {
    case ORDER_STATUS.PENDING_PAYPAL_ORDER:
      status = "pending";
      break;
    case ORDER_STATUS.CONFIRMED:
      status = "success";
      break;
    case ORDER_STATUS.ABANDONED:
      status = "failed";
      break;
    default:
      status = "pending";
  }

  return status;
};

// Get Ticket
export const getTicket = async (orderId) => {
  const order = await getOrderForPaypal(orderId);

  if (!order) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.ORDER_NOTFOUND_FOR_PAYPAL_ID.CODE,
      ERRORS.ORDER_NOTFOUND_FOR_PAYPAL_ID.MSG
    );
  }

  const ticket = await buildTicket(order);

  return ticket;
};
