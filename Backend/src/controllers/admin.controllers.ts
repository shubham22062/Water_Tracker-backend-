import { Request, Response } from "express";

import User from "../models/User.js";
import IntakeLog from "../models/IntakeLog.js";

import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllUsers = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const users =
      await User.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  }
);

export const getUserById = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const { id } = req.params;

    const user =
      await User.findById(id).select(
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

export const getUserIntakeHistory =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const { id } = req.params;

      const user =
        await User.findById(id)
          .select(
            "name email role dailyWaterGoal"
          );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const logs =
        await IntakeLog.find({
          user: id,
        }).sort({
          date: -1,
        });

      const totalWater =
        logs.reduce(
          (total, log) =>
            total + log.amount,
          0
        );

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            dailyWaterGoal:
              user.dailyWaterGoal,
          },
          totalEntries:
            logs.length,
          totalWater,
          logs,
        },
      });
    }
  );

export const updateUserWaterGoal =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const { id } = req.params;
      const { dailyWaterGoal } =
        req.body;

      if (
        typeof dailyWaterGoal !==
          "number" ||
        dailyWaterGoal <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Daily water goal must be a positive number",
        });
      }

      const user =
        await User.findByIdAndUpdate(
          id,
          {
            dailyWaterGoal,
          },
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
        message:
          "Daily water goal updated successfully",
        data: user,
      });
    }
  );

export const deleteUser = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const adminId =
      req.user?.id;

    const { id } = req.params;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (adminId === id) {
      return res.status(400).json({
        success: false,
        message:
          "Admin cannot delete their own account",
      });
    }

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await IntakeLog.deleteMany({
      user: id,
    });

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "User account deleted successfully",
    });
  }
);