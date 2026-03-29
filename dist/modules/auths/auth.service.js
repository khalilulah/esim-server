"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.registerUser = exports.loginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../users/user.model");
const error_middleware_1 = require("../../middleware/error.middleware");
const env_1 = require("../../config/env");
const loginUser = async (email, password) => {
    // 1. Find user by email
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new error_middleware_1.AppError("Invalid email or password", 401);
    // 2. Compare password against hashed version in DB
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new error_middleware_1.AppError("Invalid email or password", 401);
    // 3. Sign JWT with user id and role
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, env_1.env.JWT_SECRET, {
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
exports.loginUser = loginUser;
const registerUser = async (name, email, password, role = "customer") => {
    // 1. Check if email already exists
    const existing = await user_model_1.User.findOne({ email });
    if (existing)
        throw new error_middleware_1.AppError("Email already in use", 400);
    // 2. Hash password before saving
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    // 3. Create user
    const user = await user_model_1.User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });
    // 4. Sign token immediately so user is logged in after registering
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, env_1.env.JWT_SECRET, {
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
exports.registerUser = registerUser;
const changePassword = async (userId, currentPassword, newPassword) => {
    // 1. Find user by id
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new error_middleware_1.AppError("User not found", 404);
    // 2. Verify current password is correct
    const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!isMatch)
        throw new error_middleware_1.AppError("Current password is incorrect", 401);
    // 3. Prevent reusing the same password
    const isSame = await bcryptjs_1.default.compare(newPassword, user.password);
    if (isSame)
        throw new error_middleware_1.AppError("New password must be different from current password", 400);
    // 4. Hash new password and save
    user.password = await bcryptjs_1.default.hash(newPassword, 12);
    await user.save();
};
exports.changePassword = changePassword;
