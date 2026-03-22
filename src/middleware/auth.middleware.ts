import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./error.middleware";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const protect = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new AppError("Not authorised", 401);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      role: string;
    };
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};
