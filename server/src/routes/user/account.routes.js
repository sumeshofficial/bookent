import express from "express";
import {
  getUserController,
  updateUserController,
  updateUserPasswordController,
} from "../../controller/user/account.controller.js";
const router = express.Router();

router.get("/getUser", getUserController);

router.patch("/", updateUserController);
router.patch("/change/password", updateUserPasswordController);

export default router;
