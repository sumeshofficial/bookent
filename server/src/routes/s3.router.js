import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { uploadFiles } from "../controller/s3.controller.js";

const s3Router = express.Router();

s3Router.get("/get-upload-signed-url", protect, uploadFiles);

export default s3Router;
