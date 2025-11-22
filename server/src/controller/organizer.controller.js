import logger from "../config/logger.js";
import { findOrganizerById, findUserById } from "../services/auth.service.js";
import {
  checkOrganizer,
  createOrganizer,
  createStadiumFn,
  findStadiums,
  stadiumExists,
  fetchEventsWithOrganizerId,
  createEvent,
  findEvent,
  updateEvent,
  deleteEventService,
  updateOrganizerService,
  findAllStadiumsWithOrgnaizerId,
  findStadium,
  updateStadiumService,
  softDeleteStadiumService,
} from "../services/organizer.service.js";
import {
  deleteRedisData,
  getRedisData,
  storeInRedis,
} from "../services/redis.service.js";
import {
  deleteObject,
  getObjectURL,
  putObject,
} from "../services/s3.service.js";
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

    const user = findUserById(userId);

    const organization = await createOrganizer({
      userId,
      fullname: user.fullname,
      email: user.email,
      profileImage: user.profileImage,
      organizationDetails,
      bankAccountDetails,
    });

    return res.status(statusCode.created).json({
      success: true,
      message: "Organizer registered successfully",
      data: organization,
    });
  } catch (error) {
    logger.error(`Error create organizer ${error.stack || error.message}`);
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

    if (organizer.profileImage && organizer.profileImage.includes("uploads")) {
      const url = await getObjectURL(organizer.profileImage);
      organizer.profileImage = url;
    }

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
      logger.warn(
        `Missing Required field shapes=${shapes}, stadiumDetails=${stadiumDetails}, layoutImageKey=${layoutImageKey}, organizerId=${organizerId}`
      );
      return res
        .status(statusCode.missingField)
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
    logger.error(`Error create stadium ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({
      success: false,
      error: error.message || "Something went worng",
    });
  }
};

// Update stadium
export const updateStadium = async (req, res) => {
  try {
    logger.http(`${req.method}, ${req.originalUrl}`);

    const user = req.user;
    const { stadiumId } = req.params;
    const payload = req.body;

    if (!stadiumId || !payload) {
      logger.warn(
        `Missing required fields stadiumId-${stadiumId}, payload=${payload}`
      );
      return res.status(statusCode.missingField).json({
        success: false,
        error: "Missing stadiumId or payload",
      });
    }

    logger.info(`Checking organizer for userId=${user._id}`);
    const organizer = await checkOrganizer({ userId: user._id });
    if (!organizer) {
      logger.warn(`Organizer not found userId=${user._id}`);
      return res.status(statusCode.notFound).json({
        success: false,
        error: "Organizer not found",
      });
    }

    logger.info(
      `Finding stadium for organizerId=${organizer._id}, stadiumId=${stadiumId}`
    );
    const existing = await findStadium(organizer._id, stadiumId);

    if (!existing) {
      logger.warn("Stadium not found or unauthorized");
      return res.status(statusCode.notFound).json({
        success: false,
        error: "Stadium not found or unauthorized",
      });
    }

    const updateData = {};
    const oldDetails = existing.stadiumDetails;

    if (payload.stadiumDetails) {
      updateData["stadiumDetails"] = {
        stadiumName:
          payload.stadiumDetails.stadiumName ?? oldDetails.stadiumName,
        address: payload.stadiumDetails.address ?? oldDetails.address,
        city: payload.stadiumDetails.city ?? oldDetails.city,
        state: payload.stadiumDetails.state ?? oldDetails.state,
        pincode: payload.stadiumDetails.pincode ?? oldDetails.pincode,
        location: payload.stadiumDetails.location ?? oldDetails.location,
        capacity: payload.stadiumDetails.capacity ?? oldDetails.capacity,
      };
    }

    if (payload.stadiumLayout?.shapes) {
      const newShapes = payload.stadiumLayout.shapes;
      const oldShapes = existing.shapes;

      const newIds = newShapes.map((s) => s.id);

      const finalShapes = [];

      for (const newShape of newShapes) {
        const oldShape = oldShapes.find((s) => s.id === newShape.id);

        if (oldShape) {
          if (
            newShape.imageKey &&
            newShape.imageKey !== oldShape.imageKey &&
            oldShape.imageKey
          ) {
            logger.info(`Deleting old shape image: ${oldShape.imageKey}`);
            await deleteObject(oldShape.imageKey);
          }

          finalShapes.push(newShape);
        } else {
          finalShapes.push(newShape);
        }
      }

      const removedShapes = oldShapes.filter((s) => !newIds.includes(s.id));
      for (const removed of removedShapes) {
        if (removed.imageKey) {
          logger.info(`Deleting removed shape image: ${removed.imageKey}`);
          await deleteObject(removed.imageKey);
        }
      }

      updateData.shapes = finalShapes;
    }

    if (payload.layoutImageKey) {
      logger.info("Uploading new stadium layout image");

      if (existing.layoutImageKey) {
        logger.info(`Deleting old layout image key=${existing.layoutImageKey}`);
        await deleteObject(existing.layoutImageKey);
      }

      updateData.layoutImageKey = payload.layoutImageKey;
    }

    const updatedStadium = await updateStadiumService(stadiumId, updateData);

    logger.info("Stadium updated successfully");

    res.status(statusCode.success).json({
      success: true,
      message: "Stadium updated successfully",
      stadium: updatedStadium,
    });
  } catch (error) {
    logger.error(`Error update stadium: ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

// Delete Stadium
export const deleteStadium = async (req, res) => {
  try {
    logger.http(`${req.method} ${req.originalUrl}`);
    const user = req.user;
    const { stadiumId } = req.params;

    if (!stadiumId) {
      return res.status(statusCode.missingField).json({
        success: false,
        message: "Missing stadiumId",
      });
    }

    logger.info(`Checking organizer for userId=${user._id}`);
    const organizer = await checkOrganizer({ userId: user._id });

    if (!organizer) {
      return res.status(statusCode.notFound).json({
        success: false,
        message: "Organizer not found",
      });
    }

    logger.info(
      `Finding stadium for organizerId=${organizer._id}, stadiumId=${stadiumId}`
    );
    const stadium = await findStadium(organizer._id, stadiumId);

    if (!stadium) {
      return res.status(statusCode.notFound).json({
        success: false,
        message: "Stadium not found or unauthorized",
      });
    }

    logger.info("Deleting stadium layout image from S3");
    if (stadium.layoutImageKey) {
      await deleteObject(stadium.layoutImageKey);
    }

    logger.info("Deleting stadium shape images from S3");
    for (const shape of stadium.shapes) {
      if (shape.imageKey) {
        await deleteObject(shape.imageKey);
      }
    }

    logger.info("Soft deleting stadium record");

    await softDeleteStadiumService(stadiumId, organizer._id);

    res.status(statusCode.success).json({
      success: true,
      message: "Stadium deleted successfully",
    });
  } catch (error) {
    logger.error(`Error delete stadium: ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({
      success: false,
      message: "Something went wrong",
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

    const stadiums = await findStadiums();

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

// Get stadiums
export const getStadiumsForOrganizer = async (req, res) => {
  try {
    logger.http(`${req.method} ${req.originalUrl}`);
    const { organizerId } = req.params;
    const {
      page = 1,
      limit = 5,
      search = "",
      sort = "capacity-low",
    } = req.query;

    logger.info(`Find organizer by id=${organizerId}`);
    const organizer = await findOrganizerById(organizerId);
    if (!organizer) {
      return res.status(statusCode.notFound).json({
        success: false,
        message: "Organizer profile not found",
      });
    }

    const query = { organizerId, isDeleted: false };

    if (search.trim()) {
      const regex = new RegExp(search, "i");

      query.$or = [
        { "stadiumDetails.stadiumName": regex },
        { "stadiumDetails.city": regex },
        { "stadiumDetails.state": regex },
      ];
    }

    const sortOption = {};
    switch (sort) {
      case "capacity-high":
        sortOption["stadiumDetails.capacity"] = -1;
        break;

      case "capacity-low":
        sortOption["stadiumDetails.capacity"] = 1;
        break;

      default:
        sortOption["stadiumDetails.capacity"] = -1;
    }

    const skip = (page - 1) * limit;

    query.isDeleted = false;

    logger.info(`Fetching events from DB for organizer=${organizer._id}`);
    const { stadiums, total, totalPages } =
      await findAllStadiumsWithOrgnaizerId({
        query,
        sortOption,
        skip,
        limit: Number(limit),
      });

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
      pagination: { total, page, totalPages },
    });
  } catch (error) {
    logger.error(
      `Error fecth stadium for organizer: ${error.stack || error.message}`
    );
    res.status(statusCode.serverError).json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};

// Get Staium
export const getStadium = async (req, res) => {
  try {
    logger.http(`${req.method} ${req.originalUrl}`);
    const { stadiumId } = req.params;
    const user = req.user;

    logger.info("Check organizer is exist");
    const organizer = await checkOrganizer({ userId: user._id });

    logger.info("Fetching stadium form db");
    const stadium = await findStadium(organizer._id, stadiumId);

    if (!stadium) {
      logger.warn(
        `Stadium not found for organizerId=${organizer._id} stadiumId=${stadiumId}`
      );
      return res.status(statusCode.notFound).json({
        success: false,
        error: "Stadium not found",
      });
    }

    const updatedStadium = {
      ...stadium,
      layoutImage: await getObjectURL(stadium.layoutImageKey),
    };

    updatedStadium.shapes = await Promise.all(
      stadium.shapes.map(async (shape) => {
        if (shape.type === "image") {
          const imageUrl = await getObjectURL(shape.imageKey);
          return { ...shape, imageUrl };
        }
        return shape;
      })
    );

    logger.info("Fetch stadium successfully");
    res.status(statusCode.success).json({
      success: true,
      message: "Staidum fetch successfully",
      stadium: updatedStadium,
    });
  } catch (error) {
    logger.error(`Error fetch stadium: ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({
      success: false,
      error: "Somthing went wrong",
    });
  }
};

// Check stadium is already exists
export const checkStadiumName = async (req, res) => {
  try {
    const { name, stadiumId = "" } = req.query;
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

    const exists = await stadiumExists(name, stadiumId);

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
    res
      .status(statusCode.serverError)
      .json({ success: false, error: "Server error" });
  }
};

// Edit Event Validate
export const editEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const data = req.body;

    logger.http(`${req.method} ${req.originalUrl}`);

    if (!data || !eventId || !userId) {
      logger.warn("Required fields are missing");
      return res.status(statusCode.missingField).json({
        success: false,
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
      `Check event is exixts for organizerId=${organizer._id}, eventId=${eventId}`
    );
    const event = await findEvent(organizer._id, eventId);
    if (!event) {
      logger.warn("Event not found or unauthorized");
      return res.status(statusCode.notFound).json({
        success: false,
        error: "Event not found or unauthorized",
      });
    }

    if (!data?.bannerImage && !data?.thumbnailImage) {
      logger.info("Update event without images");
      const updatedEvent = await updateEvent(eventId, data);

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
export const finishEventEdit = async (req, res) => {
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

// Finish Event Create
export const finishEventCreate = async (req, res) => {
  try {
    const { sessionId, bannerImageKey, thumbnailImageKey } = req.body;

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
    data.bannerImageKey = bannerImageKey;
    data.thumbnailImageKey = thumbnailImageKey;

    logger.info("Save event to DB");
    const event = await createEvent(data);

    logger.info("Delete event session form redis");
    await deleteRedisData(sessionId);

    logger.info("Event created successfully");
    res.status(statusCode.created).json({
      success: true,
      event,
    });
  } catch (error) {
    logger.error(`Error create event: ${error.stack || error.message}`);
    res
      .status(statusCode.serverError)
      .json({ success: false, error: "Server error" });
  }
};

// Fetch Events
export const getEvents = async (req, res) => {
  try {
    const { id } = req.params;
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

    if (!id) {
      logger.warn(`Required field missing, ID=${id}`);
      return res.status(statusCode.missingField).json({
        success: false,
        error: "Missing field",
      });
    }

    const query = { organizer: id };

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

    logger.info(`Fetching events from DB for organizer=${id}`);
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
export const getEvent = async (req, res) => {
  try {
    const { organizerId, eventId } = req.params;

    logger.http(`${req.method}, ${req.originalUrl}`);

    if (!organizerId || !eventId) {
      logger.warn("Required fields are misiing");
      return res.status(statusCode.missingField).json({
        success: false,
        message: "Miisng required fields",
      });
    }

    logger.info(
      `Fetching event with organizerId=${organizerId}, eventId=${eventId}`
    );
    const event = await findEvent(organizerId, eventId);

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
export const deleteEvent = async (req, res) => {
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
    const event = await findEvent(organizer._id, eventId);
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

export const updateOrganizerProfile = async (req, res) => {
  const { id, data } = req.body;

  try {
    if (!id || !data) {
      return res
        .status(statusCode.missingField)
        .json({ success: false, message: "Missing fields" });
    }

    const organizer = await updateOrganizerService({ id, data });

    if (!organizer) {
      return res
        .status(statusCode.notFound)
        .json({ success: false, message: "User not found" });
    }

    if (organizer.profileImage && organizer.profileImage.includes("uploads")) {
      const url = await getObjectURL(organizer.profileImage);
      organizer.profileImage = url;
    }

    return res
      .status(statusCode.success)
      .json({ success: true, message: "Updated Successfully", organizer });
  } catch (error) {
    return res
      .status(statusCode.serverError)
      .json({ success: false, error: error.message });
  }
};
