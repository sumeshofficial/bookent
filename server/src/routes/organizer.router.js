import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createStadium,
  organizerAccountRegister,
  organizerDashboard,
  getStadiums,
  checkStadiumName
} from "../controller/organizer.controller.js";
const organizerRouter = express.Router();

organizerRouter.get("/:id/dashboard", protect, organizerDashboard);
organizerRouter.get("/stadiums", protect, getStadiums);
organizerRouter.get("/stadium/check-name", protect, checkStadiumName);

organizerRouter.post("/account/register", protect, organizerAccountRegister);
organizerRouter.post("/create-stadium", protect, createStadium);

export default organizerRouter;
