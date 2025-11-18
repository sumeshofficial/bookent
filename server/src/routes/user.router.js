import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  updateUser,
  getHomeEventSections,
  filterAndSortEvents,
  searchEvent,
  getSingleEvent,
} from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.get("/home", protect, getHomeEventSections);
userRouter.get("/events", protect, filterAndSortEvents);
userRouter.get("/event/search", protect, searchEvent);
userRouter.get("/event/:eventId", protect, getSingleEvent);

userRouter.patch("/", protect, updateUser);

export default userRouter;
