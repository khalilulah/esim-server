import mongoose, { Schema, Document } from "mongoose";

export interface IOrderDocument extends Document {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
  };
  items: {
    product: mongoose.Types.ObjectId;
    name: string; // snapshot — in case product is deleted later
    price: number; // snapshot — in case price changes later
    image: string; // snapshot
    quantity: number;
  }[];
  totalPrice: number;
  shippingFee: number;
  grandTotal: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentReference: string; // Paystack reference
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentReference: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model<IOrderDocument>("Order", orderSchema);
