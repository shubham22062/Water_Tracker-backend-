import { Router } from "express";

import {
  register,
  login,
  getMe,
} from "../controllers/auth.controllers.js";

import { protect } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", protect, getMe);

export default router;