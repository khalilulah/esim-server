import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { protect } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";
import { z } from "zod";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["customer", "admin"]).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

// Public
router.post("/login", validate(loginSchema), authController.login);

router.patch(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  authController.changePassword,
);

// Admin only — only existing admins can create new admin accounts
router.post(
  "/register",
  protect,
  adminOnly,
  validate(registerSchema),
  authController.register,
);

export default router;
