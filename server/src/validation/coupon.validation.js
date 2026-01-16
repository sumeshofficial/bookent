import { z } from "zod";

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Coupon code must be at least 3 characters")
      .max(20, "Coupon code must be at most 20 characters")
      .transform((val) => val.toUpperCase()),

    description: z.string().trim().max(200, "Description too long").optional(),

    discountType: z.enum(["PERCENTAGE", "FLAT"], {
      required_error: "Discount type is required",
    }),

    discountValue: z.number().positive("Discount value must be greater than 0"),

    maxDiscountAmount: z.preprocess(
      (val) => (val === null || val === "" ? undefined : val),
      z.number().positive("Max discount must be positive").optional()
    ),

    minOrderAmount: z
      .number()
      .min(0, "Min order amount cannot be negative")
      .default(0),

    usageLimit: z
      .number()
      .positive("Usage limit must be greater than 0")
      .optional(),

    perUserLimit: z
      .number()
      .min(1, "Per user limit must be at least 1")
      .default(1),

    startDate: z.coerce.date({
      required_error: "Start date is required",
    }),

    expiryDate: z.coerce.date({
      required_error: "Expiry date is required",
    }),

    isActive: z.boolean().default(true),
  })
  .refine((data) => data.expiryDate >= data.startDate, {
    message: "Expiry date must be after start date",
    path: ["expiryDate"],
  })
  .refine(
    (data) => (data.discountType === "FLAT" ? true : data.discountValue <= 100),
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    }
  )
  .refine(
    (data) =>
      data.discountType === "PERCENTAGE"
        ? typeof data.maxDiscountAmount === "number"
        : data.maxDiscountAmount === undefined,
    {
      message: "Max discount amount is required only for percentage coupons",
      path: ["maxDiscountAmount"],
    }
  );
