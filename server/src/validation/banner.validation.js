import { z } from "zod";

export const bannerSchema = z.object({
  title: z
    .string()
    .trim()
    .max(100, "Title must be at most 100 characters")
    .optional(),

  image: z.string().min(1, "Banner image is required"),

  mobileImage: z.string().nullable().optional(),

  isActive: z.boolean().optional(),
});
