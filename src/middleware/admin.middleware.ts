import type { Response, NextFunction } from "express";
import { AppError } from "./error.middleware";
import type { AuthRequest } from "./auth.middleware";

export const adminOnly = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.userRole !== "admin") throw new AppError("Admin access only", 403);
  next();
};
