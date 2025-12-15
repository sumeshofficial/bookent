import mongoose from "mongoose";
import User from "../../models/user.model.js";
import { ENV } from "../../config/env.conf.js";

const run = async () => {
  await mongoose.connect(ENV.MONGODB_ATLAS_URI);

  const res = await User.updateMany(
    { wallet: { $exists: false } },
    { $set: { wallet: 0 } }
  );

  console.log("Updated users:", res.modifiedCount);
  process.exit(0);
};

run();
