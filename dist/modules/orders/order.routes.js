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
const express_1 = require("express");
const orderController = __importStar(require("./order.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const createOrderSchema = zod_1.z.object({
    customer: zod_1.z.object({
        name: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().min(10),
    }),
    shippingAddress: zod_1.z.object({
        street: zod_1.z.string().min(1),
        city: zod_1.z.string().min(1),
        state: zod_1.z.string().min(1),
    }),
    items: zod_1.z
        .array(zod_1.z.object({
        product: zod_1.z.string(),
        name: zod_1.z.string(),
        price: zod_1.z.number().positive(),
        image: zod_1.z.string().optional(),
        quantity: zod_1.z.number().int().positive(),
    }))
        .min(1),
    totalPrice: zod_1.z.number().positive(),
});
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ]),
});
// Public
router.post("/", (0, validate_middleware_1.validate)(createOrderSchema), orderController.create);
router.get("/track/:orderNumber", orderController.trackOrder);
router.get("/verify/:reference", orderController.verifyPayment);
router.post("/webhook/paystack", orderController.paystackWebhook);
// Admin only
router.get("/", auth_middleware_1.protect, admin_middleware_1.adminOnly, orderController.getAll);
router.patch("/:id/status", auth_middleware_1.protect, admin_middleware_1.adminOnly, (0, validate_middleware_1.validate)(updateStatusSchema), orderController.updateStatus);
router.delete("/:id", auth_middleware_1.protect, admin_middleware_1.adminOnly, orderController.remove);
exports.default = router;
