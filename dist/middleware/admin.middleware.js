"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const error_middleware_1 = require("./error.middleware");
const adminOnly = (req, _res, next) => {
    if (req.userRole !== "admin")
        throw new error_middleware_1.AppError("Admin access only", 403);
    next();
};
exports.adminOnly = adminOnly;
