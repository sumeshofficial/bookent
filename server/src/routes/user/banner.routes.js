import express from "express";
import { getBannersController } from "../../controller/user/banner.controller.js";
const router = express.Router();

router.get("/", getBannersController);

export default router;
