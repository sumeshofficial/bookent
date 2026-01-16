import { z } from "zod";

export const eventSchema = z.object({
  eventTitle: z.string().nonempty("Event title is required"),

  sportType: z.string().nonempty("Sport type is required"),

  eventDescription: z.string().nonempty("Event description is required"),

  tags: z.array(z.string()).nonempty("At least one tag is required"),

  stadium: z.string().nonempty("Stadium is required"),

  minPrice: z.coerce.number({
    required_error: "Min price is required",
    invalid_type_error: "Min price must be a number",
  }),

  maxPrice: z.coerce.number({
    required_error: "Max price is required",
    invalid_type_error: "Max price must be a number",
  }),

  matchDate: z.coerce.date({
    required_error: "Match date is required",
    invalid_type_error: "Match date must be a valid date",
  }),

  matchTime: z.string().nonempty("Match time is required"),

  gateOpenTime: z.string().nonempty("Gate open time is required"),

  matchDuration: z.coerce.number({
    required_error: "Match duration is required",
    invalid_type_error: "Match duration must be a number",
  }),

  ageRestriction: z.string().nonempty("Age restriction is required"),

  termsAndConditions: z.string().nonempty("Terms and conditions are required"),

  eventStatus: z.string().nonempty("Event status is required"),
});
