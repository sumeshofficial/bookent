import mongoose from "mongoose";

const shapeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["rect", "circle", "image"],
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
    radius: {
      type: Number,
      required: false,
    },
    fillColor: {
      type: String,
    },
    fillOpacity: {
      type: Number,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
    },
    title: {
      type: String,
    },
    imageKey: {
      type: String,
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const stadiumSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stadiumDetails: {
      stadiumName: {
        type: String,
        required: true,
        unique: true,
      },
      capacity: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
    },
    shapes: {
      type: [shapeSchema],
      default: [],
    },
    layoutImageKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Stadium = mongoose.model("Stadium", stadiumSchema, "stadiums");
export default Stadium;
