import { getUser, updateUser } from "../../services/user/account.service.js";
import { STATUS_CODE, RES_MESSAGES } from "../../utility/constants.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

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
