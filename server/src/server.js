import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.conf.js";
import userRoutes from "./routes/user/user.routes.js";
import paypalRoutes from "./routes/paypal.routes.js";
import passport from "./middlewares/user/passport.js";
import organizerRoutes from "./routes/organizer/organizer.routes.js";
import adminRoutes from "./routes/admin/admin.routes.js";
import { connectRedis, redisClient } from "./config/redis.conf.js";
import s3Router from "./routes/s3.router.js";
import logger from "./config/logger.js";
import { errorHandler } from "./middlewares/common/error.handler.js";
import { initSocket } from "./config/socket.conf.js";
import http from "http";
import { initRedisExpiryListener } from "./config/redisExpiry.conf.js";
import { initSeatPubSub } from "./config/seatPubSub.conf.js";
import { ENV } from "./config/env.conf.js";
import { initCronJobs } from "./jobs/index.job.js";
import helmet from "helmet";
import { helmetConfig } from "./config/security/helmet.config.js";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
dotenv.config();

const app = express();

const PORT = ENV.PORT;
const server = http.createServer(app);

// Database connect
await connectDB();
await connectRedis();

initSocket(server);

await initRedisExpiryListener();
await initSeatPubSub();

// Logger
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

const globalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(globalLimiter);
app.use(helmet(helmetConfig(ENV)));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [ENV.FRONTEND_URL],
    credentials: true,
  })
);
app.use(passport.initialize());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/organizer", organizerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/s3", s3Router);
app.use("/api/v1/paypal", paypalRoutes);

app.use(errorHandler);

initCronJobs();

// Server listening
server.listen(PORT, () => {
  logger.info(`server running at http://localhost:${PORT}`);
});
