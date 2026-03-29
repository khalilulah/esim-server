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
const productController = __importStar(require("./product.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_middleware_1 = require("../../middleware/admin.middleware");
const upload_middleware_1 = require("../../middleware/upload.middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    price: zod_1.z.number().positive(),
    images: zod_1.z.array(zod_1.z.string()).min(1),
    description: zod_1.z.string().optional(),
    ingredients: zod_1.z.array(zod_1.z.string()).optional(),
    howToUse: zod_1.z.string().optional(),
    inStock: zod_1.z.boolean().optional(),
});
// Public
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
// Admin only
router.post("/", auth_middleware_1.protect, admin_middleware_1.adminOnly, upload_middleware_1.upload.array("images", 2), productController.create);
router.put("/:id", auth_middleware_1.protect, admin_middleware_1.adminOnly, upload_middleware_1.upload.array("images", 2), productController.update);
router.delete("/:id", auth_middleware_1.protect, admin_middleware_1.adminOnly, productController.remove);
exports.default = router;
