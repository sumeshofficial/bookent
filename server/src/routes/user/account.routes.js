import express from "express";
import {
  getUserController,
  updateUserController,
} from "../../controller/user/account.controller.js";
const router = express.Router();

router.get("/getUser", getUserController);

router.patch("/", updateUserController);

export default router;
