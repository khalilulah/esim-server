"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../modules/users/user.model");
const env_1 = require("../config/env");
const seedAdmin = async () => {
    await mongoose_1.default.connect(env_1.env.MONGODB_URI);
    const existing = await user_model_1.User.findOne({ email: "admin@esim.com" });
    if (existing) {
        console.log("Admin already exists");
        process.exit(0);
    }
    const hashedPassword = await bcryptjs_1.default.hash("omolomo", 12);
    await user_model_1.User.create({
        name: "Admin",
        email: "alausakhalil@gmail.com",
        password: hashedPassword,
        role: "admin",
    });
    console.log("✅ Admin created — email: admin@esim.com, password: changeme123");
    process.exit(0);
};
seedAdmin();
