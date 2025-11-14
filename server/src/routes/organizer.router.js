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
} from "../controller/organizer.controller.js";
const organizerRouter = express.Router();

organizerRouter.get("/:id/dashboard", protect, organizerDashboard);
organizerRouter.get("/stadiums", protect, getStadiums);
organizerRouter.get("/stadium/check-name", protect, checkStadiumName);
organizerRouter.get("/:id/events", protect, getEvents);

organizerRouter.post("/account/register", protect, organizerAccountRegister);
organizerRouter.post("/stadium/create", protect, createStadium);
organizerRouter.post("/event/create/validate", protect, validateEventCreate);
organizerRouter.post("/event/create/finish", protect, finishEventCreate);

export default organizerRouter;
