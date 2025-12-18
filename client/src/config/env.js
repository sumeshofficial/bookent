import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.url({
    message: "VITE_API_URL must be a valid URL",
  }),

  VITE_SOCKET_URL: z.string().min(1, "VITE_SOCKET_URL is required"),

  VITE_STATE_API_URL: z.string().min(1, "VITE_STATE_API_URL is required"),

  VITE_CITY_API_URL: z.string().min(1, "VITE_CITY_API_URL is required"),

  VITE_RAPIDAPI_KEY: z.string().min(1, "VITE_RAPIDAPI_KEY is required"),

  VITE_PAYPAL_CLIENT_ID: z.string().min(1, "VITE_PAYPAL_CLIENT_ID is required"),
});

const result = envSchema.safeParse(import.meta.env);

if (!result.success) {
  console.error("Invalid environment variables:");
  for (const issue of result.error.issues) {
    const path = issue.path.join(".") || "root";
    console.error(`• ${path}: ${issue.message}`);
  }
  throw new Error("Invalid environment variables");
}

export const ENV = result.data;
