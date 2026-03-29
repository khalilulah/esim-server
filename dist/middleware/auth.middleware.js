"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const error_middleware_1 = require("./error.middleware");
const protect = (req, _res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        throw new error_middleware_1.AppError("Not authorised", 401);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    }
    catch {
        throw new error_middleware_1.AppError("Invalid or expired token", 401);
    }
};
exports.protect = protect;
