import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./modules/auths/auth.routes";
import productRoutes from "./modules/products/product.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Global error handler — must be last
app.use(errorHandler);

export default app;
