import { ERRORS, STATUS_CODE } from "../../../utility/constants.js";
import { AppError } from "../../../utility/helpers.js";
import dotenv from "dotenv";
import { validateEvent } from "../../helper/validateEvent.helper.js";
import { validateSeatLock } from "./helper/validateSeatLock.helper.js";
import { checkoutFeeCalculations } from "./helper/checkoutFeeCalculations.helper.js";
import { validateStadium } from "./helper/validateStadium.helper.js";
import { OrdersController } from "@paypal/paypal-server-sdk";
import { client } from "../../../utility/paypal.js";
import { fetchRealTimeRate } from "../../helper/currency.service.js";
import {
  buildPaypalOrderCapturePayload,
  buildPaypalOrderPayload,
  preparePaypalBreakdown,
} from "./helper/paypal/paypal.helper.js";
import { formatCheckoutDetails } from "./helper/formatCheckoutDetails.js";
dotenv.config();

const ordersController = new OrdersController(client);

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
export const paypalCreateOrder = async (ticketDetails) => {
  const { lockId, event, section, pricing } = ticketDetails;
  const USD_TO_INR_RATE_DECIMAL = await fetchRealTimeRate("INR");

  const breakdown = preparePaypalBreakdown(
    section,
    pricing,
    USD_TO_INR_RATE_DECIMAL
  );

  const collect = buildPaypalOrderPayload(lockId, event, section, breakdown);

  try {
    const { result } = await ordersController.createOrder(collect);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw new AppError(
      error.response?.status || STATUS_CODE.SERVER_ERROR,
      error.response?.data?.name || ERRORS.PAYPAL_ORDER_ERROR.CODE,
      error.response?.data?.message || ERRORS.PAYPAL_ORDER_ERROR.MSG
    );
  }
};

export const paypalCaptureOrder = async (orderID) => {
  const collect = buildPaypalOrderCapturePayload(orderID);

  try {
    const { result } = await ordersController.captureOrder(collect);

    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw new AppError(
      error.response?.status || STATUS_CODE.SERVER_ERROR,
      error.response?.data?.name || ERRORS.PAYPAL_ORDER_CAPTURE_ERROR.CODE,
      error.response?.data?.message || ERRORS.PAYPAL_ORDER_CAPTURE_ERROR.MSG
    );
  }
};
