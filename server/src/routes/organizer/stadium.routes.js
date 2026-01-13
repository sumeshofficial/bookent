import express from "express";
import {
  checkStadiumName,
  createStadiumController,
  deleteStadiumController,
  getStadium,
  getStadiums,
  getStadiumsForOrganizer,
  updateStadiumController,
} from "../../controller/organizer/stadium.controller.js";
const router = express.Router();

router.get("/", getStadiums);
router.get("/or/:organizerId", getStadiumsForOrganizer);
router.get("/check-name", checkStadiumName);
router.get("/:stadiumSlug", getStadium);

router.post("/create", createStadiumController);

router.patch("/:stadiumId", updateStadiumController);
router.patch("/:stadiumId/delete", deleteStadiumController);

export default router;
