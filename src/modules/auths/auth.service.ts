import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model";
import { AppError } from "../../middleware/error.middleware";
import { env } from "../../config/env";

export const loginUser = async (email: string, password: string) => {
  // 1. Find user by email
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid email or password", 401);

  // 2. Compare password against hashed version in DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  // 3. Sign JWT with user id and role
  const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "customer" | "admin" = "customer",
) => {
  // 1. Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already in use", 400);

  // 2. Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // 4. Sign token immediately so user is logged in after registering
  const token = jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  // 1. Find user by id
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  // 2. Verify current password is correct
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new AppError("Current password is incorrect", 401);

  // 3. Prevent reusing the same password
  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame)
    throw new AppError(
      "New password must be different from current password",
      400,
    );

  // 4. Hash new password and save
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
};
