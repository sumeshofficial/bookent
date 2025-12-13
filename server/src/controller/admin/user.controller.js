import logger from "../../config/logger.js";
import { updateUserStatusService } from "../../services/admin/user.service.js";
import { findUserById } from "../../services/auth.service.js";
import { getAllUsers } from "../../services/user.service.js";
import { STATUS_CODE, statusCode } from "../../utility/constants/statusCode.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

// Get all users controller
export const getUsersController = async (req, res) => {
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

// Update user status controller
export const updateStatusController = asyncHandler(async (req, res) => {
  await updateUserStatusService(req.params);

  sendResponse(
    res,
    { message: "Users status update successfully" },
    STATUS_CODE.SUCCESS
  );
});

// Get user detalis controller
export const getUserDetailsController = async (req, res) => {
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
