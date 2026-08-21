import { Request, Response, NextFunction } from "express";

type ValidationFunction = (
  req: Request
) => Record<string, string>;

export const validate = (
  validationFunction: ValidationFunction
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationFunction(req);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};