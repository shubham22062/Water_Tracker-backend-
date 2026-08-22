import bcrypt from "bcryptjs";

import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      existingAdmin.password = await bcrypt.hash(
        env.ADMIN_PASSWORD,
        12
      );
      existingAdmin.tokenVersion = existingAdmin.tokenVersion ?? 0;

      if (existingAdmin.role === "admin") {
        await existingAdmin.save();
        console.log(
          "Admin already exists."
        );

        process.exit(0);
      }

      existingAdmin.role = "admin";
      await existingAdmin.save();

      console.log(
        "Existing user promoted to admin successfully."
      );

      process.exit(0);
    }

    const hashedPassword =
      await bcrypt.hash(
        env.ADMIN_PASSWORD,
        12
      );

    const admin = await User.create({
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      dailyWaterGoal:
        env.DEFAULT_DAILY_GOAL_ML,
    });

    console.log(
      `Admin created successfully: ${admin.email}`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to seed admin:",
      error
    );

    process.exit(1);
  }
};

seedAdmin();