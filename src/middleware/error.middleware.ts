import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("FULL ERROR:", err); // add this line
  console.error(`[Error] ${err.message}`);

  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json({ success: false, message: err.message, data: null });
    return;
  }

  res
    .status(500)
    .json({ success: false, message: "Internal server error", data: null });
};
