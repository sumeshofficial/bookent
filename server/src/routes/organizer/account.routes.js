import express from "express";
import { updateOrganizerProfile } from "../../controller/organizer/account.controller.js";
const router = express.Router();

router.patch("/update-profile", updateOrganizerProfile);

export default router;
