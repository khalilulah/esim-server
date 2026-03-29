import { Product } from "./product.model";
import { AppError } from "../../middleware/error.middleware";
import type { IProductDocument } from "./product.model";

interface GetProductsOptions {
  page: number;
  limit: number;
  category?: string;
}

export const getAllProducts = async ({
  page,
  limit,
  category,
}: GetProductsOptions) => {
  const filter = category
    ? { category: { $regex: category, $options: "i" } }
    : {};
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
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
