import { z } from "zod";
import dotenv from "dotenv";

const ENV_MODE = process.env.NODE_ENV || "development";

const envFile =
  ENV_MODE === "production" ? ".env.production" : ".env.development";

dotenv.config({ path: envFile });

const envSchema = z.object({
  // Server
  PORT: z.string().regex(/^\d+$/).transform(Number).default("3000"),

  // MongoDB URIs
  MONGODB_URI: z.string().min(1),
  MONGODB_ATLAS_URI: z.string().min(1),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID missing"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET missing"),

  // JWT
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 chars"),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_USER_REFRESH_TOKEN_EXPIRES_IN: z.string().min(1),
  JWT_ADMIN_REFRESH_TOKEN_EXPIRES_IN: z.string().min(1),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().min(1),

  // Mail
  EMAIL: z.string().pipe(z.email("Invalid email format")),
  PASSWORD: z.string().min(1, "Email App Password required"),

  // Frontend
  FRONTEND_URL: z.string().pipe(z.url("Invalid FRONTEND_URL")),

  // Location API
  LOCATION_API_KEY: z.string().min(1),

  // Redis
  REDIS_URI: z.string().pipe(z.url("Invalid REDIS_URI")),
  REDIS_OTP_EXPIRES_IN: z.string().regex(/^\d+$/).transform(Number),
  REDIS_EVENT_VALIDATION_EXPIRES_IN: z
    .string()
    .regex(/^\d+$/)
    .transform(Number),

  // AWS
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  AWS_BUCKET_REGION: z.string().min(1),
  AWS_SIGNED_URI_EXPIRES_IN: z.string().regex(/^\d+$/).transform(Number),

  // Google Maps
  GOOGLE_MAP_URI: z.string(),

  // Callback URLs
  GOOGLE_CALLBACK_URL: z.string(),

  // Branding
  LOGO_URL: z.string(),

  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "http"]).default("info"),

  // Locking
  LOCK_TTL: z.string().regex(/^\d+$/).transform(Number),
  LOCKMETA_TTL: z.string().regex(/^\d+$/).transform(Number),
  LOCK_EXTEND_TTL: z.string().regex(/^\d+$/).transform(Number),
  LOCKMETA_EXTEND_TTL: z.string().regex(/^\d+$/).transform(Number),

  // PayPal
  PAYPAL_CLIENT_ID: z.string().min(1),
  PAYPAL_CLIENT_SECRET: z.string().min(1),
  PAYPAL_WEBHOOK_ID: z.string().min(1),

  // Currency API
  CURRENCY_API_KEY: z.string().min(1),

  // Booking rule (your business logic)
  BOOKING_BLOCK_HOURS: z.string().regex(/^\d+$/).transform(Number).default("4"),

  // Open Exchange Rate
  OPEN_EXCHANGES_RATE_URL: z.string().min(1),

  // Create Order
  CREATE_ORDER_QR_CODE_EXPIRY: z.string().min(1),
  QR_DATA_JWT_SECRET: z.string().min(10),

  // Clean Order Cron
  ORDER_CLEANUP_CRON: z.string().min(1),

  // Refund Check Cron
  REFUND_CHECK_CRON: z.string().min(1),

  // Event Check Cron
  EVENT_CHECK_CRON: z.string().min(1),

  // Payout Check Cron
  PAYOUT_CHECK_CRON: z.string().min(1),

  // Paypal Base URL
  PAYPAL_API_BASE: z.string().min(1),

  ALLOW_OAUTH_INLINE: z.string().min(1),
  NODE_ENV: z.string().min(1),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:");
  const tree = z.treeifyError(result.error);
  console.dir(tree, { depth: null });
  process.exit(1);
}

export const ENV = result.data;
