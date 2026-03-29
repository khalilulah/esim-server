"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const product_model_1 = require("./product.model");
const error_middleware_1 = require("../../middleware/error.middleware");
const getAllProducts = async ({ page, limit, category, }) => {
    const filter = category
        ? { category: { $regex: category, $options: "i" } }
        : {};
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
        product_model_1.Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        product_model_1.Product.countDocuments(filter),
    ]);
    return {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
    };
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    const product = await product_model_1.Product.findById(id);
    if (!product)
        throw new error_middleware_1.AppError("Product not found", 404);
    return product;
};
exports.getProductById = getProductById;
const createProduct = async (data) => {
    return product_model_1.Product.create(data);
};
exports.createProduct = createProduct;
const updateProduct = async (id, data) => {
    const product = await product_model_1.Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!product)
        throw new error_middleware_1.AppError("Product not found", 404);
    return product;
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    const product = await product_model_1.Product.findByIdAndDelete(id);
    if (!product)
        throw new error_middleware_1.AppError("Product not found", 404);
};
exports.deleteProduct = deleteProduct;
