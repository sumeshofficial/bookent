import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getFiles, uploadFiles } from "../controller/s3.controller.js";

const s3Router = express.Router();

s3Router.get("/get-upload-signed-url", protect, uploadFiles);
s3Router.get("/get-image-signed-url", protect, getFiles);

export default s3Router;
