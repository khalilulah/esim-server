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
exports.remove = exports.update = exports.create = exports.getOne = exports.getAll = void 0;
const productService = __importStar(require("./product.service"));
const apiResponse_1 = require("../../shared/utils/apiResponse");
const getAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const category = req.query.category;
        const products = await productService.getAllProducts({
            page,
            limit,
            category,
        });
        (0, apiResponse_1.sendSuccess)(res, products);
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
const getOne = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        (0, apiResponse_1.sendSuccess)(res, product);
    }
    catch (err) {
        next(err);
    }
};
exports.getOne = getOne;
const create = async (req, res, next) => {
    try {
        // Files uploaded via multer — each file has a .path which is the Cloudinary URL
        const files = req.files;
        const imageUrls = files?.map((file) => file.path) ?? [];
        const productData = {
            ...req.body,
            price: Number(req.body.price), // multipart form sends everything as strings
            images: imageUrls,
        };
        const product = await productService.createProduct(productData);
        (0, apiResponse_1.sendSuccess)(res, product, "Product created", 201);
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const files = req.files;
        const productData = { ...req.body };
        // Only update images if new ones were uploaded
        if (files && files.length > 0) {
            productData.images = files.map((file) => file.path);
        }
        if (req.body.price)
            productData.price = Number(req.body.price);
        const product = await productService.updateProduct(id, productData);
        (0, apiResponse_1.sendSuccess)(res, product, "Product updated");
    }
    catch (err) {
        next(err);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id);
        (0, apiResponse_1.sendSuccess)(res, null, "Product deleted");
    }
    catch (err) {
        next(err);
    }
};
exports.remove = remove;
