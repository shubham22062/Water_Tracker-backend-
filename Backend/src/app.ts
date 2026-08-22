import express from "express";
import cors from "cors";
import morgan from "morgan";

import { env } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import intakeRoutes from "./routes/intake.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { errorHandler } from "./middleware/error.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use(morgan("dev"));


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HydroX API is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/intake", intakeRoutes);
app.use("/api/admin", adminRoutes);

// Global error handler
app.use(errorHandler);

export default app;