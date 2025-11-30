import { STATUS_CODE } from "./constants.js";

export class AppError extends Error {
  constructor(
    status = STATUS_CODE.SERVER_ERROR,
    code = "INTERNAL_SERVER_ERROR",
    message = "An unexpected error occurred. We are investigating the issue."
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.isOperational = true;
  }
}

export const sendResponse = (res, data, statusCode = STATUS_CODE.SUCCESS) => {
  res.status(statusCode).json(data);
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
