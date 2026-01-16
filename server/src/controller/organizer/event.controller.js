import dotenv from "dotenv";
import logger from "../../config/logger.js";
import {
  deleteRedisData,
  getRedisData,
  storeInRedis,
} from "../../services/redis.service.js";
import {
  deleteObject,
  getObjectURL,
  putObject,
} from "../../services/s3.service.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { fetchEventsWithOrganizerId } from "../../services/organizer.service.js";
import { redisClient } from "../../config/redis.conf.js";
import {
  cancelEvent,
  finishCreateEvent,
} from "../../services/organizer/event.service.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";
import {
  deleteEventService,
  findEvent,
  findEventByOrganizerIdAndEventId,
  updateEvent,
} from "../../repositories/organizer/event.repository.js";
import { isSlugExists } from "../../utility/event.utils.js";
import Event from "../../models/event.model.js";
import { ENV } from "../../config/env.conf.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { validateDailyEventLimit } from "../../services/organizer/event-limit.service.js";
import { checkOrganizer } from "../../repositories/organizer/organizer.repository.js";

dotenv.config();

const eventCreateValidationExpiresIn = ENV.REDIS_EVENT_VALIDATION_EXPIRES_IN;

// Create Event Validate
export const validateEventCreateController = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = req.body;

    logger.http(`${req.method} ${req.originalUrl}`);

    const organizer = await checkOrganizer({ userId });
    if (!organizer) {
      throw new AppError(
        STATUS_CODE.NOTFOUND,
        ERRORS.ORGANIZER_NOT_FOUND.CODE,
        ERRORS.ORGANIZER_NOT_FOUND.MSG
      );
    }

    await validateDailyEventLimit(organizer._id);

    const sessionId = `event:create:${crypto.randomUUID()}`;

    await storeInRedis(
      sessionId,
      eventCreateValidationExpiresIn,
      JSON.stringify(data)
    );

    const bannerImage = await putObject({
      fileName: `banner-${Date.now()}.jpg`,
      contentType: "image/jpeg",
      folderName: "events/banner_images",
    });

    const thumbnailImage = await putObject({
      fileName: `thumbnail-${Date.now()}.jpg`,
      contentType: "image/jpeg",
      folderName: "events/thumbnail_images",
    });

    res.status(STATUS_CODE.CREATED).json({
      success: true,
      sessionId,
      uploadUrls: {
        bannerImage: {
          bannerURL: bannerImage.signedUrl,
          key: bannerImage.key,
        },
        thumbnailImage: {
          thumbnailURL: thumbnailImage.signedUrl,
          key: thumbnailImage.key,
        },
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      logger.error(`Error validation: ${error.errors}`);
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ success: false, errors: error.errors });
    }
    logger.error(
      `Error Create Event Validate: ${error.stack || error.message}`
    );
    res.status(STATUS_CODE.SERVER_ERROR).json({ error: "Server error" });
  }
};

// Finish Event Create
export const finishEventCreateController = asyncHandler(async (req, res) => {
  const { sessionId, bannerImageKey, thumbnailImageKey } = req.body;

  if (!sessionId || !bannerImageKey || !thumbnailImageKey) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }
  const event = await finishCreateEvent(req.body);

  sendResponse(res, event, STATUS_CODE.CREATED);
});

