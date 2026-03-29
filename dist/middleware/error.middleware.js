"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
const errorHandler = (err, _req, res, _next) => {
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
exports.errorHandler = errorHandler;
