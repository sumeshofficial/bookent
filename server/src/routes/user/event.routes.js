import express from "express";
import {
  filterAndSortEventsController,
  getHomeEventSectionsController,
  getSingleEventController,
  searchEventController,
} from "../../controller/user/event.controller.js";
const router = express.Router();

router.get("/", filterAndSortEventsController);
router.get("/search", searchEventController);
router.get("/home", getHomeEventSectionsController);
router.get("/:eventId", getSingleEventController);

export default router;
