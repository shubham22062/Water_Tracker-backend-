import { Router } from "express";

import {
  addIntake,
  getTodayIntake,
  getIntakeHistory,
  updateIntake,
  deleteIntake,
  getDailySummary,
} from "../controllers/intake.controllers.js";

import { protect } from "../middleware/auth.js";

const router = Router();

// All intake routes require authentication
router.use(protect);

router.post("/", addIntake);

router.get("/today", getTodayIntake);

router.get("/history", getIntakeHistory);

router.get("/summary", getDailySummary);

router.patch("/:id", updateIntake);

router.delete("/:id", deleteIntake);

export default router;