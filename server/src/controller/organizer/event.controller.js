import dotenv from "dotenv";
import logger from "../../config/logger.js";
import { eventSchema } from "../../utility/validation.js";
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
import { ERRORS, STATUS_CODE, statusCode } from "../../utility/constants.js";
import {
  checkOrganizer,
  deleteEventService,
  fetchEventsWithOrganizerId,
  findEvent,
  updateEvent,
} from "../../services/organizer.service.js";
import { redisClient } from "../../config/redis.conf.js";
import { finishCreateEvent } from "../../services/organizer/event.service.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";
import { findeEventByOrganizerIdAndEventId } from "../../repositories/organizer/event.repository.js";
import { isSlugExists } from "../../utility/event.utils.js";
import Event from "../../models/event.model.js";
import { ENV } from "../../config/envConfig.js";

dotenv.config();

const eventCreateValidationExpiresIn = ENV.REDIS_EVENT_VALIDATION_EXPIRES_IN;

// Create Event Validate
export const validateEventCreateController = async (req, res) => {
  try {
    const data = req.body;

    logger.http(`${req.method} ${req.originalUrl}`);

    logger.info("Validating event data");
    await eventSchema.validate(data, { abortEarly: false });

    logger.info("Create a sessionId for redis");
    const sessionId = `event:create:${crypto.randomUUID()}`;

    logger.info("Store Event data in redis with expires time for 10m");

    await storeInRedis(
      sessionId,
      eventCreateValidationExpiresIn,
      JSON.stringify(data)
    );

    logger.info("Generate signed url for banner image");
    const bannerImage = await putObject({
      fileName: `banner-${Date.now()}.jpg`,
      contentType: "image/jpeg",
      folderName: "events/banner_images",
    });

    logger.info("Generate signed url for thumbnail image");
    const thumbnailImage = await putObject({
      fileName: `thumbnail-${Date.now()}.jpg`,
      contentType: "image/jpeg",
      folderName: "events/thumbnail_images",
    });

    logger.info("Event Create Verify and Create signed Urls successfully");
    res.status(statusCode.created).json({
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
        .status(statusCode.badRequest)
        .json({ success: false, errors: error.errors });
    }
    logger.error(
      `Error Create Event Validate: ${error.stack || error.message}`
    );
    res.status(statusCode.serverError).json({ error: "Server error" });
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
export const editEventController = async (req, res) => {
  try {
    const { eventSlug } = req.params;
    const userId = req.user._id;
    const data = req.body;

    logger.http(`${req.method} ${req.originalUrl}`);

    if (!data || !eventSlug || !userId) {
      logger.warn("Required fields are missing");
      return res.status(statusCode.missingField).json({
        error: "Required fields are missing",
      });
    }

    logger.info("Check ownership");
    const organizer = await checkOrganizer({ userId });
    if (!organizer) {
      logger.warn(`Organizer not found for ${userId}`);
      return res.status(statusCode.notFound).json({
        success: false,
        error: "Organizer not found",
      });
    }

    logger.info(
      `Check event is exixts for organizerId=${organizer._id}, eventId=${eventSlug}`
    );
    const event = await findEvent(organizer._id, eventSlug);
    if (!event) {
      logger.warn("Event not found or unauthorized");
      return res.status(statusCode.notFound).json({
        success: false,
        error: "Event not found or unauthorized",
      });
    }

    if (data?.eventTitle) {
      const slug = await isSlugExists(Event, data.eventTitle, event._id);
      data.slug = slug;
    }

    if (!data?.bannerImage && !data?.thumbnailImage) {
      logger.info("Update event without images");
      const updatedEvent = await updateEvent(event._id, data);

      if (updatedEvent.ticketSetup && updatedEvent.ticketSetup.length > 0) {
        for (const section of updatedEvent.ticketSetup) {
          const redisKey = `inventory:${updatedEvent._id}:${section.sectionId}`;
          await redisClient.set(redisKey, section.availableTickets);
        }
      }

      logger.info("Event updated succssfully");
      return res.status(statusCode.success).json({
        success: true,
        message: "Event updated successfully",
        event: updatedEvent,
      });
    }

    logger.info("Create a sessionId for redis");
    const sessionId = `event:create:${crypto.randomUUID()}`;

    logger.info("Store Event data in redis with expires time for 10m");
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
      logger.info("Generate signed url for banner image");
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
      logger.info("Generate signed url for thumbnail image");
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

    logger.info("Event Edit Verify and Create signed Urls successfully");
    res.status(statusCode.created).json({
      success: true,
      sessionId,
      uploadUrls,
    });
  } catch (error) {
    logger.error(`Error edit event: ${error.stack || error.message}`);
    res
      .status(statusCode.serverError)
      .json({ success: false, error: "Server error" });
  }
};

// Finish Event Edit
export const finishEventEditController = async (req, res) => {
  try {
    const { sessionId, images } = req.body;

    logger.http(`${req.method} ${req.originalUrl}`);

    logger.info("Fetch validated data from Redis");
    const cached = await getRedisData(sessionId);

    if (!cached) {
      logger.warn("Validation session expired. Please start again.");
      return res.status(statusCode.badRequest).json({
        success: false,
        error: "Validation session expired. Please start again.",
      });
    }

    logger.debug("Parse cached data");
    const data = JSON.parse(cached);

    if (data.bannerImage) {
      logger.info("Deleting the old banner image");
      await deleteObject(data.event.bannerImageKey);
    }

    if (data.thumbnailImage) {
      logger.info("Deleting the old thumbnail image");
      await deleteObject(data.event.thumbnailImageKey);
    }

    logger.info("Attach uploaded URLs");
    const updatedData = { ...data, ...images };

    logger.info("Update event");
    const updatedEvent = await updateEvent(data.event._id, updatedData);
    logger.info("Update Redis inventory for edited event sections");

    if (updatedEvent.ticketSetup && updatedEvent.ticketSetup.length > 0) {
      for (const section of updatedEvent.ticketSetup) {
        const redisKey = `inventory:${updatedEvent._id}:${section.sectionId}`;
        await redisClient.set(redisKey, section.availableTickets);
      }
    }

    logger.info("Delete event session form redis");
    await deleteRedisData(sessionId);

    logger.info("Event updated succssfully");
    res.status(statusCode.success).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    logger.error(`Error edit event: ${error.stack || error.message}`);
    res
      .status(statusCode.serverError)
      .json({ success: false, error: "Server error" });
  }
};

// Fetch Events
export const getEventsController = async (req, res) => {
  try {
    const user = req.user;
    const {
      page = 1,
      limit = 5,
      status = "All",
      sort = "lastest",
      search = "",
      startDate,
      endDate,
      category,
      priceFilter,
    } = req.query;

    logger.http(`${req.method} ${req.originalUrl}`);

    const organizer = await checkOrganizer({ userId: user._id });

    if (!organizer) {
      logger.warn(`Required field missing, ID=${organizer._id}`);
      return res.status(statusCode.missingField).json({
        success: false,
        error: "Missing field",
      });
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
        query.minPrice = { $lte: 500 };
      } else if (priceFilter === "medium") {
        query.minPrice = { $gte: 500, $lte: 1500 };
      } else if (priceFilter === "high") {
        query.minPrice = { $gte: 1500 };
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

    logger.info(`Fetching events from DB for organizer=${organizer._id}`);
    const { events, total, totalPages } = await fetchEventsWithOrganizerId({
      query,
      sortOption,
      skip,
      limit: Number(limit),
    });

    if (!events || events.length === 0) {
      logger.info("Events fetch successfully. No Events found");
      return res.status(statusCode.success).json({
        success: true,
        message: "No events found",
        events,
        pagination: { total, page, totalPages },
      });
    }

    logger.info("Fetch images from S3 bucket");
    const updatedEvents = await Promise.all(
      events.map(async (event) => {
        event = event.toObject();
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

    logger.info("Events fetched from DB successfully");
    res.status(statusCode.success).json({
      success: true,
      message: "Events fetched succussfully",
      events: updatedEvents,
      pagination: { total, page, totalPages },
    });
  } catch (error) {
    logger.error(`Error fetching events: ${error.stack || error.message}`);
    res.status(statusCode.error).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

// Find Event
export const getEventController = async (req, res) => {
  try {
    const { eventSlug } = req.params;
    const user = req.user;

    const organizer = await checkOrganizer({ userId: user._id });

    logger.http(`${req.method}, ${req.originalUrl}`);

    if (!organizer || !eventSlug) {
      logger.warn("Required fields are misiing");
      return res.status(statusCode.missingField).json({
        success: false,
        message: "Miisng required fields",
      });
    }

    logger.info(
      `Fetching event with organizerId=${organizer._id}, eventId=${eventSlug}`
    );
    const event = await findEvent(organizer._id, eventSlug);

    if (!event) {
      logger.warn("Event not found or organizerId not match");
      return res.status(statusCode.notFound).json({
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

    logger.info("Event fetch succesfully");
    res.status(statusCode.success).json({
      success: true,
      message: "Event fetch succesfully",
      event: updatedEvent,
    });
  } catch (error) {
    logger.error(`Error fetching event: ${error.stack || error.mesage}`);
    res.status(statusCode.serverError).json({
      success: false,
      error: "Server error",
    });
  }
};

// Event delete
export const deleteEventController = async (req, res) => {
  try {
    const user = req.user;
    const { eventId } = req.body;

    logger.http(`${req.method} ${req.originalUrl}`);

    if (!eventId) {
      logger.warn("Missing required field");
      return res.status(statusCode.missingField).json({
        success: false,
        error: "Misising required fields",
      });
    }

    logger.info(`Fetching organizer with id=${user._id}`);
    const organizer = await checkOrganizer({ userId: user._id });

    if (!organizer) {
      logger.warn("Organizer not found");
      return res.status(statusCode.notFound).json({
        success: false,
        error: "Organizer not found",
      });
    }

    logger.info(`Check event is exists eventId=${eventId}`);
    const event = await findeEventByOrganizerIdAndEventId(
      organizer._id,
      eventId
    );
    if (!event) {
      logger.warn("Event not found");
      return res.status(statusCode.notFound).json({
        success: false,
        error: "Event not found",
      });
    }

    logger.info(`deleting event images eventId=${eventId}`);
    await deleteObject(event.bannerImageKey);
    await deleteObject(event.thumbnailImageKey);

    logger.info("Deleting Redis inventory for this event");
    if (event.ticketSetup && event.ticketSetup.length > 0) {
      for (const section of event.ticketSetup) {
        const redisKey = `inventory:${event._id}:${section.sectionId}`;
        await redisClient.del(redisKey);
      }
    }

    logger.info(`deleting event with eventId=${eventId}`);
    await deleteEventService(organizer._id, eventId);

    logger.info("Event deleted successfully");
    res.status(statusCode.success).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    logger.error(`Error delete event ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({
      success: false,
      error: "Something went worng",
    });
  }
};
