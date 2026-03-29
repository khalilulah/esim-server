import type { Request, Response, NextFunction } from "express";
import * as orderService from "./order.service";
import { sendSuccess, sendError } from "../../shared/utils/apiResponse";
import type { AuthRequest } from "../../middleware/auth.middleware";

// Customer creates order before payment
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await orderService.createOrder(req.body);

    // Return order + grandTotal so frontend can initiate Paystack with correct amount
    sendSuccess(
      res,
      {
        orderId: order._id,
        orderNumber: order.orderNumber,
        grandTotal: order.grandTotal,
        shippingFee: order.shippingFee,
        paymentReference: order.orderNumber, // use orderNumber as Paystack reference
      },
      "Order created",
      201,
    );
  } catch (err) {
    next(err);
  }
};

// Called after Paystack payment popup closes successfully
export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reference } = req.params as { reference: string };
    const order = await orderService.confirmOrderPayment(reference);
    sendSuccess(res, order, "Payment confirmed");
  } catch (err) {
    next(err);
  }
};

// Paystack webhook — server to server
export const paystackWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["x-paystack-signature"] as string;

    // req.body is a Buffer when using express.raw()
    const rawBody =
      req.body instanceof Buffer
        ? req.body.toString()
        : JSON.stringify(req.body);

    const isValid = orderService.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      res.status(400).json({ message: "Invalid signature" });
      return;
    }

    const payload = JSON.parse(rawBody);
    const { event, data } = payload;

    if (event === "charge.success") {
      await orderService.confirmOrderPayment(data.reference);
    }

    res.sendStatus(200);
  } catch {
    res.sendStatus(200);
  }
};

// Customer tracks their order by order number
export const trackOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderNumber } = req.params as { orderNumber: string };
    const order = await orderService.getOrderByNumber(orderNumber);
    sendSuccess(res, order);
  } catch (err) {
    next(err);
  }
};

// Admin — get all orders
export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await orderService.getAllOrders();
    sendSuccess(res, orders);
  } catch (err) {
    next(err);
  }
};

// Admin — update order status
export const updateStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(id, status);
    sendSuccess(res, order, "Order status updated");
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };
    await orderService.deleteOrder(id);
    sendSuccess(res, null, "Order deleted");
  } catch (err) {
    next(err);
  }
};
