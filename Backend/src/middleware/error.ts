import {
  Request,
  Response,
  NextFunction,
} from "express";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  const message =
    error instanceof Error
      ? error.message
      : "Internal server error";

  return res.status(500).json({
    success: false,
    message,
  });
};