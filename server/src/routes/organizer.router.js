import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { organizarAccountRegister, organizarDashboard } from "../controller/organizer.controller.js";
const organizerRouter = express.Router();

organizerRouter.get('/:id/dashboard', protect, organizarDashboard);

organizerRouter.post('/account/register', protect, organizarAccountRegister);

export default organizerRouter;