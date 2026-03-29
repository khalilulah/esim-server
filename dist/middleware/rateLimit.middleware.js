"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// General API limit — applies to all routes
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes per IP
    message: {
        success: false,
        message: "Too many requests, please try again later.",
        data: null,
    },
    standardHeaders: true, // adds RateLimit headers to responses
    legacyHeaders: false,
});
// Strict limit for auth routes — prevent brute force
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // only 10 login attempts per 15 minutes
    message: {
        success: false,
        message: "Too many login attempts, please try again later.",
        data: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Strict limit for order creation — prevent spam orders
exports.orderLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 orders per hour per IP
    message: {
        success: false,
        message: "Too many orders placed, please try again later.",
        data: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
});
