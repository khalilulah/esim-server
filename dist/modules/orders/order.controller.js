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
exports.remove = exports.updateStatus = exports.getAll = exports.trackOrder = exports.paystackWebhook = exports.verifyPayment = exports.create = void 0;
const orderService = __importStar(require("./order.service"));
const apiResponse_1 = require("../../shared/utils/apiResponse");
// Customer creates order before payment
const create = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body);
        // Return order + grandTotal so frontend can initiate Paystack with correct amount
        (0, apiResponse_1.sendSuccess)(res, {
            orderId: order._id,
            orderNumber: order.orderNumber,
            grandTotal: order.grandTotal,
            shippingFee: order.shippingFee,
            paymentReference: order.orderNumber, // use orderNumber as Paystack reference
        }, "Order created", 201);
    }
    catch (err) {
        next(err);
    }
};
exports.create = create;
// Called after Paystack payment popup closes successfully
const verifyPayment = async (req, res, next) => {
    try {
        const { reference } = req.params;
        const order = await orderService.confirmOrderPayment(reference);
        (0, apiResponse_1.sendSuccess)(res, order, "Payment confirmed");
    }
    catch (err) {
        next(err);
    }
};
exports.verifyPayment = verifyPayment;
// Paystack webhook — server to server
const paystackWebhook = async (req, res) => {
    try {
        const signature = req.headers["x-paystack-signature"];
        const isValid = orderService.verifyWebhookSignature(JSON.stringify(req.body), signature);
        if (!isValid) {
            res.status(400).json({ message: "Invalid signature" });
            return;
        }
        const { event, data } = req.body;
        if (event === "charge.success") {
            await orderService.confirmOrderPayment(data.reference);
        }
        res.sendStatus(200);
    }
    catch {
        res.sendStatus(200); // always return 200 to Paystack even if something fails
    }
};
exports.paystackWebhook = paystackWebhook;
// Customer tracks their order by order number
const trackOrder = async (req, res, next) => {
    try {
        const { orderNumber } = req.params;
        const order = await orderService.getOrderByNumber(orderNumber);
        (0, apiResponse_1.sendSuccess)(res, order);
    }
    catch (err) {
        next(err);
    }
};
exports.trackOrder = trackOrder;
// Admin — get all orders
const getAll = async (_req, res, next) => {
    try {
        const orders = await orderService.getAllOrders();
        (0, apiResponse_1.sendSuccess)(res, orders);
    }
    catch (err) {
        next(err);
    }
};
exports.getAll = getAll;
// Admin — update order status
const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await orderService.updateOrderStatus(id, status);
        (0, apiResponse_1.sendSuccess)(res, order, "Order status updated");
    }
    catch (err) {
        next(err);
    }
};
exports.updateStatus = updateStatus;
const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        await orderService.deleteOrder(id);
        (0, apiResponse_1.sendSuccess)(res, null, "Order deleted");
    }
    catch (err) {
        next(err);
    }
};
exports.remove = remove;
