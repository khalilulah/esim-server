import type { Request, Response, NextFunction } from "express";
import * as productService from "./product.service";
import { sendSuccess } from "../../shared/utils/apiResponse";

export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await productService.getAllProducts();
    sendSuccess(res, products);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.getProductById(
      req.params.id as string,
    );
    sendSuccess(res, product);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Files uploaded via multer — each file has a .path which is the Cloudinary URL
    const files = req.files as Express.Multer.File[];
    const imageUrls = files?.map((file) => file.path) ?? [];

    const productData = {
      ...req.body,
      price: Number(req.body.price), // multipart form sends everything as strings
      images: imageUrls,
    };

    const product = await productService.createProduct(productData);
    sendSuccess(res, product, "Product created", 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };
    const files = req.files as Express.Multer.File[];

    const productData: Record<string, unknown> = { ...req.body };

    // Only update images if new ones were uploaded
    if (files && files.length > 0) {
      productData.images = files.map((file) => file.path);
    }

    if (req.body.price) productData.price = Number(req.body.price);

    const product = await productService.updateProduct(id, productData);
    sendSuccess(res, product, "Product updated");
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
    await productService.deleteProduct(req.params.id as string);
    sendSuccess(res, null, "Product deleted");
  } catch (err) {
    next(err);
  }
};
