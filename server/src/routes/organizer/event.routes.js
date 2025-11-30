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
const router = express.Router();

router.get("/", getEventsController);
router.get("/:eventId", getEventController);

router.post("/create/validate", validateEventCreateController);
router.post("/create/finish", finishEventCreateController);
router.post("/edit/finish", finishEventEditController);

router.patch("/:eventId/edit", editEventController);
router.patch("/delete", deleteEventController);

export default router;
