import { statusCode } from "../../utility/constants.js";

// Admin middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(statusCode.permissionDenied).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
};
