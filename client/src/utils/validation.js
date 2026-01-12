import * as yup from "yup";

export const validationSchema = [
  // Step 1
  yup.object({
    eventTitle: yup
      .string()
      .required("Event title is required")
      .min(10, "Event title must be at least 10 characters long")
      .max(50, "Event title cannot exceed 50 characters"),

    sportType: yup.string().required("Sport type is required"),

    eventDescription: yup
      .string()
      .required("Event description is required")
      .min(50, "Event description must be at least 50 characters long")
      .max(500, "Event description cannot exceed 500 characters"),

    tags: yup
      .array()
      .of(yup.string().max(10, "Each tag cannot exceed 10 characters"))
      .max(5, "You can add up to 5 tags only")
      .required("At least one tag is required")
      .test("unique-tags", "Tags must be unique", (value) => {
        if (!value) return true;
        const uniqueTags = new Set(
          value.map((tag) => tag.toLowerCase().trim())
        );
        return uniqueTags.size === value.length;
      }),
  }),

  // Step 2
  yup.object({
    stadium: yup.string().required("Stadium is required"),

    minPrice: yup
      .number()
      .typeError("Min price must be a number")
      .required("Min price is required")
      .min(1, "Min price must be at least $0.5")
      .max(5000, "Min price is too high"),

    maxPrice: yup
      .number()
      .typeError("Max price must be a number")
      .required("Max price is required")
      .min(1, "Max price must be at least $0.5")
      .max(5000, "Max price is too high")
      .when("minPrice", (minPrice, schema) =>
        schema.test({
          name: "is-greater",
          message: "Max price must be greater than min price",
          test: (maxPrice) => {
            if (!minPrice || !maxPrice) return true;
            return maxPrice > minPrice;
          },
        })
      ),

    ticketSetup: yup
      .array()
      .of(
        yup.object().shape({
          availableTickets: yup
            .number()
            .typeError("Ticket count must be a valid number")
            .required("Ticket count is required")
            .min(1, "Ticket count must be greater than 0")
            .test(
              "capacity-limit",
              "Available tickets cannot exceed capacity",
              function (value) {
                const { totalTickets } = this.parent;

                if (!value || !totalTickets) return true;

                return value <= totalTickets;
              }
            ),
          seatPrice: yup
            .number()
            .typeError("Seat price must be a valid number")
            .required("Seat price is required")
            .min(1, "Seat price must be greater than 0")
            .max(1000, "Seat price is too high"),
          perUserLimit: yup
            .number()
            .typeError("Seats per user must be a valid number")
            .required("Seats per user is required")
            .min(1, "At least one seat per user")
            .max(10, "Max 10 seats per user"),
        })
      )
      .required("Ticket setup is required"),
  }),

  // Step 3
  yup.object({
    matchDate: yup
      .date()
      .typeError("Please enter a valid date")
      .required("Match date is required")
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        "Match date cannot be in the past"
      ),

    matchTime: yup.string().required("Match time is required"),

    gateOpenTime: yup.string().required("Gate open time is required"),

    matchDuration: yup
      .number()
      .typeError("Match duration must be a number")
      .required("Match duration is required")
      .min(30, "Duration must be at least 30 minutes")
      .max(300, "Duration cannot exceed 5 hours"),
  }),

  // Step 4

  yup.object({
    bannerImage: yup.mixed().required("Banner image is required"),
    thumbnailImage: yup.mixed().required("Thumbnail image is required"),
  }),

  // Step 5
  yup.object().shape({
    ageRestriction: yup
      .string()
      .required("Age restriction is required")
      .min(3, "Age restriction must be at least 3 characters long")
      .max(100, "Age restriction cannot exceed 100 characters"),

    termsAndConditions: yup
      .string()
      .required("Terms and conditions are required")
      .min(20, "Terms must be at least 20 characters long")
      .max(1000, "Terms cannot exceed 1000 characters"),

    eventStatus: yup
      .string()
      .required("Event status is required")
      .oneOf(
        [
          "Draft",
          "Published",
          "Postpone",
          "Cancelled",
          "Coming-Soon",
          "Completed",
        ],
        "Invalid event status"
      ),

    newMatchDate: yup.string().when("eventStatus", {
      is: "Postpone",
      then: (schema) =>
        schema.required("New match date is required when postponing the event"),
      otherwise: (schema) => schema.nullable(),
    }),

    postponeReasone: yup.string().when("eventStatus", {
      is: "Postpone",
      then: (schema) =>
        schema
          .required("Reason for postponing is required")
          .min(3, "Reason must be at least 3 characters"),
      otherwise: (schema) => schema.nullable(),
    }),

    cancelledReasone: yup.string().when("eventStatus", {
      is: "Cancelled",
      then: (schema) =>
        schema
          .required("Reason for cancellation is required")
          .min(3, "Reason must be at least 3 characters"),
      otherwise: (schema) => schema.nullable(),
    }),

    matchDate: yup.string().when("eventStatus", {
      is: "Coming-Soon",
      then: (schema) => schema.nullable(),
      otherwise: (schema) => schema.required("Match date is required"),
    }),
  }),
];

export const createStadiumValidationSchema = yup.object({
  stadiumName: yup
    .string()
    .required("Stadium name is required")
    .min(10, "Stadium name must be at least 10 characters long")
    .max(100, "Stadium name cannot exceed 100 characters"),

  address: yup
    .string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters long")
    .max(250, "Address cannot exceed 250 characters"),

  city: yup.string().required("City is required"),

  state: yup.string().required("State is required"),

  pincode: yup.string().required("Pincode is required"),

  location: yup
    .string()
    .required("Google Map location URL is required")
    .url("Enter a valid URL")
    .matches(
      /^(https?:\/\/)?(www\.)?(google\.com\/maps|maps\.app\.goo\.gl)\/.+$/,
      "Enter a valid Google Maps URL"
    ),
});
