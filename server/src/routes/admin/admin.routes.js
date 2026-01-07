import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import walletRoutes from "./wallet.routes.js";
import organizerRoutes from "./organizer.routes.js";
import couponRoutes from "./coupon.routes.js";
import eventRoutes from "./event.routes.js";
import bannersRoutes from "./banners.routes.js";
import salesRoutes from "./sales.routes.js";
import { adminOnly } from "../../middlewares/admin/admin.middleware.js";
import { protect } from "../../middlewares/common/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.use("/auth", authRoutes);
adminRouter.use("/users", protect, adminOnly, userRoutes);
adminRouter.use("/organizers", protect, adminOnly, organizerRoutes);
adminRouter.use("/wallet", protect, adminOnly, walletRoutes);
adminRouter.use("/coupons", protect, adminOnly, couponRoutes);
adminRouter.use("/events", protect, adminOnly, eventRoutes);
adminRouter.use("/banners", protect, adminOnly, bannersRoutes);
adminRouter.use("/sales", protect, adminOnly, salesRoutes);

export default adminRouter;
