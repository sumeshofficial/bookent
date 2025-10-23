import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { updateUser } from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.patch("/", protect, updateUser);

export default userRouter;
