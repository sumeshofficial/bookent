import express from "express";
import {
  getOrganizersController,
  getOrganizersDetailsController,
  handleOrganizerRequestController,
} from "../../controller/admin/organizer.controller.js";
const router = express.Router();

router.get("/", getOrganizersController);
router.get("/:id", getOrganizersDetailsController);

router.patch("/:id", handleOrganizerRequestController);

export default router;
