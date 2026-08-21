import express from "express";
import cors from "cors";
import morgan from "morgan";

import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);

app.use(express.json());

app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Hydriva API is healthy"
  });
});

export default app;