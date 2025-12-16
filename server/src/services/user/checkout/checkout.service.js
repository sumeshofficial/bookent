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
export const paypalCreateOrder = async (ticketDetails, userId) => {
  const session = await mongoose.startSession();
  try {
    const { lockId, event, section, pricing } = ticketDetails;
    const breakdown = preparePaypalBreakdown(section, pricing);
    const collect = buildPaypalOrderPayload(lockId, event, section, breakdown);

    const { result } = await ordersController.createOrder(collect);

    const payload = buildDbOrderPayload({
      result,
      userId,
      lockId,
      event,
      section,
      breakdown,
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
      error.response?.status || STATUS_CODE.SERVER_ERROR,
      error.response?.data?.name || ERRORS.PAYPAL_ORDER_ERROR.CODE,
      error.response?.data?.message || ERRORS.PAYPAL_ORDER_ERROR.MSG
    );
  } finally {
    session.endSession();
  }
};

// Capture Paypal Order
export const paypalCaptureOrder = async (orderID, lockId, userId) => {
  const meta = await validateSeatLock(lockId, userId);

  const lockKey = `lock:${meta.eventId}:${meta.sectionId}:${lockId}`;
  const lockMetaKey = `lockmeta:${lockId}`;
  await extendExpiry(lockKey, LOCK_EXTEND_TTL);
  await extendExpiry(lockMetaKey, LOCK_EXTEND_TTL + LOCKMETA_EXTEND_TTL);

  const collect = buildPaypalOrderCapturePayload(orderID);

  try {
    const { result } = await ordersController.captureOrder(collect);

    console.log(result);

    if (result?.status !== "COMPLETED") {
      await updateOrderStatus(orderID, ORDER_STATUS.ABANDONED);

      throw new AppError(
        STATUS_CODE.SERVER_ERROR,
        ERRORS.PAYPAL_ORDER_CAPTURE_ERROR.CODE,
        ERRORS.PAYPAL_ORDER_CAPTURE_ERROR.MSG
      );
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
