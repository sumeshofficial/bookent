import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
      max: 99999,
    },
    seatPrice: {
      type: Number,
      required: true,
      min: 1,
      max: 100000,
    },
    perUserLimit: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    eventTitle: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 50,
    },
    sportType: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 500,
    },
    tags: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "Maximum 5 tags allowed",
      },
    },
    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stadium",
      required: true,
    },
    minPrice: {
      type: Number,
      required: true,
      min: 1,
    },

    maxPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    ticketSetup: {
      type: [ticketSchema],
      required: true,
    },
    totalTickets: {
      type: Number,
      required: true,
    },
    availableTickets: {
      type: Number,
      required: true,
    },
    soldTickets: {
      type: Number,
      default: 0,
    },
    matchDate: {
      type: Date,
      required: true,
    },
    matchTime: {
      type: String,
      required: true,
    },
    gateOpenTime: {
      type: String,
      required: true,
    },
    matchDuration: {
      type: Number,
      required: true,
      min: 30,
      max: 300,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    thumbnailImage: {
      type: String,
      required: true,
    },
    ageRestriction: {
      type: String,
      required: true,
    },
    isRefundAvailable: {
      type: Boolean,
      default: false,
    },
    refundPolicy: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 300,
    },
    termsAndConditions: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 1000,
    },
    eventStatus: {
      type: String,
      enum: ["Draft", "Published"],
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
