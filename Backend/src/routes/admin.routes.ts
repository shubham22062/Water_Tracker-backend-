import { Router } from "express";

import {
  getAllUsers,
  getUserById,
  getUserIntakeHistory,
  updateUserWaterGoal,
  deleteUser,
} from "../controllers/admin.controllers.js";

import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";

const router = Router();

// Every admin route requires authentication
router.use(protect);

// Every admin route requires admin role
router.use(adminOnly);

router.get("/users", getAllUsers);

router.get("/users/:id", getUserById);

router.get(
  "/users/:id/intake",
  getUserIntakeHistory
);

router.patch(
  "/users/:id/water-goal",
  updateUserWaterGoal
);

router.delete(
  "/users/:id",
  deleteUser
);

export default router;