// Edit Event Validate
export const editEventController = asyncHandler(async (req, res) => {
  const { eventSlug } = req.params;
  const userId = req.user._id;
  const data = req.body;

  logger.http(`${req.method} ${req.originalUrl}`);

  if (!data || !eventSlug || !userId) {
    return res.status(STATUS_CODE.MISSING_FIELD).json({
      error: "Required fields are missing",
    });
  }

  const organizer = await checkOrganizer({ userId });
  if (!organizer) {
    logger.warn(`Organizer not found for ${userId}`);
    return res.status(STATUS_CODE.NOTFOUND).json({
      success: false,
      error: "Organizer not found",
    });
  }

  const event = await findEvent(organizer._id, eventSlug);
  if (!event) {
    logger.warn("Event not found or unauthorized");
    return res.status(STATUS_CODE.NOTFOUND).json({
      success: false,
      error: "Event not found or unauthorized",
    });
  }

  if (
    event.eventStatus === "Cancelled" ||
    event.cancelDetails?.isCancelled === true
  ) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.EVENT_ALREADY_CANCELLED.CODE,
      ERRORS.EVENT_ALREADY_CANCELLED.MSG
    );
  }

  if (data?.eventTitle) {
    const slug = await isSlugExists(Event, data.eventTitle, event._id);
    data.slug = slug;
  }

  if (!data?.bannerImage && !data?.thumbnailImage) {
    const updatedEvent = await updateEvent(event._id, data);

    if (updatedEvent.ticketSetup && updatedEvent.ticketSetup.length > 0) {
      for (const section of updatedEvent.ticketSetup) {
        const redisKey = `inventory:${updatedEvent._id}:${section.sectionId}`;
        await redisClient.set(redisKey, section.availableTickets);
      }
    }

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  }

  const sessionId = `event:create:${crypto.randomUUID()}`;

  await storeInRedis(
    sessionId,
    eventCreateValidationExpiresIn,
    JSON.stringify({
      ...data,
      event,
    })
  );

  const uploadUrls = {};
  if (data?.bannerImage) {
    const bannerImage = await putObject({
      fileName: `banner-${Date.now()}.jpg`,
      contentType: "image/jpeg",
      folderName: "events/banner_images",
    });

    uploadUrls.bannerImage = {
      bannerURL: bannerImage.signedUrl,
      key: bannerImage.key,
    };
  }

  if (data?.thumbnailImage) {
    const thumbnailImage = await putObject({
      fileName: `thumbnail-${Date.now()}.jpg`,
      contentType: "image/jpeg",
      folderName: "events/thumbnail_images",
    });

    uploadUrls.thumbnailImage = {
      thumbnailURL: thumbnailImage.signedUrl,
      key: thumbnailImage.key,
    };
  }

  res.status(STATUS_CODE.CREATED).json({
    success: true,
    sessionId,
    uploadUrls,
  });
});

// Finish Event Edit
export const finishEventEditController = asyncHandler(async (req, res) => {
  const { sessionId, images } = req.body;

  const cached = await getRedisData(sessionId);

  if (!cached) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      success: false,
      error: "Validation session expired. Please start again.",
    });
  }

  const data = JSON.parse(cached);

  if (
    data.event?.eventStatus === "Cancelled" ||
    data.event?.eventStatus === "Completed" ||
    data.event?.cancelDetails?.isCancelled === true
  ) {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.EVENT_ALREADY_CANCELLED.CODE,
      ERRORS.EVENT_ALREADY_CANCELLED.MSG
    );
  }

  if (data.bannerImage) {
    await deleteObject(data.event.bannerImageKey);
  }

  if (data.thumbnailImage) {
    await deleteObject(data.event.thumbnailImageKey);
  }

  const updatedData = { ...data, ...images };

  const updatedEvent = await updateEvent(data.event._id, updatedData);

  if (updatedEvent.ticketSetup && updatedEvent.ticketSetup.length > 0) {
    for (const section of updatedEvent.ticketSetup) {
      const redisKey = `inventory:${updatedEvent._id}:${section.sectionId}`;
      await redisClient.set(redisKey, section.availableTickets);
    }
  }

  await deleteRedisData(sessionId);

  sendResponse(res, { event: updatedEvent }, STATUS_CODE.SUCCESS);
});

