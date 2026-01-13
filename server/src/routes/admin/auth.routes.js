import express from "express";
import { protect } from "../../middlewares/common/auth.middleware.js";
import {
  adminLogin,
  logoutAdmin,
  refreshAccessTokenForAdmin,
} from "../../controller/admin/auth.controller.js";
import { getUserController } from "../../controller/user/account.controller.js";
const router = express.Router();

router.get("/", protect, getUserController);

router.post("/login", adminLogin);
router.post("/refresh-token", refreshAccessTokenForAdmin);
router.post("/logout", logoutAdmin);

export default router;
