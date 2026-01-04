import mongoose from "mongoose";
import { ENV } from "../../config/env.conf.js";
import Order from "../../models/order.model.js";
import { REFUND_STATUS } from "../../utility/constants/constants.js";

const run = async () => {
  await mongoose.connect(ENV.MONGODB_ATLAS_URI);

  const orders = await Order.find({
    $or: [
      { orderId: { $exists: false } },
      { refundStatus: { $exists: false } },
    ],
  }).select("_id");

  if (!orders.length) {
    console.log("No orders found missing refund fields");
    process.exit(0);
  }

  const bulkOps = orders.map((order) => ({
    updateOne: {
      filter: { _id: order._id },
      update: {
        $set: {
          refundStatus: REFUND_STATUS.NOT_REQUIRED,
          refundReason: null,
        },
      },
    },
  }));

  await Order.bulkWrite(bulkOps);

  console.log(`Updated ${orders.length} order documents with refund defaults`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
