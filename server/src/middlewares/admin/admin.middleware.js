import { STATUS_CODE } from "../../utility/constants/statusCode.js";

// Admin middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(STATUS_CODE.PERMISSION_DENIED).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
};
