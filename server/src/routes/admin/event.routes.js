import express from "express";

const router = express.Router();

router.get("/", getAllEventsController);

export default router;
