import mongoose from "mongoose";
import logger from "./logger.js";
import dotenv from "dotenv";
import { DB_EVENTS } from "../utility/constants/constants.js";
import { ENV } from "./env.conf.js";
dotenv.config();

// Database configuration
const connectDB = async () => {
  try {
    mongoose.connection.on(DB_EVENTS.CONNECTED, () =>
      logger.info("Database Connected")
    );
    await mongoose.connect(ENV.MONGODB_ATLAS_URI);
  } catch (error) {
    logger.error(error.message);
  }
};

export default connectDB;
