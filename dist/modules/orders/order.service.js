"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWebhookSignature = exports.updateOrderStatus = exports.getAllOrders = exports.getOrderByNumber = exports.confirmOrderPayment = exports.verifyPaystackPayment = exports.deleteOrder = exports.createOrder = exports.calculateShipping = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const order_model_1 = require("./order.model");
const error_middleware_1 = require("../../middleware/error.middleware");
const env_1 = require("../../config/env");
// Generate a short readable order number e.g. ESIM-A3F9X2
const generateOrderNumber = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const random = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `ESIM-${random}`;
};
// Calculate shipping fee based on state
const calculateShipping = (state) => {
    const lowerState = state.toLowerCase();
    if (lowerState === "lagos")
        return 2000;
    if (["abuja", "fct"].includes(lowerState))
        return 2500;
    return 3500; // other states
};
exports.calculateShipping = calculateShipping;
const createOrder = async (orderData) => {
    const orderNumber = generateOrderNumber();
    const shippingFee = (0, exports.calculateShipping)(orderData.shippingAddress.state);
    const grandTotal = orderData.totalPrice + shippingFee;
    const order = await order_model_1.Order.create({
        ...orderData,
        orderNumber,
        shippingFee,
        grandTotal,
        paymentReference: orderNumber, // ✅ saved here
        paymentStatus: "pending",
        status: "pending",
    });
    return order;
};
exports.createOrder = createOrder;
const deleteOrder = async (id) => {
    const order = await order_model_1.Order.findByIdAndDelete(id);
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
};
exports.deleteOrder = deleteOrder;
const verifyPaystackPayment = async (reference) => {
    const response = await axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
            Authorization: `Bearer ${env_1.env.PAYSTACK_SECRET_KEY}`,
        },
    });
    return response.data.data;
};
exports.verifyPaystackPayment = verifyPaystackPayment;
const confirmOrderPayment = async (reference) => {
    console.log("1. Reference received:", reference);
    const paystackData = await (0, exports.verifyPaystackPayment)(reference);
    console.log("2. Paystack status:", paystackData.status);
    if (paystackData.status !== "success") {
        throw new error_middleware_1.AppError("Payment verification failed", 400);
    }
    const order = await order_model_1.Order.findOne({ paymentReference: reference });
    console.log("3. Order found:", order);
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    if (order.paymentStatus === "paid")
        return order;
    order.paymentStatus = "paid";
    order.status = "processing";
    await order.save();
    console.log("4. Order updated successfully");
    return order;
};
exports.confirmOrderPayment = confirmOrderPayment;
const getOrderByNumber = async (orderNumber) => {
    const order = await order_model_1.Order.findOne({ orderNumber });
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    return order;
};
exports.getOrderByNumber = getOrderByNumber;
const getAllOrders = async () => {
    return order_model_1.Order.find().sort({ createdAt: -1 });
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (id, status) => {
    const order = await order_model_1.Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    return order;
};
exports.updateOrderStatus = updateOrderStatus;
// Paystack webhook signature verification
const verifyWebhookSignature = (body, signature) => {
    const hash = crypto_1.default
        .createHmac("sha512", env_1.env.PAYSTACK_SECRET_KEY)
        .update(body)
        .digest("hex");
    return hash === signature;
};
exports.verifyWebhookSignature = verifyWebhookSignature;
