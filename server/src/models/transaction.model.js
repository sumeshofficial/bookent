import mongoose from "mongoose";
import {
  CURRENCY_CODE,
  MONGO_SCHEMA,
  PAYMENT_METHOD,
  TRANSACTION_DIRECTION,
  TRANSACTION_REASON,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../utility/constants/constants.js";

const transactionSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MONGO_SCHEMA.ORDER,
      required: false,
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: [PAYMENT_METHOD.PAYPAL, PAYMENT_METHOD.WALLET],
      required: true,
    },

    paypal_capture_id: {
      type: String,
      unique: true,
      sparse: true,
    },

    type: {
      type: String,
      enum: [
        TRANSACTION_TYPE.SALE,
        TRANSACTION_TYPE.REFUND,
        TRANSACTION_TYPE.TRANSFER,
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        TRANSACTION_STATUS.COMPLETED,
        TRANSACTION_STATUS.PENDING,
        TRANSACTION_STATUS.FAILED,
      ],
      required: true,
    },

    transaction_direction: {
      type: String,
      enum: [TRANSACTION_DIRECTION.CREDIT, TRANSACTION_DIRECTION.DEBIT],
      required: true,
    },

    amount: {
      value: { type: Number, required: true },
      currency: { type: String, default: CURRENCY_CODE.USD },
    },

    transaction_fees: {
      value: { type: Number, default: 0 },
    },

    net_amount: {
      value: { type: Number, required: true },
      currency: { type: String, default: CURRENCY_CODE.USD },
    },

    receiver_model: {
      type: String,
      enum: [MONGO_SCHEMA.USER, MONGO_SCHEMA.ORGANIZER],
      default: null,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "receiver_model",
      default: null,
    },

    initiated_by_model: {
      type: String,
      enum: [MONGO_SCHEMA.USER, MONGO_SCHEMA.ORGANIZER],
      default: MONGO_SCHEMA.USER,
    },

    initiated_by: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "initiated_by_model",
      required: true,
    },

    reason: {
      type: String,
      enum: [
        TRANSACTION_REASON.BOOKING_PAYMENT,
        TRANSACTION_REASON.WALLET_REFUND,
        TRANSACTION_REASON.ORGANIZER_PAYOUT,
        TRANSACTION_REASON.ADMIN_ADJUSTMENT,
        TRANSACTION_REASON.WALLET_TOPUP,
      ],
      required: true,
    },

    processor_response: {
      type: Object,
      default: {},
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

transactionSchema.index({ "metadata.eventId": 1 });

const Transaction = mongoose.model(MONGO_SCHEMA.TRANACTION, transactionSchema);

export default Transaction;
