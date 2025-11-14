import logger from "../config/logger.js";
import { verifyTokenAndGetUser } from "../services/auth.service.js";
import { statusCode } from "../utility/constants.js";

// Token verify
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    logger.http(`${req.method} ${req.originalUrl} - Auth check started`);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Missing or invalid Authorization header");
      return res
        .status(statusCode.unAuthorized)
        .json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    logger.debug("Extracted token from header");
    const user = await verifyTokenAndGetUser(token);

    if (user) {
      logger.info(
        `Authenticated user: ID=${user._id}, Role=${user.role}, Status=${user.status}`
      );
    } else {
      logger.warn("Token verified but user not found");
      return res
        .status(statusCode.unAuthorized)
        .json({ message: "User not found" });
    }

    if (user.status === "blocked") {
      logger.warn(`Blocked user attempted access: ID=${user._id}`);
      return res
        .status(statusCode.unAuthorized)
        .json({ message: "You are bloked by admin" });
    }

    req.user = user;
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
