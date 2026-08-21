import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "MONGO_URI",
  "JWT_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Missing required environment variable: ${variable}`
    );
  }
}

export const env = {
  PORT: Number(process.env.PORT ?? 5000),

  NODE_ENV: process.env.NODE_ENV ?? "development",

  MONGO_URI: process.env.MONGO_URI!,

  JWT_SECRET: process.env.JWT_SECRET!,

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",

  DEFAULT_DAILY_GOAL_ML: Number(
    process.env.DEFAULT_DAILY_GOAL_ML ?? 2000
  ),

  ADMIN_NAME: process.env.ADMIN_NAME ?? "Hydriva Admin",

  ADMIN_EMAIL: process.env.ADMIN_EMAIL!,

  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,

  CORS_ORIGIN:
    process.env.CORS_ORIGIN ?? "http://localhost:5173",
};