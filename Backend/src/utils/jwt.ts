import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

interface JwtPayload {
  id: string;
  tokenVersion?: number;
}

export const generateToken = (
  userId: string,
  tokenVersion = 0
): string => {
  return jwt.sign(
    {
      id: userId,
      tokenVersion,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(
    token,
    env.JWT_SECRET
  ) as JwtPayload;
};