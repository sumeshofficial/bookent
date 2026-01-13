import express from "express";
import { getAdminDashboardController } from "../../controller/admin/dashboard.controller.js";

const router = express.Router();

router.get("/", getAdminDashboardController);

export default router;
