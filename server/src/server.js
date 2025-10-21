import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.conf.js";
import authRouter from "./routes/auth.router.js";
import passport from "./middlewares/passport.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

// Database connect
await connectDB();

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

// Server listening
app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});