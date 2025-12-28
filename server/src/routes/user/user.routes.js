import express from "express";
import authRoutes from "./auth.routes.js";
import accountRoutes from "./account.routes.js";
import eventRoutes from "./event.routes.js";
import checkoutRoutes from "./checkout.routes.js";
import ticketRoutes from "./tickets.routes.js";
import couponRoutes from "./coupon.routes.js";
import walletRoutes from "./wallet.routes.js";
import { protect } from "../../middlewares/common/auth.middleware.js";

const userRouter = express.Router();

userRouter.use("/auth", authRoutes);
userRouter.use("/account", protect, accountRoutes);
userRouter.use("/events", protect, eventRoutes);
userRouter.use("/checkout", protect, checkoutRoutes);
userRouter.use("/tickets", protect, ticketRoutes);
userRouter.use("/coupons", protect, couponRoutes);
userRouter.use("/wallet", protect, walletRoutes);

export default userRouter;
