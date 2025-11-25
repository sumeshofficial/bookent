import logger from "../../config/logger.js";
import { findOrganizerById } from "../../services/auth.service.js";
import {
  checkOrganizer,
  createStadiumFn,
  findAllStadiumsWithOrgnaizerId,
  findStadium,
  findStadiums,
  softDeleteStadiumService,
  stadiumExists,
  updateStadiumService,
} from "../../services/organizer.service.js";
import { deleteObject, getObjectURL } from "../../services/s3.service.js";
import { statusCode } from "../../utility/constants.js";

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
        .json({ message: "Missing field" });
    }

    const payload = {
      organizerId,
      stadiumDetails,
      shapes,
      layoutImageKey,
    };

    const stadium = await createStadiumFn(payload);

    res.status(statusCode.created).json({
      stadium,
    });
  } catch (error) {
    logger.error(`Error create stadium ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({
      error: "Something went worng",
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
        error: "Missing stadiumId or payload",
      });
    }

    logger.info(`Checking organizer for userId=${user._id}`);
    const organizer = await checkOrganizer({ userId: user._id });
    if (!organizer) {
      logger.warn(`Organizer not found userId=${user._id}`);
      return res.status(statusCode.notFound).json({
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
        stateCode: payload.stadiumDetails.stateCode ?? oldDetails.stateCode,
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
      message: "Stadium updated successfully",
      stadium: updatedStadium,
    });
  } catch (error) {
    logger.error(`Error update stadium: ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({
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
      message: "Stadiums fetched successfully",
      stadiums: updatedStadiums,
    });
  } catch (error) {
    res.status(statusCode.serverError).json({
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
      message: "Stadiums fetched successfully",
      stadiums: updatedStadiums,
      pagination: { total, page, totalPages },
    });
  } catch (error) {
    logger.error(
      `Error fecth stadium for organizer: ${error.stack || error.message}`
    );
    res.status(statusCode.serverError).json({
      error: "Something went wrong",
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
      message: "Staidum fetch successfully",
      stadium: updatedStadium,
    });
  } catch (error) {
    logger.error(`Error fetch stadium: ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({
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
        .json({ error: "Name is required" });
    }

    if (!organizer) {
      return res
        .status(statusCode.notFound)
        .json({ success: false, error: "Organizer not found" });
    }

    const exists = await stadiumExists(name, stadiumId);

    res.status(statusCode.success).json({
      exists: !!exists,
    });
  } catch (error) {
    logger.error(`Error fetch stadium: ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({ error: "Something went wrong" });
  }
};
