import express from "express";
import {
  createBannerController,
  deleteBannerController,
  getBannersController,
  updateBannerController,
} from "../../controller/admin/banner.controller.js";
import { validate } from "../../middlewares/common/validate.middleware.js";
import { bannerSchema } from "../../validation/banner.validation.js";

const router = express.Router();

router.get("/", getBannersController);
router.post("/", validate(bannerSchema), createBannerController);
router.patch("/:bannerId", updateBannerController);
router.delete("/:bannerId", deleteBannerController);

export default router;
