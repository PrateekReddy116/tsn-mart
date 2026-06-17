export interface Product {
  id: number;
  name: string;
  price: number;
  qty: number;
  stock: boolean;
  image: string;
  category: string;
  created_at?: string;
}

export interface CartItem extends Product {
  cart_qty: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  payment_method: "razorpay" | "whatsapp";
  payment_id?: string;
  status: "pending" | "confirmed" | "delivered";
  created_at: string;
}

export interface OrderItem {
  product_id: number;
  product_name: string;
  price: number;
  qty: number;
}

export type Category =
  | "all"
  | "rice"
  | "dairy"
  | "bakery"
  | "personal"
  | "home";
