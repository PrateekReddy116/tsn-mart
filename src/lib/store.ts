import { create } from "zustand";
import { CartItem, Product } from "./types";

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  changeQty: (id: number, delta: number, maxQty: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
  cartSubtotal: () => number;
  cartDiscount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  addToCart: (product) => {
    const { cart } = get();
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      if (existing.cart_qty >= product.qty) return;
      set({
        cart: cart.map((i) =>
          i.id === product.id ? { ...i, cart_qty: i.cart_qty + 1 } : i
        ),
      });
    } else {
      set({ cart: [...cart, { ...product, cart_qty: 1 }] });
    }
  },

  removeFromCart: (id) =>
    set({ cart: get().cart.filter((i) => i.id !== id) }),

  changeQty: (id, delta, maxQty) => {
    const { cart } = get();
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.cart_qty + delta;
    if (newQty <= 0) {
      set({ cart: cart.filter((i) => i.id !== id) });
    } else if (newQty <= maxQty) {
      set({
        cart: cart.map((i) =>
          i.id === id ? { ...i, cart_qty: newQty } : i
        ),
      });
    }
  },

  clearCart: () => set({ cart: [] }),

  cartSubtotal: () =>
    get().cart.reduce((sum, i) => sum + i.price * i.cart_qty, 0),

  cartDiscount: () => {
    const subtotal = get().cartSubtotal();
    return subtotal > 500 ? Math.round(subtotal * 0.1) : 0;
  },

  cartTotal: () => get().cartSubtotal() - get().cartDiscount(),

  cartCount: () => get().cart.reduce((sum, i) => sum + i.cart_qty, 0),
}));
