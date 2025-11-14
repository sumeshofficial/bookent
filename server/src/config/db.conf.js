import mongoose from "mongoose";
import logger from "./logger.js";
import dotenv from "dotenv";
dotenv.config();

// Database configuration
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      logger.info("Database Connected")
    );
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    // await mongoose.connect(`${process.env.MONGODB_URI}bookent`);
  } catch (error) {
    logger.error(error.message);
  }
};

export default connectDB;
