import express from "express";
import {
  getAllEventsController,
  getEventController,
} from "../../controller/admin/event.controller.js";

const router = express.Router();

router.get("/", getAllEventsController);
router.get("/:eventSlug", getEventController);

export default router;
