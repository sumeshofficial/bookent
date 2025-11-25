import { getUser, updateUser } from "../../services/user/account.service.js";
import { STATUS_CODE } from "../../utility/constants.js";
import { asyncHandler, sendResponse } from "../../utility/helpers.js";

// Get user
export const getUserController = asyncHandler(async (req, res) => {
  const user = await getUser(req.user);

  sendResponse(
    res,
    { message: "User fetch succssfully", user },
    STATUS_CODE.SUCCESS
  );
});

// Update user profile controller
export const updateUserController = asyncHandler(async (req, res) => {
  const user = await updateUser(req.body);

  sendResponse(
    res,
    { message: "Updated Successfully", user },
    STATUS_CODE.SUCCESS
  );
});
