import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createStadium,
  organizerAccountRegister,
  organizerDashboard,
  getStadiums,
  checkStadiumName,
  validateEventCreate,
  finishEventCreate,
  getEvents,
  getEvent,
  editEvent,
  finishEventEdit,
  deleteEvent,
  updateOrganizerProfile,
} from "../controller/organizer.controller.js";
const organizerRouter = express.Router();

organizerRouter.get("/:id/dashboard", protect, organizerDashboard);
organizerRouter.get("/stadiums", protect, getStadiums);
organizerRouter.get("/stadium/check-name", protect, checkStadiumName);
organizerRouter.get("/:id/events", protect, getEvents);
organizerRouter.get("/:organizerId/event/:eventId", protect, getEvent);

organizerRouter.post("/account/register", protect, organizerAccountRegister);
organizerRouter.post("/stadium/create", protect, createStadium);
organizerRouter.post("/event/create/validate", protect, validateEventCreate);
organizerRouter.post("/event/create/finish", protect, finishEventCreate);
organizerRouter.post("/event/edit/finish", protect, finishEventEdit);

organizerRouter.patch("/event/:eventId/edit", protect, editEvent);
organizerRouter.patch("/event/delete", protect, deleteEvent);
organizerRouter.patch("/profile", protect, updateOrganizerProfile);

export default organizerRouter;
