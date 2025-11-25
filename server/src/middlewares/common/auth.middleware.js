import logger from "../../config/logger.js";
import { verifyTokenAndGetUser } from "../../services/auth.service.js";
import { getObjectURL } from "../../services/s3.service.js";
import { isTokenBlacklisted } from "../../services/token.service.js";
import { STATUS_CODE, statusCode } from "../../utility/constants.js";
import { sanitizeUser } from "../../utility/user/sanitizeUser.js";

// Token verify
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Missing or invalid Authorization header");
      return res
        .status(statusCode.unAuthorized)
        .json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyTokenAndGetUser(token);

    if (!user) {
      return res
        .status(statusCode.unAuthorized)
        .json({ message: "User not found" });
    }

    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ message: "Token expired or logged out" });
    }

    if (user.status === "blocked") {
      return res
        .status(statusCode.unAuthorized)
        .json({ message: "You are bloked by admin" });
    }

    if (user.profileImage && user.profileImage.includes("uploads")) {
      const url = await getObjectURL(user.profileImage);
      user.profileImage = url;
    }

    const updatedUser = sanitizeUser(user);

    req.user = updatedUser;
    logger.http(
      `${req.method} ${req.originalUrl} - Auth passed for user ${user._id}`
    );
    next();
  } catch (error) {
    logger.error(
      `Authentication failed: ${error.stack || error.message || "Unknown error"}`
    );
    res
      .status(statusCode.unAuthorized)
      .json({ message: error.message || "Invalid token" });
  }
};
