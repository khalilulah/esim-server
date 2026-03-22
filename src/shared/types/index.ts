export interface IProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  description?: string;
  ingredients?: string[];
  howToUse?: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt: Date;
}

export interface IOrder {
  id: string;
  user: string;
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}
