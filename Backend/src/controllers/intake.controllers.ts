import { Request, Response } from "express";

import IntakeLog from "../models/IntakeLog.js";
import User from "../models/User.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { getDateRange } from "../utils/date.js";

export const addIntake = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { amount, date } = req.body;

    if (
      typeof amount !== "number" ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount must be a positive number",
      });
    }

    const intake = await IntakeLog.create({
      user: userId,
      amount,
      date: date
        ? new Date(date)
        : new Date(),
    });

    return res.status(201).json({
      success: true,
      message:
        "Water intake added successfully",
      data: intake,
    });
  }
);

export const getTodayIntake = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      start,
      end,
    } = getDateRange();

    const logs = await IntakeLog.find({
      user: userId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({
      date: -1,
    });

    const totalWater = logs.reduce(
      (total, log) =>
        total + log.amount,
      0
    );

    const user = await User.findById(
      userId
    ).select("dailyWaterGoal");

    const dailyGoal =
      user?.dailyWaterGoal ?? 0;

    const percentage =
      dailyGoal > 0
        ? Math.min(
            Math.round(
              (totalWater /
                dailyGoal) *
                100
            ),
            100
          )
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalWater,
        dailyGoal,
        remaining: Math.max(
          dailyGoal - totalWater,
          0
        ),
        percentage,
        entries: logs.length,
        logs,
      },
    });
  }
);

export const getIntakeHistory =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const {
        startDate,
        endDate,
      } = req.query;

      const filter: {
        user: string;
        date?: {
          $gte?: Date;
          $lte?: Date;
        };
      } = {
        user: userId,
      };

      if (startDate || endDate) {
        filter.date = {};

        if (startDate) {
          filter.date.$gte =
            new Date(
              startDate as string
            );
        }

        if (endDate) {
          const end = new Date(
            endDate as string
          );

          end.setHours(
            23,
            59,
            59,
            999
          );

          filter.date.$lte = end;
        }
      }

      const logs =
        await IntakeLog.find(
          filter
        ).sort({
          date: -1,
        });

      return res.status(200).json({
        success: true,
        count: logs.length,
        data: logs,
      });
    }
  );

export const updateIntake = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const { amount } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      typeof amount !== "number" ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount must be a positive number",
      });
    }

    const intake =
      await IntakeLog.findOneAndUpdate(
        {
          _id: id,
          user: userId,
        },
        {
          amount,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!intake) {
      return res.status(404).json({
        success: false,
        message:
          "Intake record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Water intake updated successfully",
      data: intake,
    });
  }
);

export const deleteIntake = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const intake =
      await IntakeLog.findOneAndDelete({
        _id: id,
        user: userId,
      });

    if (!intake) {
      return res.status(404).json({
        success: false,
        message:
          "Intake record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Water intake deleted successfully",
    });
  }
);

export const getDailySummary =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const {
        start,
        end,
      } = getDateRange();

      const logs =
        await IntakeLog.find({
          user: userId,
          date: {
            $gte: start,
            $lte: end,
          },
        });

      const totalWater =
        logs.reduce(
          (total, log) =>
            total + log.amount,
          0
        );

      const user =
        await User.findById(
          userId
        ).select(
          "dailyWaterGoal"
        );

      const dailyGoal =
        user?.dailyWaterGoal ?? 0;

      return res.status(200).json({
        success: true,
        data: {
          totalWater,
          dailyGoal,
          remaining: Math.max(
            dailyGoal -
              totalWater,
            0
          ),
          percentage:
            dailyGoal > 0
              ? Math.min(
                  Math.round(
                    (totalWater /
                      dailyGoal) *
                      100
                  ),
                  100
                )
              : 0,
          entries: logs.length,
        },
      });
    }
  );