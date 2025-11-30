import express from "express";
import {
  checkStadiumName,
  createStadium,
  deleteStadium,
  getStadium,
  getStadiums,
  getStadiumsForOrganizer,
  updateStadium,
} from "../../controller/organizer/stadium.controller.js";
const router = express.Router();

router.get("/", getStadiums);
router.get("/or/:organizerId", getStadiumsForOrganizer);
router.get("/check-name", checkStadiumName);
router.get("/:stadiumId", getStadium);

router.post("/create", createStadium);

router.patch("/:stadiumId", updateStadium);
router.patch("/:stadiumId/delete", deleteStadium);

export default router;
