import express from "express";
import { organizerDashboard } from "../../controller/organizer/dashboard.controller.js";
const router = express.Router();

router.get("/:id/dashboard", organizerDashboard);

export default router;
