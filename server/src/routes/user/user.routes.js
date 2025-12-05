import express from "express";
import authRoutes from "./auth.routes.js";
import accountRoutes from "./account.routes.js";
import eventRoutes from "./event.routes.js";
import checkoutRoutes from "./checkout.routes.js";
import { protect } from "../../middlewares/common/auth.middleware.js";

const userRouter = express.Router();

userRouter.use("/auth", authRoutes);
userRouter.use("/account", protect, accountRoutes);
userRouter.use("/events", protect, eventRoutes);
userRouter.use("/checkout", protect, checkoutRoutes);

export default userRouter;
