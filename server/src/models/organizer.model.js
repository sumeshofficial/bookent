import mongoose from "mongoose";

const bankAccountDetailsSchema = new mongoose.Schema(
  {
    beneficiaryName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountType: { type: String, enum: ["Savings", "Current"] },
    ifsc: { type: String },
    bankName: { type: String },
  },
  { _id: false, versionKey: false }
);

const organizationDetailsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    state: { type: String },
  },
  { _id: false, versionKey: false }
);

const organizerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullname: String,
    email: String,
    profileImage: String,
    organizationDetails: organizationDetailsSchema,
    bankAccountDetails: bankAccountDetailsSchema,
    isVerified: {
      type: Boolean,
      default: false,
    },
    rejectReason: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Organizer = mongoose.model("Organizer", organizerSchema);
export default Organizer;
