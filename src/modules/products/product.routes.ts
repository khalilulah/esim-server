import { Router } from "express";
import * as productController from "./product.controller";
import { protect } from "../../middleware/auth.middleware";
import { adminOnly } from "../../middleware/admin.middleware";
import { validate } from "../../middleware/validate.middleware";
import { upload } from "../../middleware/upload.middleware";
import { z } from "zod";

const router = Router();

const productSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  howToUse: z.string().optional(),
  inStock: z.boolean().optional(),
});

// Public
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);

// Admin only
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 4),
  productController.create,
);
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 4),
  productController.update,
);
router.delete("/:id", protect, adminOnly, productController.remove);

export default router;
