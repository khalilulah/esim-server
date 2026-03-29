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
    const isValid = orderService.verifyWebhookSignature(
      JSON.stringify(req.body),
      signature,
    );

    if (!isValid) {
      res.status(400).json({ message: "Invalid signature" });
      return;
    }

    const { event, data } = req.body;

    if (event === "charge.success") {
      await orderService.confirmOrderPayment(data.reference);
    }

    res.sendStatus(200);
  } catch {
    res.sendStatus(200); // always return 200 to Paystack even if something fails
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
