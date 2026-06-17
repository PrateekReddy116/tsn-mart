"use client";

import { useCartStore } from "@/lib/store";
import { Product } from "@/lib/types";

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
  const total = cartTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white flex flex-col transition-transform duration-300 ease-out"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          boxShadow: "-8px 0 40px rgba(0,0,0,.15)",
        }}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="text-base font-bold text-slate-800">Your Cart</h2>
            {cart.length > 0 && (
              <span className="bg-[#1a3c34] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.cart_qty, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors text-lg"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400 py-16">
              <span className="text-6xl">🛒</span>
              <p className="text-sm font-medium">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => {
              const product = products.find((p) => p.id === item.id);
              const maxQty = product?.qty ?? 999;
              const atMax = item.cart_qty >= maxQty;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-slate-50 rounded-xl p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 object-contain rounded-lg bg-white shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://cdn-icons-png.flaticon.com/512/2674/2674486.png";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">₹{item.price} each</p>
                  </div>

                  {/* Qty control */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => changeQty(item.id, -1, maxQty)}
                      className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-base font-medium transition-colors"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-slate-800">
                      {item.cart_qty}
                    </span>
                    <button
                      onClick={() => !atMax && changeQty(item.id, 1, maxQty)}
                      disabled={atMax}
                      className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-base transition-colors ${
                        atMax
                          ? "bg-slate-200 cursor-not-allowed text-slate-400"
                          : "bg-[#1a3c34] hover:bg-[#2a5c4c]"
                      }`}
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm font-bold text-[#1a3c34] w-12 text-right shrink-0">
                    ₹{item.price * item.cart_qty}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-100 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-700">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>🏷️ Discount (10% off ₹500+)</span>
                  <span>−₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-800 pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={onProceed}
              className="w-full bg-[#1a3c34] hover:bg-[#2a5c4c] active:scale-[.98] text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>Proceed to Pay</span>
              <span className="text-base">💳</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
