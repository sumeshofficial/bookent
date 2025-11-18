import * as yup from "yup";

// Event validation schema
export const eventSchema = yup.object({
  eventTitle: yup.string().required("Event title is required"),

  sportType: yup.string().required("Sport type is required"),

  eventDescription: yup.string().required("Event description is required"),

  tags: yup.array().required("At least one tag is required"),

  stadium: yup.string().required("Stadium is required"),

  minPrice: yup.number().required("Min price is required"),

  maxPrice: yup.number().required("Max price is required"),

  ticketSetup: yup.array().required("Ticket setup is required"),

  matchDate: yup.date().required("Match date is required"),

  matchTime: yup.string().required("Match time is required"),

  gateOpenTime: yup.string().required("Gate open time is required"),

  matchDuration: yup.number().required("Match duration is required"),

  ageRestriction: yup.string().required("Age restriction is required"),

  refundPolicy: yup.string().required("Refund policy is required"),

  termsAndConditions: yup
    .string()
    .required("Terms and conditions are required"),

  eventStatus: yup.string().required("Event status is required"),
});
