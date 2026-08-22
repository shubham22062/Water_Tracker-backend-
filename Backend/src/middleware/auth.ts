import { Request, Response, NextFunction } from "express";

import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing",
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select(
      "+tokenVersion"
    );

    if (
      !user ||
      user.tokenVersion !== (decoded.tokenVersion ?? 0)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};