import { verifyTokenAndGetUser } from "../repositories/user/user.repository.js";
import { getObjectURL } from "../services/s3.service.js";
import { STATUS_CODE } from "./constants.js";
import { AppError } from "./helpers.js";
import { sanitizeUser } from "./user/sanitizeUser.js";

export const verifySocketToken = async (token) => {
  // 1. Verify JWT + get user from DB
  const user = await verifyTokenAndGetUser(token);

  if (!user) {
    throw new AppError(
      STATUS_CODE.UNAUTHORIZED,
      "USER_NOT_FOUND",
      "User not found"
    );
  }

  // 2. Blocked user check
  if (user.status === "blocked") {
    throw new AppError(
      STATUS_CODE.UNAUTHORIZED,
      "USER_BLOCKED",
      "You are blocked by admin"
    );
  }

  // 3. Convert S3 image if needed
  if (user.profileImage && user.profileImage.includes("uploads")) {
    const url = await getObjectURL(user.profileImage);
    user.profileImage = url;
  }

  // 4. Sanitize and return
  return sanitizeUser(user);
};
