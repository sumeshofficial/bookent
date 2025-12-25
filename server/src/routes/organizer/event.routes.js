import express from "express";
import {
  deleteEventController,
  editEventController,
  finishEventCreateController,
  finishEventEditController,
  getEventController,
  getEventsController,
  validateEventCreateController,
} from "../../controller/organizer/event.controller.js";
import { getBookingsController } from "../../controller/user/event.controller.js";
const router = express.Router();

router.get("/", getEventsController);
router.get("/:eventSlug", getEventController);
router.get("/:eventSlug/bookings", getBookingsController);

router.post("/create/validate", validateEventCreateController);
router.post("/create/finish", finishEventCreateController);
router.post("/edit/finish", finishEventEditController);

router.patch("/:eventSlug/edit", editEventController);
router.patch("/delete", deleteEventController);

export default router;
