import { Router } from "express";
import * as orderController from "./order.controller";
import { protect } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";
import { validate } from "../../middleware/validate.middleware";
import { z } from "zod";

const router = Router();

const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10),
  }),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
  }),
  items: z
    .array(
      z.object({
        product: z.string(),
        name: z.string(),
        price: z.number().positive(),
        image: z.string().optional(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  totalPrice: z.number().positive(),
});

const updateStatusSchema = z.object({
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

// Public
router.post("/", validate(createOrderSchema), orderController.create);
router.get("/track/:orderNumber", orderController.trackOrder);
router.get("/verify/:reference", orderController.verifyPayment);
router.post("/webhook/paystack", orderController.paystackWebhook);

// Admin only
router.get("/", protect, adminOnly, orderController.getAll);
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  validate(updateStatusSchema),
  orderController.updateStatus,
);

export default router;