// Fetch Events
export const getEventsController = asyncHandler(async (req, res) => {
  const user = req.user;
  const {
    page = 1,
    limit = 5,
    status = "All",
    sort = "latest",
    search = "",
    startDate,
    endDate,
    category,
    priceFilter,
  } = req.query;

  logger.http(`${req.method} ${req.originalUrl}`);

  const organizer = await checkOrganizer({ userId: user._id });

  if (!organizer) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.ORGANIZER_NOT_FOUND.CODE,
      ERRORS.ORGANIZER_NOT_FOUND.MSG
    );
  }

  const query = { organizer: organizer._id };

  if (status && status !== "All") {
    query.status = status;
  }

  if (category) {
    query.sportType = category;
  }

  if (search.trim()) {
    const regex = new RegExp(search, "i");

    query.$or = [
      { eventTitle: regex },
      { sportType: regex },
      { tags: { $in: [regex] } },
      { stadiumName: regex },
      { city: regex },
    ];
  }

  if (startDate || endDate) {
    query.matchDate = {};
    if (startDate) {
      query.matchDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.matchDate.$lte = new Date(endDate);
    }
  }

  if (priceFilter) {
    if (priceFilter === "low") {
      query.minPrice = { $lte: 5 };
    } else if (priceFilter === "medium") {
      query.minPrice = { $gte: 5, $lte: 15 };
    } else if (priceFilter === "high") {
      query.minPrice = { $gte: 15 };
    }
  }

  const sortOption = {};
  switch (sort) {
    case "price-high":
      sortOption.minPrice = -1;
      break;

    case "price-low":
      sortOption.minPrice = 1;
      break;

    case "latest":
      sortOption.createdAt = -1;
      break;

    case "oldest":
      sortOption.createdAt = 1;
      break;

    default:
      sortOption.createdAt = -1;
  }

  const skip = (page - 1) * limit;

  query.isDeleted = false;

  const { events, total, totalPages } = await fetchEventsWithOrganizerId({
    query,
    sortOption,
    skip,
    limit: Number(limit),
  });

  if (!events || events.length === 0) {
    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "No events found",
      events,
      pagination: { total, page, totalPages },
    });
  }

  const updatedEvents = await Promise.all(
    events.map(async (event) => {
      const bannerKey = event.bannerImageKey;
      const thumbnailKey = event.thumbnailImageKey;

      const bannerImage = await getObjectURL(bannerKey);
      const thumbnailImage = await getObjectURL(thumbnailKey);

      const updatedEvent = {
        ...event,
        bannerImage,
        thumbnailImage,
      };

      return updatedEvent;
    })
  );

  sendResponse(
    res,
    { events: updatedEvents, pagination: { total, page, totalPages } },
    STATUS_CODE.SUCCESS
  );
});

// Find Event
export const getEventController = asyncHandler(async (req, res) => {
  const { eventSlug } = req.params;
  const user = req.user;

  const organizer = await checkOrganizer({ userId: user._id });

  if (!organizer || !eventSlug) {
    logger.warn("Required fields are misiing");
    return res.status(STATUS_CODE.MISSING_FIELD).json({
      success: false,
      message: "Miisng required fields",
    });
  }

  const event = await findEvent(organizer._id, eventSlug);

  if (!event) {
    return res.status(STATUS_CODE.NOTFOUND).json({
      success: false,
      error: "Event not found or organizerId not match",
    });
  }

  const thumbnailImage = await getObjectURL(event.thumbnailImageKey);
  const bannerImage = await getObjectURL(event.bannerImageKey);

  const updatedEvent = {
    ...event.toObject(),
    bannerImage,
    thumbnailImage,
  };

  res.status(STATUS_CODE.SUCCESS).json({
    success: true,
    message: "Event fetch succesfully",
    event: updatedEvent,
  });
});

// Event delete
export const deleteEventController = asyncHandler(async (req, res) => {
  const user = req.user;
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(STATUS_CODE.MISSING_FIELD).json({
      success: false,
      error: "Misising required fields",
    });
  }

  const organizer = await checkOrganizer({ userId: user._id });

  if (!organizer) {
    return res.status(STATUS_CODE.NOTFOUND).json({
      success: false,
      error: "Organizer not found",
    });
  }

  const event = await findEventByOrganizerIdAndEventId(organizer._id, eventId);
  if (!event) {
    return res.status(STATUS_CODE.NOTFOUND).json({
      success: false,
      error: "Event not found",
    });
  }
  if (event.eventStatus === "Cancelled" || event.eventStatus === "Completed") {
    throw new AppError(
      STATUS_CODE.BAD_REQUEST,
      ERRORS.EVENT_ALREADY_CANCELLED.CODE,
      "Cannot delete a completed or cancelled event"
    );
  }

  await deleteObject(event.bannerImageKey);
  await deleteObject(event.thumbnailImageKey);

  if (event.ticketSetup && event.ticketSetup.length > 0) {
    for (const section of event.ticketSetup) {
      const redisKey = `inventory:${event._id}:${section.sectionId}`;
      await redisClient.del(redisKey);
    }
  }

  await deleteEventService(organizer._id, eventId);

  sendResponse(
    res,
    { message: "Event deleted successfully" },
    STATUS_CODE.SUCCESS
  );
});

// Cancel event
export const cancelEventController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { eventSlug } = req.params;
  const data = req.body;

  const event = await cancelEvent(userId, eventSlug, data);

  sendResponse(res, event, STATUS_CODE.SUCCESS);
});
