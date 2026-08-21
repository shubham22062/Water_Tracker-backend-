import { Request, Response } from "express";

import User from "../models/User.js";
import IntakeLog from "../models/IntakeLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  }
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      name,
      age,
      gender,
      weight,
      height,
      activityLevel,
    } = req.body;

    const updateData: Record<
      string,
      unknown
    > = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (age !== undefined) {
      updateData.age = age;
    }

    if (gender !== undefined) {
      updateData.gender = gender;
    }

    if (weight !== undefined) {
      updateData.weight = weight;
    }

    if (height !== undefined) {
      updateData.height = height;
    }

    if (activityLevel !== undefined) {
      updateData.activityLevel =
        activityLevel;
    }

    const user =
      await User.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  }
);

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await IntakeLog.deleteMany({
      user: userId,
    });

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  }
);