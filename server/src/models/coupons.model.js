import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: null,
    },

    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    maxDiscountAmount: {
      type: Number,
      default: null,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    usageLimit: {
      type: Number,
      default: null,
    },

    perUserLimit: {
      type: Number,
      default: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

couponSchema.index({ expiryDate: 1, isActive: 1 });

couponSchema.virtual("isExpired").get(function () {
  return this.expiryDate < new Date();
});

couponSchema.methods.canUseCoupon = function () {
  if (!this.isActive) {
    return false;
  }
  if (this.expiryDate < new Date()) {
    return false;
  }
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return false;
  }
  return true;
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
