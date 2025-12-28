import mongoose from "mongoose";
import { ENV } from "../../config/env.conf.js";
import Order from "../../models/order.model.js";
import { ulid } from "ulid";

const generatePublicOrderId = () => {
  const year = new Date().getFullYear();
  return `BK-${year}-${ulid()}`;
};

const run = async () => {
  await mongoose.connect(ENV.MONGODB_ATLAS_URI);

  const orders = await Order.find({
    orderId: { $exists: false },
  }).select("_id");

  if (!orders.length) {
    console.log("No orders found without orderId");
    process.exit(0);
  }

  const bulkOps = orders.map((order) => ({
    updateOne: {
      filter: { _id: order._id },
      update: {
        $set: {
          orderId: generatePublicOrderId(),
        },
      },
    },
  }));

  await Order.bulkWrite(bulkOps);

  console.log(`Updated ${orders.length} order documents with public orderId`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
