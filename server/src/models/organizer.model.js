import mongoose from "mongoose";

const bankAccountDetailsSchema = new mongoose.Schema(
  {
    beneficiaryName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountType: { type: String, enum: ["Savings", "Current"] },
    ifsc: { type: String },
    bankName: { type: String },
  },
  { _id: false }
);

const organizationDetailsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    state: { type: String },
  },
  { _id: false }
);

const organizerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    organizationDetails: organizationDetailsSchema,
    bankAccountDetails: bankAccountDetailsSchema,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Organizer = mongoose.model("Organizer", organizerSchema);
export default Organizer;
