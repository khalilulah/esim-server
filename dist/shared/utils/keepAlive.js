"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.keepAlive = void 0;
const https_1 = __importDefault(require("https"));
const env_1 = require("../../config/env");
const keepAlive = () => {
    // Only run in production
    if (env_1.env.NODE_ENV !== "production")
        return;
    const url = env_1.env.SERVER_URL; // your Render URL e.g. https://esim-server.onrender.com
    setInterval(() => {
        https_1.default
            .get(`${url}/api/health`, (res) => {
            console.log(`Keep-alive ping: ${res.statusCode}`);
        })
            .on("error", (err) => {
            console.error("Keep-alive error:", err.message);
        });
    }, 14 * 60 * 1000); // every 14 minutes
    console.log("Keep-alive started");
};
exports.keepAlive = keepAlive;
