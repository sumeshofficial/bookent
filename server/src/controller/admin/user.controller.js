import { findUserById } from "../../repositories/user/user.repository.js";
import { updateUserStatusService } from "../../services/admin/user.service.js";
import { getAllUsers } from "../../services/user.service.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

// Get all users controller
export const getUsersController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const sort = req.query.sort || "newest";
  const status = req.query.status || "all";
  const skip = (page - 1) * limit;

  const { totalUsers, users } = await getAllUsers({
    limit,
    skip,
    search,
    sort,
    status,
  });

  sendResponse(
    res,
    { page, totalPages: Math.ceil(totalUsers / limit), totalUsers, users },
    STATUS_CODE.SUCCESS
  );
});

// Update user status controller
export const updateStatusController = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!userId || !status) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  await updateUserStatusService(userId, status);

  sendResponse(
    res,
    { message: "Users status update successfully" },
    STATUS_CODE.SUCCESS
  );
});

// Get user detalis controller
export const getUserDetailsController = asyncHandler(async (req, res) => {
  const id = req.params.userId;

  if (!id) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  const user = await findUserById(id);

  if (!user) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.USER_NOT_FOUND.CODE,
      ERRORS.USER_NOT_FOUND.MSG
    );
  }

  sendResponse(res, user, STATUS_CODE.SUCCESS);
});
