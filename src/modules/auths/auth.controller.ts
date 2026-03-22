import type { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import * as authService from "./auth.service";
import { sendSuccess } from "../../shared/utils/apiResponse";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    sendSuccess(res, result, "Login successful");
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(
      req.userId as string,
      currentPassword,
      newPassword,
    );
    sendSuccess(res, null, "Password changed successfully");
  } catch (err) {
    next(err);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser(name, email, password, role);
    sendSuccess(res, result, "Registration successful", 201);
  } catch (err) {
    next(err);
  }
};
