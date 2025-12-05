import mongoose from "mongoose";
import logger from "./logger.js";
import dotenv from "dotenv";
import { DB_EVENTS } from "../utility/constants.js";
dotenv.config();

// Database configuration
const connectDB = async () => {
  try {
    mongoose.connection.on(DB_EVENTS.CONNECTED, () =>
      logger.info("Database Connected")
    );
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    // await mongoose.connect(`${process.env.MONGODB_URI}bookent`);
  } catch (error) {
    logger.error(error.message);
  }
};

export default connectDB;
