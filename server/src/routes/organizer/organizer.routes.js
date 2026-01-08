import express from "express";
import dashboardRoutes from "./dashboard.routes.js";
import authRoutes from "./auth.routes.js";
import accountRoutes from "./account.routes.js";
import eventRoutes from "./event.routes.js";
import stadiumRoutes from "./stadium.routes.js";
import ticketRoutes from "./ticket.routes.js";
import salesRoutes from "./sales.routes.js";
import { protect } from "../../middlewares/common/auth.middleware.js";

const organizerRouter = express.Router();

organizerRouter.use("/", protect, dashboardRoutes);
organizerRouter.use("/auth", protect, authRoutes);
organizerRouter.use("/account", protect, accountRoutes);
organizerRouter.use("/events", protect, eventRoutes);
organizerRouter.use("/stadiums", protect, stadiumRoutes);
organizerRouter.use("/ticket", protect, ticketRoutes);
organizerRouter.use("/sales", protect, salesRoutes);

export default organizerRouter;
