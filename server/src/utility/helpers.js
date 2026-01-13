import { STATUS_CODE } from "./constants/statusCode.js";
import slugify from "slugify";

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

export const createSlug = (text) => {
  if (!text || typeof text !== "string") {
    return "";
  }
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export const validateEventAvailability = (event, blockHours = 4) => {
  if (!event.matchDate || !event.matchTime) {
    return false;
  }

  // Build event datetime using LOCAL time
  const eventDate = new Date(event.matchDate);
  const [hours, minutes] = event.matchTime.split(":").map(Number);

  eventDate.setHours(hours);
  eventDate.setMinutes(minutes);
  eventDate.setSeconds(0);
  eventDate.setMilliseconds(0);

  if (isNaN(eventDate)) {
    return false;
  }

  const now = new Date();
  const diffMs = eventDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return eventDate >= now && diffHours >= blockHours;
};
