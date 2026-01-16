import express from "express";
import {
  cancelEventController,
  deleteEventController,
  editEventController,
  finishEventCreateController,
  finishEventEditController,
  getEventController,
  getEventsController,
  validateEventCreateController,
} from "../../controller/organizer/event.controller.js";
import { getBookingsController } from "../../controller/user/event.controller.js";
import { validate } from "../../middlewares/common/validate.middleware.js";
import { eventSchema } from "../../validation/event.validation.js";
const router = express.Router();

router.get("/", getEventsController);
router.get("/:eventSlug", getEventController);
router.get("/:eventSlug/bookings", getBookingsController);

router.post(
  "/create/validate",
  validate(eventSchema),
  validateEventCreateController
);
router.post("/create/finish", finishEventCreateController);
router.post("/edit/finish", finishEventEditController);

router.patch("/:eventSlug/edit", editEventController);
router.patch("/:eventSlug/cancel", cancelEventController);

router.delete("/:eventId", deleteEventController);

export default router;
