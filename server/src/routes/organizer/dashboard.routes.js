import express from "express";
import {
  getDashboardController,
  organizerDashboard,
} from "../../controller/organizer/dashboard.controller.js";
const router = express.Router();

router.get("/stats", getDashboardController);
router.get("/:id", organizerDashboard);

export default router;
