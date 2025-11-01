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
import morgan from "morgan";
import { connectRedis } from "./config/redis.conf.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

// Database connect
await connectDB();
await connectRedis();

// Logger
app.use(morgan("dev"));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(passport.initialize());

// auth route
app.use("/api/auth", authRouter);

// user route
app.use("/api/me", userRouter);

// organizar route
app.use("/api/organizer", organizerRouter);

// admin route
app.use("/api/admin", adminRouter);

// Server listening
app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
