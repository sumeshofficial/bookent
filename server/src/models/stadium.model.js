import mongoose from "mongoose";

const shapeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["rect", "circle", "image", "arc"],
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
    innerRadius: {
      type: Number,
      required: false,
    },
    outerRadius: {
      type: Number,
      required: false,
    },
    innerRadiusX: {
      type: Number,
      required: false,
    },
    innerRadiusY: {
      type: Number,
      required: false,
    },
    outerRadiusX: {
      type: Number,
      required: false,
    },
    outerRadiusY: {
      type: Number,
      required: false,
    },
    angle: {
      type: Number,
      required: false,
    },
    radius: {
      type: Number,
      required: false,
    },
    rotation: {
      type: Number,
      default: 0,
    },
    offsetX: {
      type: Number,
      default: 0,
    },
    offsetY: {
      type: Number,
      default: 0,
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
    capacity: {
      type: Number,
    },
  },
  {
    _id: false,
  }
);

const stadiumSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
      stateCode: {
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Stadium = mongoose.model("Stadium", stadiumSchema, "stadiums");
export default Stadium;
