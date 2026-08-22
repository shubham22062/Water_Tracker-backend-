import { Router } from "express";

import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/auth.controllers.js";

import { protect } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;