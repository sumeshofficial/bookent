import {
  getUser,
  updatePassword,
  updateUser,
} from "../../services/user/account.service.js";
import { ERRORS, RES_MESSAGES } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError, asyncHandler, sendResponse } from "../../utility/helpers.js";

// Get user
export const getUserController = asyncHandler(async (req, res) => {
  const user = await getUser(req.user);

  sendResponse(
    res,
    { message: RES_MESSAGES.USER_FETCHED.MSG, user },
    STATUS_CODE.SUCCESS
  );
});

// Update user profile controller
export const updateUserController = asyncHandler(async (req, res) => {
  const user = await updateUser(req.body);

  sendResponse(
    res,
    { message: RES_MESSAGES.USER_UPDATED.MSG, user },
    STATUS_CODE.SUCCESS
  );
});

export const updateUserPasswordController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError(
      STATUS_CODE.MISSING_FIELD,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.CODE,
      ERRORS.ALL_FIELDS_ARE_REQUIRED.MSG
    );
  }

  await updatePassword(userId, currentPassword, newPassword);

  sendResponse(
    res,
    { message: "Password changed successfull" },
    STATUS_CODE.SUCCESS
  );
});
