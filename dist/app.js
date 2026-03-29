"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./modules/auths/auth.routes"));
const product_routes_1 = __importDefault(require("./modules/products/product.routes"));
const order_routes_1 = __importDefault(require("./modules/orders/order.routes"));
const rateLimit_middleware_1 = require("./middleware/rateLimit.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(rateLimit_middleware_1.generalLimiter);
// Routes
app.use("/api/auth", rateLimit_middleware_1.authLimiter, auth_routes_1.default);
app.use("/api/products", rateLimit_middleware_1.orderLimiter, product_routes_1.default);
app.use("/api/orders", order_routes_1.default);
// Health check
app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "Server is running" });
});
// Global error handler — must be last
app.use(error_middleware_1.errorHandler);
exports.default = app;
