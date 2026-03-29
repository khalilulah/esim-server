import crypto from "crypto";
import axios from "axios";
import { Order } from "./order.model";
import { AppError } from "../../middleware/error.middleware";
import { env } from "../../config/env";
import type { IOrderDocument } from "./order.model";

// Generate a short readable order number e.g. ESIM-A3F9X2
const generateOrderNumber = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const random = Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `ESIM-${random}`;
};

// Calculate shipping fee based on state
export const calculateShipping = (state: string): number => {
  const lowerState = state.toLowerCase();
  if (lowerState === "lagos") return 2000;
  if (["abuja", "fct"].includes(lowerState)) return 2500;
  return 3500; // other states
};

export const createOrder = async (
  orderData: Omit<
    IOrderDocument,
    "orderNumber" | "paymentStatus" | "paymentReference" | "status"
  >,
) => {
  const orderNumber = generateOrderNumber();
  const shippingFee = calculateShipping(orderData.shippingAddress.state);
  const grandTotal = orderData.totalPrice + shippingFee;

  const order = await Order.create({
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

export const deleteOrder = async (id: string) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new AppError("Order not found", 404);
};

export const verifyPaystackPayment = async (reference: string) => {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );
  return response.data.data;
};

export const confirmOrderPayment = async (reference: string) => {
  console.log("1. Reference received:", reference);

  const paystackData = await verifyPaystackPayment(reference);
  console.log("2. Paystack status:", paystackData.status);

  if (paystackData.status !== "success") {
    throw new AppError("Payment verification failed", 400);
  }

  const order = await Order.findOne({ paymentReference: reference });
  console.log("3. Order found:", order);

  if (!order) throw new AppError("Order not found", 404);

  if (order.paymentStatus === "paid") return order;

  order.paymentStatus = "paid";
  order.status = "processing";
  await order.save();
  console.log("4. Order updated successfully");

  return order;
};

export const getOrderByNumber = async (orderNumber: string) => {
  const order = await Order.findOne({ orderNumber });
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

export const getAllOrders = async () => {
  return Order.find().sort({ createdAt: -1 });
};

export const updateOrderStatus = async (
  id: string,
  status: IOrderDocument["status"],
) => {
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

// Paystack webhook signature verification
export const verifyWebhookSignature = (
  body: string,
  signature: string,
): boolean => {
  const hash = crypto
    .createHmac("sha512", env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");
  return hash === signature;
};
