import { ERRORS, STATUS_CODE } from "../../../utility/constants.js";
import { AppError } from "../../../utility/helpers.js";
import dotenv from "dotenv";
import { validateEvent } from "../../helper/validateEvent.helper.js";
import { validateSeatLock } from "./helper/validateSeatLock.helper.js";
import { checkoutFeeCalculations } from "./helper/checkoutFeeCalculations.helper.js";
import { validateStadium } from "./helper/validateStadium.helper.js";
dotenv.config();

// const LOCK_TTL_EXTEND = process.env.LOCK_TTL_EXTEND;

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

  const { ticketPrice, orderAmount, baseFee, gst, bookingFee, grandTotal } =
    checkoutFeeCalculations(meta, sectionTicketDetails);

  return {
    lockId,
    event: {
      _id: event._id,
      title: event.eventTitle,
      date: event.matchDate,
      venue: event.stadiumAddress,
      time: event.matchTime,
    },
    section: {
      _id: sectionShape.id,
      name: sectionShape.title,
      price: sectionTicketDetails,
      qty: Number(meta.qty),
    },
    pricing: {
      ticketPrice,
      orderAmount,
      baseFee,
      gst,
      bookingFee,
      grandTotal,
    },
  };
};
