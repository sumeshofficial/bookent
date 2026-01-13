import express from "express";
import {
  getUserDetailsController,
  getUsersController,
  updateStatusController,
} from "../../controller/admin/user.controller.js";
const router = express.Router();

router.get("/", getUsersController);
router.get("/:userId", getUserDetailsController);

router.patch("/:userId/status", updateStatusController);

export default router;
