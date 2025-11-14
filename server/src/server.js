import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.conf.js";
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import passport from "./middlewares/passport.js";
import organizerRouter from "./routes/organizer.router.js";
import adminRouter from "./routes/admin.router.js";
import { connectRedis } from "./config/redis.conf.js";
import s3Router from "./routes/s3.router.js";
import logger from "./config/logger.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

// Database connect
await connectDB();
await connectRedis();

// Logger
// app.use((req, res, next) => {
//   logger.http(`${req.method} ${req.url}`);
//   next();
// });

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://8vqh4xwd-5173.inc1.devtunnels.ms",
    ],
    credentials: true,
  })
);
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/me", userRouter);
app.use("/api/organizer", organizerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/s3", s3Router);

// Server listening
app.listen(PORT, () => {
  logger.info(`server running at http://localhost:${PORT}`);
});
