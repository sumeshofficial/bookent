import { z } from "zod";

export const bannerSchema = z.object({
  title: z
    .string()
    .trim()
    .max(100, "Title must be at most 100 characters")
    .optional(),

  subtitle: z
    .string()
    .trim()
    .max(200, "Subtitle must be at most 200 characters")
    .optional(),

  image: z.string().min(1, "Banner image is required"),

  mobileImage: z.string().nullable().optional(),

  order: z
    .number({
      invalid_type_error: "Order must be a number",
    })
    .int("Order must be an integer")
    .min(0, "Order must be 0 or greater")
    .optional(),

  isActive: z.boolean().optional(),
});
