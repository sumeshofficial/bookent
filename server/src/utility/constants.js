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
};

// Socket events
export const SOCKET_EVENTS = {
  USER_BLOCKED: "user-blocked",
  CONNECT: "connect",
  CONNECTION: "connection",
  JOIN_EVENT: "join-event",
  SEAT_UPDATE: "seat-update",
  LOCK_SECTION: "lock-section",
  RELEASE_SECTION: "release-section",
  CONFIRM_BOOKING: "confirm-booking",
  PAYMENT_STATUS: "payment-status",
  DISCONNECT: "disconnect",
};
