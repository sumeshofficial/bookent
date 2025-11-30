import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import organizerRoutes from "./organizer.routes.js";
import { adminOnly } from "../../middlewares/admin/admin.middleware.js";
import { protect } from "../../middlewares/common/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.use("/auth", authRoutes);
adminRouter.use("/users", protect, adminOnly, userRoutes);
adminRouter.use("/organizers", protect, adminOnly, organizerRoutes);

export default adminRouter;
