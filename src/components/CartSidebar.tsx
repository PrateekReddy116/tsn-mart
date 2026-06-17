"use client";

import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/types";
import { ShoppingCart, X, Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
  products: Product[];
}

export default function CartSidebar({ open, onClose, onProceed, products }: Props) {
  const { cart, changeQty, cartSubtotal, cartDiscount, cartTotal } = useCartStore();

  const subtotal = cartSubtotal();
  const discount = cartDiscount();
  const total    = cartTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 transition-opacity duration-300 bg-black/40 backdrop-blur-sm ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[22rem] sm:max-w-sm flex flex-col bg-[var(--surface)] border-l border-[var(--border)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[var(--text)]">My Cart</h2>
            {cart.length > 0 && (
              <span className="bg-[var(--brand)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.cart_qty, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[var(--text3)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-[var(--text3)]">
              <ShoppingCart size={48} strokeWidth={1.5} className="opacity-20" />
              <div className="text-center">
                <p className="font-semibold text-[var(--text2)] mb-1 text-base">Your cart is empty</p>
                <p className="text-sm">Add items to get started</p>
              </div>
            </div>
          ) : (
            cart.map((item) => {
              const product = products.find((p) => p.id === item.id);
              const maxQty  = product?.qty ?? 999;
              const atMax   = item.cart_qty >= maxQty;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-[var(--surface2)] p-3 rounded-2xl border border-[var(--border)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded-xl shrink-0 bg-white p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://cdn-icons-png.flaticon.com/512/2674/2674486.png";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--text)] truncate">{item.name}</p>
                    <p className="text-xs text-[var(--text3)] mt-0.5 font-medium">₹{item.price} <span className="text-[10px]">each</span></p>
                  </div>

                  {/* Qty and total price */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-sm font-black text-[var(--text)]">
                      ₹{item.price * item.cart_qty}
                    </p>
                    <div className="flex items-center bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                      <button
                        onClick={() => changeQty(item.id, -1, maxQty)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white rounded-l-lg transition-colors"
                      >
                        {item.cart_qty === 1 ? <Trash2 size={12} /> : "−"}
                      </button>
                      <span className="w-6 text-center text-xs font-black text-[var(--text)]">
                        {item.cart_qty}
                      </span>
                      <button
                        onClick={() => !atMax && changeQty(item.id, 1, maxQty)}
                        disabled={atMax}
                        className={`w-6 h-6 flex items-center justify-center font-bold text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white rounded-r-lg transition-colors ${atMax ? "opacity-30 pointer-events-none" : ""}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[var(--border)] bg-[var(--surface)]">
            <div className="bg-[var(--surface2)] rounded-2xl p-4 mb-4 space-y-2 text-sm border border-[var(--border)]">
              <div className="flex justify-between text-[var(--text2)]">
                <span>Item total</span>
                <span className="font-semibold text-[var(--text)]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[var(--text2)]">
                <span>Delivery fee</span>
                <span className="font-semibold text-green-500">FREE</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-semibold text-green-500">
                  <span>Discount (10% off)</span>
                  <span>−₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-lg pt-3 mt-3 border-t border-dashed border-[var(--border)] text-[var(--text)]">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={onProceed}
              className="w-full bg-[var(--brand)] hover:bg-[var(--brand2)] text-white font-bold py-4 rounded-2xl transition-all active:scale-[.98] shadow-md shadow-[var(--brand)]/20"
            >
              Checkout Now
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
