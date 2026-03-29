"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requireEnv = (key) => {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing required environment variable: ${key}`);
    return value;
};
exports.env = {
    PORT: process.env.PORT ?? "5000",
    MONGODB_URI: requireEnv("MONGODB_URI"),
    JWT_SECRET: requireEnv("JWT_SECRET"),
    CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
    ADMIN_URL: process.env.ADMIN_URL ?? "http://localhost:5174",
    NODE_ENV: process.env.NODE_ENV ?? "development",
    CLOUDINARY_CLOUD_NAME: requireEnv("CLOUDINARY_CLOUD_NAME"),
    CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
    CLOUDINARY_API_SECRET: requireEnv("CLOUDINARY_API_SECRET"),
    PAYSTACK_SECRET_KEY: requireEnv("PAYSTACK_SECRET_KEY"),
    SERVER_URL: process.env.SERVER_URL ?? "http://localhost:5000",
};
