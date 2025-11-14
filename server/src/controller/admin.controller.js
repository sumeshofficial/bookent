import logger from "../config/logger.js";
import { findOrganizerById, findUserById } from "../services/auth.service.js";
import {
  getAllOrganizers,
  updateRequest,
} from "../services/organizer.service.js";
import { getAllUsers, updateUserStatus } from "../services/user.service.js";
import { statusCode } from "../utility/constants.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "newest";
    const status = req.query.status || "all";
    const skip = (page - 1) * limit;

    logger.http(
      `GET /api/admin/users?page=${page}&limit=${limit}&search=${search}&sort=${sort}&status=${status}`
    );

    logger.info(
      `Fetching users: page=${page}, limit=${limit}, filter=${status}, status=${status}`
    );
    const { totalUsers, users } = await getAllUsers({
      limit,
      skip,
      search,
      sort,
      status,
    });

    if (!users.length) {
      logger.warn("No users found for given filters");
    } else {
      logger.info(`Fetched ${users.length} users out of ${totalUsers} total`);
    }

    res.status(statusCode.success).json({
      success: true,
      message: "Users fetched successfully",
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users,
    });
  } catch (error) {
    logger.error(`Error fetching users: ${error.stack || error.message}`);
    res
      .status(statusCode.serverError)
      .json({ success: false, error: "Something went wrong" });
  }
};

// Update user status
export const updateStatus = async (req, res) => {
  const { id, status: newStatus } = req.params;
  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    if (!id || !newStatus) {
      logger.warn(`Missing required fields: id=${id}, status=${newStatus}`);
      return res.status(statusCode.missingField).json({
        success: false,
        message: "userId and status are required",
      });
    }

    logger.info(
      `Request to update user status: userId=${id}, newStatus=${newStatus}`
    );
    await updateUserStatus({ userId: id, newStatus });

    logger.info(`Successfully updated user ${id} → status=${newStatus}`);
    res.status(statusCode.success).json({
      success: true,
      message: "Users status update successfully",
    });
  } catch (error) {
    logger.error(`Error updating user status: ${error.stack || error.message}`);
    res
      .status(statusCode.serverError)
      .json({ success: false, error: "Something went wrong" });
  }
};

// Get user detalis
export const getUserDetails = async (req, res) => {
  const id = req.params.id;
  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    if (!id) {
      logger.warn("Missing required field: userId not provided");
      return res
        .status(statusCode.missingField)
        .json({ success: false, error: "Missing field" });
    }

    logger.info(`Fetching user details for userId=${id}`);
    const user = await findUserById(id);

    if (!user) {
      logger.warn(`User not found for ID=${id}`);
      return res
        .status(statusCode.notFound)
        .json({ success: false, error: "User not found" });
    }

    logger.info(
      `User fetched successfully: ID=${user._id}, Role=${user.role}, Email=${user.email}`
    );
    res
      .status(statusCode.success)
      .json({ success: true, message: "User fetch successfully", user });
  } catch (error) {
    logger.error(`Error fetching user: ${error.stack || error.message}`);
    res
      .status(statusCode.serverError)
      .json({ success: false, error: "Something went wrong" });
  }
};

// Get all organizers
export const getOrganizers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const sort = req.query.sort || "newest";
    const status = req.query.status || "all";
    const skip = (page - 1) * limit;

    logger.http(
      `GET /api/admin/organizers?page=${page}&limit=${limit}&search=${search}&sort=${sort}&status=${status}`
    );

    logger.info(
      `Fetching organizers: page=${page}, limit=${limit}, filter=${status}, status=${status}`
    );

    const { totalOrganizers, organizers } = await getAllOrganizers({
      limit,
      skip,
      search,
      sort,
      status,
    });

    if (!organizers.length) {
      logger.warn("No organizers found for given filters");
    } else {
      logger.info(
        `Fetched ${organizers.length} organizers out of ${totalOrganizers} total`
      );
    }

    res.status(statusCode.success).json({
      success: true,
      message: "Organizers fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalOrganizers / limit),
      totalOrganizers,
      organizers,
    });
  } catch (error) {
    logger.error(`Error fetching organizers: ${error.stack || error.message}`);
    res.status(statusCode.serverError).json({
      success: false,
      error: "Failed to fetch organizers. Please try again later.",
    });
  }
};

// Get organizer details
export const getOrganizersDetails = async (req, res) => {
  const id = req.params.id;
  try {
    logger.http(`${req.method} ${req.originalUrl}`);

    if (!id) {
      logger.warn("Missing required field: organizerId not provided");
      return res
        .status(statusCode.missingField)
        .json({ success: false, error: "Missing field" });
    }

    logger.info(`Fetching organizer details for organizerId=${id}`);
    const organizer = await findOrganizerById(id);

    if (!organizer) {
      logger.warn(`Organizer not found for ID=${id}`);
      return res
        .status(statusCode.notFound)
        .json({ success: false, error: "Organizer not found" });
    }

    logger.info(
      `User fetched successfully: ID=${organizer._id} UserId=${organizer.userId} OrganizationName=${organizer.organizationDetails.name}`
    );
    return res.status(statusCode.success).json({
      success: true,
      message: "Organizer fetch successfully",
      organizer,
    });
  } catch (error) {
    logger.error(`Error fetching organizer: ${error.stack || error.message}`);
    res
      .status(statusCode.serverError)
      .json({ success: false, error: "Something went wrong" });
  }
};

// Handle organizer request
export const handleOrganizerRequest = async (req, res) => {
  try {
    const { id, status } = req.params;

    logger.http(`${req.method} ${req.originalUrl}`);
    if (!id || !status) {
      logger.warn(`Missing required fields: id=${id}, status=${status}`);
      return res
        .status(statusCode.missingField)
        .json({ success: false, error: "Missing field" });
    }

    logger.info(
      `Update organizer request for OrganizerId=${id} with Status=${status}`
    );
    await updateRequest({ id, status });

    logger.info(
      `Updated organizer request for OrganizerId=${id} with Status=${status}`
    );
    res
      .status(statusCode.success)
      .json({ success: true, message: "Organizer Updated" });
  } catch (error) {
    logger.error(
      `Error updating organizer request: ${error.stack || error.message}`
    );
    res.status(statusCode.serverError).json({
      success: false,
      error: "Something went wrong",
    });
  }
};
