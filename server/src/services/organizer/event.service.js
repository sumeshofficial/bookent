import mongoose from "mongoose";
import Event from "../../models/event.model.js";
import {
  createEvent,
  findEventByOrganizerIdAndEventSlug,
} from "../../repositories/organizer/event.repository.js";
import { getAllOrdersForEvent } from "../../repositories/organizer/order.repository.js";
import { checkOrganizer } from "../../repositories/organizer/organizer.repository.js";
import { enqueueEventRefund } from "../../repositories/organizer/refund.queue.js";
import {
  deleteRedisData,
  storeInRedis,
} from "../../repositories/redis/redis.repository.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { isSlugExists } from "../../utility/event.utils.js";
import { AppError } from "../../utility/helpers.js";
import { getRedisData } from "../redis.service.js";

export const finishCreateEvent = async (body) => {
  const { sessionId, bannerImageKey, thumbnailImageKey } = body;

  const cached = await getRedisData(sessionId);

  if (!cached) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.VALIDATION_EXPIRED.CODE,
      ERRORS.VALIDATION_EXPIRED.MSG
    );
  }

  const data = JSON.parse(cached);

  const slug = await isSlugExists(Event, data.eventTitle);

  const newEvent = {
    ...data,
    bannerImageKey,
    thumbnailImageKey,
    slug,
  };

  const event = await createEvent(newEvent);

  if (event.ticketSetup && event.ticketSetup.length > 0) {
    for (const section of event.ticketSetup) {
      const redisKey = `inventory:${event._id}:${section.sectionId}`;
      await storeInRedis(redisKey, section.availableTickets);
    }
  }

  await deleteRedisData(sessionId);

  return event;
};

/**
 * Fetch all bookings for a specific organizer-owned event
 *
 * @param {string} eventSlug
 * @param {string} organizerId
 * @param {Object} filters - pagination & filter params
 * @returns {Promise<{data: Array, meta: Object}>}
 * @throws {AppError}
 */
export const getEventBookings = async (
  eventSlug,
  organizerId,
  filters = {}
) => {
  const event = await findEventByOrganizerIdAndEventSlug(
    organizerId,
    eventSlug
  );

  if (!event) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.EVENT_NOT_FOUND.CODE,
      ERRORS.EVENT_NOT_FOUND.MSG
    );
  }

  const result = await getAllOrdersForEvent(event._id, filters);

  const sections =
    event.stadium?.shapes
      ?.filter((shape) => shape.type !== "image" && shape.title)
      .map((shape) => ({
        name: shape.title,
        capacity: shape.capacity,
      })) || [];

  return {
    event: {
      _id: event._id,
      title: event.eventTitle,
      date: event.matchDate,
      venue: event.venue,
      slug: event.slug,
      sections,
    },
    ...result,
  };
};

export const cancelEvent = async (userId, eventSlug, data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const organizer = await checkOrganizer(userId);

    const event = await findEventByOrganizerIdAndEventSlug(
      organizer._id,
      eventSlug,
      session
    );

    if (!event) {
      throw new AppError(
        STATUS_CODE.NOTFOUND,
        ERRORS.EVENT_NOT_FOUND.CODE,
        ERRORS.EVENT_NOT_FOUND.MSG
      );
    }

    if (event.eventStatus === "Cancelled" || event.cancelDetails?.isCancelled) {
      throw new AppError(
        STATUS_CODE.BAD_REQUEST,
        ERRORS.EVENT_ALREADY_CANCELLED.CODE,
        ERRORS.EVENT_ALREADY_CANCELLED.MSG
      );
    }

    if (event.eventStatus === "Completed") {
      throw new AppError(
        STATUS_CODE.BAD_REQUEST,
        ERRORS.EVENT_ALREADY_COMPLETED.CODE,
        ERRORS.EVENT_ALREADY_COMPLETED.MSG
      );
    }

    event.eventStatus = data.eventStatus;
    event.isBookingOpen = false;
    event.cancelDetails = data.cancelDetails;

    await event.save({ session });

    await enqueueEventRefund(event._id, session);

    await session.commitTransaction();
    session.endSession();

    return event;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
