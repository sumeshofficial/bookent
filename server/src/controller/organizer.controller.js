import logger from "../config/logger.js";
import { redisClient } from "../config/redis.conf.js";
import {
  checkOrganizer,
  createOrganizer,
  createStadiumFn,
  findStadiums,
  stadiumExists,
  fetchEventsWithOrganizerId,
  createEvent,
} from "../services/organizer.service.js";
import {
  deleteRedisData,
  getRedisData,
  storeInRedis,
} from "../services/redis.service.js";
import { getObjectURL, putObject } from "../services/s3.service.js";
import { statusCode } from "../utility/constants.js";
import { eventSchema } from "../utility/validation.js";
import dotenv from "dotenv";

dotenv.config();

const eventCreateValidationExpiresIn =
  process.env.REDIS_EVENT_VALIDATION_EXPIRES_IN;

// Register Organizer
export const organizerAccountRegister = async (req, res) => {
  const { userId, organizationDetails, bankAccountDetails } = req.body;
  try {
    if (
      !userId ||
      !organizationDetails?.name ||
      !organizationDetails?.address ||
      !organizationDetails?.state ||
      !bankAccountDetails?.accountNumber
    ) {
      return res.status(statusCode.missingField).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const organization = await createOrganizer({
      userId,
      organizationDetails,
      bankAccountDetails,
    });

    return res.status(statusCode.created).json({
      success: true,
      message: "Organizer registered successfully",
      data: organization,
    });
  } catch (error) {
    res
      .status(statusCode.serverError)
      .json({ success: false, error: error.message || "Something went wrong" });
  }
};

// Get organizer
export const organizerDashboard = async (req, res) => {
  const userId = req.params.id;
  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    if (!userId) {
      return res.status(statusCode.missingField).json({
        success: false,
        error: "Missing Field",
      });
    }

    const organizer = await checkOrganizer({ userId });

    return res.status(statusCode.success).json({
      success: true,
      message: "Chceking Succesfully",
      organizer,
    });
  } catch (error) {
    res.status(statusCode.serverError).json({
      success: false,
      error: error.message || "Something went worng",
    });
  }
};

// Create Stadium
export const createStadium = async (req, res) => {
  try {
    const { stadiumDetails, shapes, layoutImageKey, organizerId } = req.body;

    if (!shapes || !stadiumDetails || !layoutImageKey || !organizerId) {
      return res
        .status(stadium.missingField)
        .json({ success: false, message: "Missing field" });
    }

    const payload = {
      organizerId,
      stadiumDetails,
      shapes,
      layoutImageKey,
    };

    const stadium = await createStadiumFn(payload);

    res.status(statusCode.created).json({
      success: true,
      message: "Stadium created successfully",
      stadium,
    });
  } catch (error) {
    console.log(error);
    res.status(statusCode.serverError).json({
      success: false,
      error: error.message || "Something went worng",
    });
  }
};

// Get stadiums
export const getStadiums = async (req, res) => {
  try {
    const organizer = await checkOrganizer({ userId: req.user._id });
    if (!organizer) {
      return res.status(statusCode.notFound).json({
        success: false,
        message: "Organizer profile not found",
      });
    }

    const stadiums = await findStadiums(organizer._id);

    if (!stadiums || stadiums.length === 0) {
      return res.status(statusCode.success).json({
        success: true,
        message: "No Stadiums Found",
        stadiums: [],
      });
    }

    const updatedStadiums = await Promise.all(
      stadiums.map(async (stadium) => ({
        ...stadium,
        layoutImage: await getObjectURL(stadium.layoutImageKey),
      }))
    );

    res.status(statusCode.success).json({
      success: true,
      message: "Stadiums fetched successfully",
      stadiums: updatedStadiums,
    });
  } catch (error) {
    res.status(statusCode.serverError).json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};

// Check stadium is already exists
export const checkStadiumName = async (req, res) => {
  try {
    const { name } = req.query;
    const organizer = await checkOrganizer({ userId: req.user._id });

    if (!name) {
      return res
        .status(statusCode.missingField)
        .json({ success: false, error: "Name is required" });
    }

    if (!organizer) {
      return res
        .status(statusCode.notFound)
        .json({ success: false, error: "Organizer not found" });
    }

    const exists = await stadiumExists(name, organizer._id);

    res.status(statusCode.success).json({
      success: true,
      exists: !!exists,
    });
  } catch (error) {
    res
      .status(statusCode.serverError)
      .json({ success: false, error: error.message || "Something went wrong" });
  }
};

// Create Event Validate
export const validateEventCreate = async (req, res) => {
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
    return res
      .status(statusCode.serverError)
      .json({ success: false, error: "Server error" });
  }
};

// Finish Event Create
export const finishEventCreate = async (req, res) => {
  try {
    const { sessionId, bannerImage, thumbnailImage } = req.body;

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

    logger.info("Attach uploaded URLs");
    data.bannerImage = bannerImage;
    data.thumbnailImage = thumbnailImage;

    logger.info("Save event to DB");
    const event = await createEvent(data);

    logger.info("Delete event session form redis");
    await deleteRedisData(sessionId);

    logger.info("Event created successfully");
    res.status(statusCode.created).json({
      success: true,
      data: event,
    });
  } catch (error) {
    logger.error(`Error create event: ${error.stack || error.message}`);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Fetch Events
export const getEvents = async (req, res) => {
  try {
    const { id } = req.query;

    logger.http(`${req.method} ${req.originalUrl}`);

    if (!id) {
      logger.warn(`Required field missing, ID=${id}`);
      return res.status(statusCode.missingField).json({
        success: false,
        error: "Missing field",
      });
    }

    logger.info(`Fetch event form DB with ID=${id}`);
    const events = await fetchEventsWithOrganizerId(id);

    logger.info("Events fetch successfully");
    res.status(statusCode.success).json({
      success: true,
      message: "Events fetched succussfully",
      events,
    });
  } catch (error) {
    logger.error(`Error fetch events: ${error.stack || error.message}`);
    res.status(statusCode.error).json({
      success: false,
      error: "Something went wrong",
    });
  }
};
