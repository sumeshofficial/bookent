import logger from "../../config/logger.js";
import {
  checkOrganizer,
  findOrganizerById,
} from "../../repositories/organizer/organizer.repository.js";
import {
  findStadium,
  findStadiums,
} from "../../repositories/organizer/stadium.repository.js";
import {
  findAllStadiumsWithOrgnaizerId,
  stadiumExists,
} from "../../services/organizer.service.js";
import {
  createStadium,
  deleteStadium,
  updateStadium,
} from "../../services/organizer/stadium.service.js";
import { getObjectURL } from "../../services/s3.service.js";
import { ERRORS, RES_MESSAGES } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

// Create Stadium
export const createStadiumController = asyncHandler(async (req, res) => {
  const { stadiumDetails, shapes, layoutImageKey, organizerId } = req.body;

  if (!shapes || !stadiumDetails || !layoutImageKey || !organizerId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const payload = {
    organizerId,
    stadiumDetails,
    shapes,
    layoutImageKey,
  };

  const stadium = await createStadium(payload);

  sendResponse(res, stadium, STATUS_CODE.CREATED);
});

// Update stadium
export const updateStadiumController = asyncHandler(async (req, res) => {
  const user = req.user;
  const { stadiumId } = req.params;
  const payload = req.body;

  if (!stadiumId || !payload) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const updatedStadium = await updateStadium(stadiumId, payload, user._id);

  sendResponse(res, { stadium: updatedStadium }, STATUS_CODE.SUCCESS);
});

// Delete Stadium
export const deleteStadiumController = asyncHandler(async (req, res) => {
  const user = req.user;
  const { stadiumId } = req.params;

  if (!stadiumId) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  await deleteStadium(user._id, stadiumId);

  sendResponse(
    res,
    { message: RES_MESSAGES.STADIUM_DELETED.MSG },
    STATUS_CODE.SUCCESS
  );
});

// Get stadiums
export const getStadiums = async (req, res) => {
  try {
    const organizer = await checkOrganizer(req.user._id);
    if (!organizer) {
      return res.status(STATUS_CODE.NOTFOUND).json({
        message: "Organizer profile not found",
      });
    }

    const stadiums = await findStadiums();

    if (!stadiums || stadiums.length === 0) {
      return res.status(STATUS_CODE.SUCCESS).json({
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

    res.status(STATUS_CODE.SUCCESS).json({
      message: "Stadiums fetched successfully",
      stadiums: updatedStadiums,
    });
  } catch (error) {
    res.status(STATUS_CODE.SERVER_ERROR).json({
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
      return res.status(STATUS_CODE.NOTFOUND).json({
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
      return res.status(STATUS_CODE.SUCCESS).json({
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

    res.status(STATUS_CODE.SUCCESS).json({
      message: "Stadiums fetched successfully",
      stadiums: updatedStadiums,
      pagination: { total, page, totalPages },
    });
  } catch (error) {
    logger.error(
      `Error fecth stadium for organizer: ${error.stack || error.message}`
    );
    res.status(STATUS_CODE.SERVER_ERROR).json({
      error: "Something went wrong",
    });
  }
};

// Get Staium
export const getStadium = async (req, res) => {
  try {
    logger.http(`${req.method} ${req.originalUrl}`);
    const { stadiumSlug } = req.params;
    const user = req.user;

    logger.info("Check organizer is exist");
    const organizer = await checkOrganizer(user._id);

    logger.info("Fetching stadium form db");
    const stadium = await findStadium(organizer._id, stadiumSlug);

    if (!stadium) {
      logger.warn(
        `Stadium not found for organizerId=${organizer._id} stadiumId=${stadiumSlug}`
      );
      return res.status(STATUS_CODE.NOTFOUND).json({
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
    res.status(STATUS_CODE.SUCCESS).json({
      message: "Staidum fetch successfully",
      stadium: updatedStadium,
    });
  } catch (error) {
    logger.error(`Error fetch stadium: ${error.stack || error.message}`);
    res.status(STATUS_CODE.SERVER_ERROR).json({
      error: "Somthing went wrong",
    });
  }
};

// Check stadium is already exists
export const checkStadiumName = async (req, res) => {
  try {
    const { name, stadiumId = "" } = req.query;
    const organizer = await checkOrganizer(req.user._id);

    if (!name) {
      return res
        .status(STATUS_CODE.MISSING_FIELD)
        .json({ error: "Name is required" });
    }

    if (!organizer) {
      return res
        .status(STATUS_CODE.NOTFOUND)
        .json({ success: false, error: "Organizer not found" });
    }

    const exists = await stadiumExists(name, stadiumId);

    res.status(STATUS_CODE.SUCCESS).json({
      exists: !!exists,
    });
  } catch (error) {
    logger.error(`Error fetch stadium: ${error.stack || error.message}`);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};
