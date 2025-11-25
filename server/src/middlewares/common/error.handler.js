import logger from "../../config/logger.js";
import { STATUS_CODE } from "../../utility/constants.js";

export const errorHandler = (err, req, res, _next) => {
  logger.error(err.stack);
  const statusCode = err.status || STATUS_CODE.SERVER_ERROR;
  const code = err.code || "SERVER_ERROR";
  const message =
    err.message ||
    "An unexpected error occurred. We are investigating the issue.";
  res.status(statusCode).json({ error: { code, message } });
};
