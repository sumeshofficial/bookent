// Status Code
export const statusCode = {
  serverError: 500,
  badRequest: 400,
  unAuthorized: 401,
  missingField: 422,
  success: 200,
  created: 201,
  conflict: 409,
  notFound: 404,
  permissionDenied: 403,
};
export const STATUS_CODE = {
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  MISSING_FIELD: 422,
  SUCCESS: 200,
  CREATED: 201,
  CONFLICT: 409,
  NOTFOUND: 404,
  PERMISSION_DENIED: 403,
  GONE: 410,
};

// Errors
export const ERRORS = {
  USER_NOT_FOUND: {
    CODE: "USER_NOT_FOUND",
    MSG: "User not found",
  },
  AUTHENTICATION_FAILED: {
    CODE: "AUTHENTICATION_FAILED",
    MSG: "Authentication failed. Please try again.",
  },
  LOCK_EXPIRED: {
    CODE: "LOCK_EXPIRED",
    MSG: "Your session has expired. Please select seats again.",
  },
  LOCK_NOT_FOUND: {
    CODE: "LOCK_NOT_FOUND",
    MSG: "Lock no longer exists. Please reselect seats.",
  },
  UNAUTHORIZED_ACCESS: {
    CODE: "UNAUTHORIZED_ACCESS",
    MSG: "You are not allowed to use this lock.",
  },
  EVENT_NOT_FOUND: {
    CODE: "EVENT_NOT_FOUND",
    MSG: "Event not found.",
  },
  STADIUM_NOT_FOUND: {
    CODE: "STADIUM_NOT_FOUND",
    MSG: "Stadium not found.",
  },
  SECTION_NOT_FOUND: {
    CODE: "SECTION_NOT_FOUND",
    MSG: "Section not found in stadium layout.",
  },
  ALL_FIELDS_ARE_REQUIRED: {
    CODE: "ALL_FIELDS_ARE_REQUIRED",
    MSG: "All fields are required.",
  },
  EMAIL_ALREADY_EXISTS: {
    CODE: "EMAIL_ALREADY_EXISTS",
    MSG: "A user with this email address already exists.",
  },
  USER_BLOCKED: {
    CODE: "USER_BLOCKED",
    MSG: "You are blocked by the admin",
  },
  TOKEN_MISSING: {
    CODE: "TOKEN_MISSING",
    MSG: "Missing Refresh Token.",
  },
  NO_PENDING_OTP: {
    CODE: "NO_PENDING_OTP",
    MSG: "No pending OTP found for user.",
  },
  OTP_EXPIRED: {
    CODE: "OTP_EXPIRED",
    MSG: "OTP expired or not found",
  },
  OTP_INVALID: {
    CODE: "OTP_INVALID",
    MSG: "Invalid OTP",
  },
  ALREADY_RELEASED: {
    MSG: "Lock already released",
  },
  INVALID_QUANTITY: {
    MSG: "Quantity must be greater than 0",
  },
  INSUFFICIENT_TICKETS: {
    MSG: "Not enough tickets available",
  },
  LOCK_FAILED: {
    MSG: "Failed to lock tickets",
  },
  INVALID_LOCK: {
    MSG: "One or more locks are invalid",
  },
  UNAUTHORIZED_LOCK: {
    MSG: "One or more locks do not belong to this user",
  },
  SLUG_ALREADY_EXISTS: {
    CODE: "SLUG_ALREADY_EXISTS",
    MSG: "A event with this title or slug already exists",
  },
  VALIDATION_EXPIRED: {
    CODE: "VALIDATION_EXPIRED",
    MSG: "Validation session expired. Please start again.",
  },
  ORGANIZER_NOT_FOUND: {
    CODE: "ORGANIZER_NOT_FOUND",
    MSG: "Organizer not found",
  },
  TICKET_NOT_FOUND: {
    CODE: "TICKET_NOT_FOUND",
    MSG: "Ticket and Section details not found",
  },
  PAYPAL_ORDER_ERROR: {
    CODE: "ORDER_CREATION_FAILED",
    MSG: "Failed to create PayPal order",
  },
  PAYPAL_ORDER_CAPTURE_ERROR: {
    CODE: "ORDER_CAPUTURE_FAILED",
    MSG: "Failed to capture PayPal order",
  },
};

// Response Messages
export const RES_MESSAGES = {
  USER_VERIFIED: {
    MSG: "User verified successfully",
  },
  OTP_SENT: {
    MSG: "OTP sent successfully",
  },
  USER_LOGGED_IN: {
    MSG: "User logged in successfully",
  },
  OTP_RESENT: {
    MSG: "OTP resent successfully",
  },
  PASSWORD_UPDATED: {
    MSG: "Password updated successfully",
  },
  USER_LOGGED_OUT: {
    MSG: "User logged out successfully",
  },
  USER_FETCHED: {
    MSG: "User fetched successfully",
  },
  USER_UPDATED: {
    MSG: "User updated successfully",
  },
  STADIUM_DELETED: {
    MSG: "Stadium deleted successfully",
  },
};

// Socket events
export const SOCKET_EVENTS = {
  USER_BLOCKED: "user-blocked",
  CONNECT: "connect",
  CONNECTION: "connection",
  JOIN_EVENT: "join-event",
  SEAT_UPDATE: "seat-update",
  SEAT_UPDATE_BULK: "seat-update-bulk",
  LOCK_SECTION: "lock-section",
  RELEASE_SECTION: "release-section",
  CONFIRM_BOOKING: "confirm-booking",
  PAYMENT_STATUS: "payment-status",
  DISCONNECT: "disconnect",
};

// Redis events
export const REDIS_EVENTS = {
  EXPIRED: "__keyevent@0__:expired",
  ERROR: "error",
  CONNECT: "connect",
  NOTIFY: "notify-keyspace-events",
  EX: "Ex",
  SEAT_UPDATE: "seat-update",
};

export const DB_EVENTS = {
  CONNECTED: "connected",
};

export const FEE_CONFIG = {
  bookingFeePercent: 0.08,
  gstPercent: 0.18,
};
