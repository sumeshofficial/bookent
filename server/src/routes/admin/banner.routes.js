import express from "express";
import {
  createBannerController,
  deleteBannerController,
  getBannerController,
  updateBannerController,
} from "../../controller/admin/banner.controller.js";

const router = express.Router();

router.get("/", getBannerController);
router.post("/", createBannerController);
router.patch("/", updateBannerController);
router.delete("/", deleteBannerController);

export default router;
