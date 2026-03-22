import { Product } from "./product.model";
import { AppError } from "../../middleware/error.middleware";
import type { IProductDocument } from "./product.model";

export const getAllProducts = async () => {
  return Product.find().sort({ createdAt: -1 });
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

export const createProduct = async (data: Partial<IProductDocument>) => {
  return Product.create(data);
};

export const updateProduct = async (
  id: string,
  data: Partial<IProductDocument>,
) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError("Product not found", 404);
};
