"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.changePassword = exports.login = void 0;
const authService = __importStar(require("./auth.service"));
const apiResponse_1 = require("../../shared/utils/apiResponse");
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        (0, apiResponse_1.sendSuccess)(res, result, "Login successful");
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await authService.changePassword(req.userId, currentPassword, newPassword);
        (0, apiResponse_1.sendSuccess)(res, null, "Password changed successfully");
    }
    catch (err) {
        next(err);
    }
};
exports.changePassword = changePassword;
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const result = await authService.registerUser(name, email, password, role);
        (0, apiResponse_1.sendSuccess)(res, result, "Registration successful", 201);
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
