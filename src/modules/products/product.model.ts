import mongoose, { Schema, Document } from "mongoose";

export interface IProductDocument extends Document {
  name: string;
  category: string;
  price: number;
  images: string[];
  description?: string;
  ingredients?: string[];
  howToUse?: string;
  inStock: boolean;
}

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    description: { type: String },
    ingredients: { type: [String] },
    howToUse: { type: String },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Product = mongoose.model<IProductDocument>(
  "Product",
  productSchema,
);
