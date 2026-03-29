import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./modules/auths/auth.routes";
import productRoutes from "./modules/products/product.routes";
import orderRoutes from "./modules/orders/order.routes";
import {
  generalLimiter,
  authLimiter,
  orderLimiter,
} from "./middleware/rateLimit.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use(generalLimiter);

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", orderLimiter, productRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Global error handler — must be last
app.use(errorHandler);

export default app;
