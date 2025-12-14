import mongoose from "mongoose";
import {
  CURRENCY_CODE,
  MONGO_SCHEMA,
  ORDER_STATUS,
  PAYMENT_METHOD,
  REFUND_STATUS,
} from "../utility/constants/constants.js";

const refundSchema = new mongoose.Schema(
  {
    refund_id: { type: String, required: true },
    status: {
      type: String,
      enum: [
        REFUND_STATUS.COMPLETED,
        REFUND_STATUS.PENDING,
        REFUND_STATUS.FAILED,
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    reason: { type: String, default: null },
    refunded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MONGO_SCHEMA.USER,
      required: true,
    },
    refundedAt: { type: Date, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MONGO_SCHEMA.USER,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        ORDER_STATUS.PENDING_PAYPAL_ORDER,
        ORDER_STATUS.PAID,
        ORDER_STATUS.CONFIRMED,
        ORDER_STATUS.REFUNDED,
        ORDER_STATUS.ABANDONED,
      ],
    },
    lockId: { type: String, default: null },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MONGO_SCHEMA.EVENT,
      required: true,
    },
    eventDetails: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      title: { type: String, required: true },
      date: { type: Date, required: true },
      time: { type: String, required: true },
      venue: { type: String, required: true },
      slug: { type: String, required: true },
      stadiumName: { type: String, required: true },
      thumbnailImage: { type: String, required: true },
    },
    seat: {
      sectionId: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true },
    },
    total_amount: {
      value: { type: Number, required: true },
      currency: { type: String, default: CURRENCY_CODE.USD },
    },
    pricingBreakDown: {
      ticketPrice: Number,
      orderAmount: Number,
      baseFee: Number,
      gst: Number,
      bookingFee: Number,
      grandTotal: Number,
    },
    qrData: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: [PAYMENT_METHOD.PAYPAL, PAYMENT_METHOD.WALLET],
      required: true,
    },
    paypalOrderId: {
      type: String,
      required: function () {
        return this.paymentMethod === PAYMENT_METHOD.PAYPAL;
      },
    },
    transactionId: {
      type: mongoose.Schema.ObjectId,
      ref: MONGO_SCHEMA.TRANACTION,
    },
    refundHistory: [refundSchema],
    meta: {
      isReservationRestored: {
        type: Boolean,
        default: false,
      },
      isReservationExtended: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model(MONGO_SCHEMA.ORDER, orderSchema);

export default Order;
