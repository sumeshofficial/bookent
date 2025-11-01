import express from "express";
import { adminLogin, getUser, logoutAdmin, refreshAccessTokenForAdmin } from "../controller/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { getOrganizers, getUserDetails, getUsers, updateStatus, handleOrganizerRequest, getOrganizersDetails } from "../controller/admin.controller.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const adminRouter = express.Router();

adminRouter.get("/", protect, getUser);
adminRouter.get("/users", protect, adminOnly, getUsers);
adminRouter.get("/organizers", protect, adminOnly, getOrganizers);

adminRouter.patch("/users/:id/:status", protect, adminOnly, updateStatus);
adminRouter.patch("/organizers/:id/:status", protect, adminOnly, handleOrganizerRequest);
adminRouter.get("/users/:id", protect, adminOnly, getUserDetails);
adminRouter.get("/organizers/:id", protect, adminOnly, getOrganizersDetails);

adminRouter.post("/login", adminLogin);
adminRouter.post('/refresh-token', refreshAccessTokenForAdmin);
adminRouter.post("/logout", logoutAdmin);

export default adminRouter;