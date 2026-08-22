import { Router } from "express";

import {
  getProfile,
  updateProfile,
  deleteAccount,
} from "../controllers/user.controllers.js";

import { protect } from "../middleware/auth.js";

const router = Router();

// All user routes require authentication
router.use(protect);

router.get("/profile", getProfile);

router.patch("/profile", updateProfile);

router.delete("/account", deleteAccount);

export default router;