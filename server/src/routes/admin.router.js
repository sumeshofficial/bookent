import express from "express";
import { adminLogin, getUser, logoutAdmin, refreshAccessTokenForAdmin } from "../controller/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { getOrganizers, getUserDetails, getUsers, updateStatus,  approveOrganizerRequest, rejectOrganizerRequest, getOrganizersDetails } from "../controller/admin.controller.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const adminRouter = express.Router();

adminRouter.get("/", protect, getUser);
adminRouter.get("/users", protect, adminOnly, getUsers);
adminRouter.get("/organizers", protect, adminOnly, getOrganizers);

adminRouter.patch("/users/:id/:status", protect, adminOnly, updateStatus);
adminRouter.patch("/organizers/:id/approve", protect, adminOnly, approveOrganizerRequest);
adminRouter.patch("/organizers/:id/reject", protect, adminOnly, rejectOrganizerRequest);
adminRouter.get("/users/:id", protect, adminOnly, getUserDetails);
adminRouter.get("/organizers/:id", protect, adminOnly, getOrganizersDetails);

adminRouter.post("/login", adminLogin);
adminRouter.post('/refresh-token', refreshAccessTokenForAdmin);
adminRouter.post("/logout", logoutAdmin);

export default adminRouter;