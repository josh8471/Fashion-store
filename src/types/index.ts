export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  collectionId?: string;
  tags: string[];
  variants: { size: string; stock: number }[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
  slug: string;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: Omit<ShippingAddress, "name" | "email" | "phone">;
  items: {
    productId: string;
    name: string;
    image: string;
    size: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  paymentStatus: string;
  razorpayOrderId?: string;
  createdAt: string;
}
