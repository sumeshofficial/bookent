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
  SEATS_NOT_AVAILABLE: {
    CODE: "SEATS_NOT_AVAILABLE",
    MSG: "Sorry, selected seats are no longer available",
  },
  INVALID_WEBHOOK: {
    CODE: "INVALID_WEBHOOK",
    MSG: "Invalid PayPal Webhook attempt",
  },
  ORDER_NOTFOUND_FOR_PAYPAL_ID: {
    CODE: "ORDER_NOTFOUND_FOR_PAYPAL_ID",
    MSG: "Order not found for PayPal order ID",
  },
  ORDER_NOTFOUND: {
    CODE: "ORDER_NOTFOUND",
    MSG: "Order not found for order Id or user",
  },
  JWT_EXPIRED: {
    CODE: "JWT_EXPIRED",
    MSG: "Your session has expired. Please log in again.",
  },
  JWT_PAYLOAD_NOT_FOUND: {
    CODE: "JWT_EXPIRED_OR_INVALID",
    MSG: "Invalid or expired authentication token. Please log in again.",
  },
  ORDER_NOT_CONFIRMED: {
    CODE: "ORDER_NOT_CONFIRMED",
    MSG: "This ticket has not been confirmed yet.",
  },
  TICKET_ALREADY_USED: {
    CODE: "TICKET_ALREADY_USED",
    MSG: "This ticket has already been used and is no longer valid.",
  },
  DAILY_EVENT_LIMIT_REACHED: {
    CODE: "DAILY_EVENT_LIMIT_REACHED",
    MSG: "Daily event creation limit reached. Maximum 2 events per day allowed.",
  },
  EVENT_NOT_ONGOING: {
    CODE: "EVENT_NOT_ONGOING",
    MSG: "Ticket verification is not allowed because the event is not currently ongoing.",
  },
  EVENT_MISMATCH: {
    CODE: "EVENT_MISMATCH",
    MSG: "This ticket does not belong to the selected event.",
  },
  EVENT_INVALID: {
    CODE: "EVENT_INVALID",
    MSG: "Event details are incomplete or invalid",
  },
  INVALID_QR: {
    CODE: "INVALID_QR",
    MSG: "Invalid or unsupported QR code",
  },
  PASSWORD_COMPARISON_ERROR: {
    CODE: "PASSWORD_COMPARISON_FAILED",
    MSG: "Password comparison failed",
  },
  PASSWORD_NOT_MATCH: {
    CODE: "PASSWORD_NOT_MATCH",
    MSG: "Current Password not match",
  },
  NEW_PASSWORD_SAME_AS_OLD: {
    CODE: "NEW_PASSWORD_SAME_AS_OLD",
    MSG: "New password must be different from the current password",
  },
  VALIDATION_ERROR: {
    CODE: "VALIDATION_ERROR",
    MSG: "Validation error",
  },
  COUPON_NOTFOUND: {
    CODE: "COUPON_NOTFOUND",
    MSG: "Coupon not found or already deleted",
  },
  COUPON_ALREADY_EXISTS: {
    CODE: "COUPON_ALREADY_EXISTS",
    MSG: "A coupon with this code already exists. Please use a different code.",
  },
  COUPON_EXPIRED: {
    CODE: "COUPON_EXPIRED",
    MSG: "This coupon has expired and is no longer valid.",
  },
  COUPON_CANNOT_BE_USED: {
    CODE: "COUPON_CANNOT_BE_USED",
    MSG: "This coupon is not eligible for use at the moment.",
  },
  MINIMUM_ORDER_AMOUNT_NOT_MET: {
    CODE: "MINIMUM_ORDER_AMOUNT_NOT_MET",
    MSG: "Order amount does not meet the minimum required to apply this coupon.",
  },
  COUPON_USAGE_LIMIT: {
    CODE: "COUPON_CANNOT_BE_USED",
    MSG: "Coupon usage limit reached for this user",
  },
  INSUFFICIENT_WALLET_BALANCE: {
    CODE: "INSUFFICIENT_WALLET_BALANCE",
    MSG: "You do not have enough wallet balance to complete this payment.",
  },
  WALLET_ERROR: {
    CODE: "WALLET_ERROR",
    MSG: "Something went wrong with your wallet. Please try again later.",
  },
  WALLET_TRANSACTION_FAILED: {
    CODE: "WALLET_TRANSACTION_FAILED",
    MSG: "Wallet transaction failed. Amount has not been deducted.",
  },
  EVENT_ALREADY_CANCELLED: {
    CODE: "EVENT_ALREADY_CANCELLED",
    MSG: "This event has already been cancelled and cannot be updated.",
  },
  EVENT_ALREADY_COMPLETED: {
    CODE: "EVENT_ALREADY_COMPELTED",
    MSG: "Completed events cannot be cancelled",
  },
  BANNER_LIMIT_REACHED: {
    CODE: "BANNER_LIMIT_REACHED",
    MSG: "Maximum active banners limit reached.",
  },
  BANNER_NOT_FOUND: {
    CODE: "BANNER_NOT_FOUND",
    MSG: "Banner not found or already deleted",
  },
  INVALID_CREDENTIALS: {
    CODE: "INVALID_CREDENTIALS",
    MSG: "Invalid email or password",
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

export const SOCKET_ERROR_TYPE = {
  SOCKET_AUTH: "socket-auth",
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

export const CURRENCY_CODE = {
  USD: "USD",
};

export const PAYMENT_METHOD = {
  PAYPAL: "PAYPAL",
  WALLET: "WALLET",
};

export const ORDER_STATUS = {
  PENDING_PAYPAL_ORDER: "PENDING_PAYPAL_ORDER",
  PAID: "PAID",
  CONFIRMED: "CONFIRMED",
  REFUND_REQUIRED: "REFUND_REQUIRED",
  REFUNDED: "REFUNDED",
  ABANDONED: "ABANDONED",
};

export const REFUND_STATUS = {
  NOT_REQUIRED: "NOT_REQUIRED",
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  FAILED: "FAILED",
};

export const MONGO_SCHEMA = {
  USER: "User",
  EVENT: "Event",
  TRANACTION: "Transaction",
  ORGANIZER: "Organizer",
  STADIUM: "Stadium",
  ORDER: "Order",
  REFRESH_TOKEN: "RefreshToken",
};

export const TRANSACTION_RECIVER_TYPE = {
  USER: "User",
  ORGANIZER: "Organizer",
  PLATFORM: "Platform",
};

export const TRANSACTION_REASON = {
  BOOKING_PAYMENT: "BOOKING_PAYMENT",
  WALLET_REFUND: "WALLET_REFUND",
  ORGANIZER_PAYOUT: "ORGANIZER_PAYOUT",
  ADMIN_ADJUSTMENT: "ADMIN_ADJUSTMENT",
  WALLET_TOPUP: "WALLET_TOPUP",
};

export const TRANSACTION_TYPE = {
  SALE: "SALE",
  REFUND: "REFUND",
  TRANSFER: "TRANSFER",
};

export const TRANSACTION_STATUS = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  FAILED: "FAILED",
};

export const TRANSACTION_DIRECTION = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
};

export const COUPON_TYPES = {
  FLAT: "FLAT",
  PERCENTAGE: "PERCENTAGE",
};
