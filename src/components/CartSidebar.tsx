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
  const total    = cartTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,.45)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 z-50 h-full w-full bg-white flex flex-col transition-transform duration-300 ease-out"
        style={{
          maxWidth: "22rem",
          transform: open ? "translateX(0)" : "translateX(100%)",
          boxShadow: "-12px 0 48px rgba(0,0,0,.18)",
        }}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3.5"
          style={{ borderBottom: "1px solid #f1f5f9" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm"
              style={{ background: "#1a3c34" }}
            >
              🛒
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">My Cart</h2>
              {cart.length > 0 && (
                <p className="text-[11px]" style={{ color: "#64748b" }}>
                  {cart.reduce((s, i) => s + i.cart_qty, 0)} item{cart.reduce((s, i) => s + i.cart_qty, 0) !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
            style={{ background: "#f8fafc", color: "#64748b" }}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background: "#f8fafc" }}>
                🛒
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-700 mb-1">Your cart is empty</p>
                <p className="text-xs text-slate-400">Add items to get started</p>
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
                  className="flex items-center gap-3 p-2.5 rounded-2xl"
                  style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain rounded-xl shrink-0"
                    style={{ background: "white" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://cdn-icons-png.flaticon.com/512/2674/2674486.png";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>₹{item.price} each</p>
                  </div>

                  {/* Qty stepper */}
                  <div
                    className="flex items-center rounded-xl overflow-hidden shrink-0"
                    style={{ border: "1.5px solid #1a3c34" }}
                  >
                    <button
                      onClick={() => changeQty(item.id, -1, maxQty)}
                      className="w-7 h-7 flex items-center justify-center font-bold text-base"
                      style={{ color: "#1a3c34" }}
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-black" style={{ color: "#1a3c34" }}>
                      {item.cart_qty}
                    </span>
                    <button
                      onClick={() => !atMax && changeQty(item.id, 1, maxQty)}
                      disabled={atMax}
                      className="w-7 h-7 flex items-center justify-center font-bold text-base"
                      style={{
                        background: atMax ? "#f1f5f9" : "#1a3c34",
                        color: atMax ? "#94a3b8" : "white",
                      }}
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm font-black shrink-0 w-12 text-right" style={{ color: "#1a3c34" }}>
                    ₹{item.price * item.cart_qty}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-4 py-4" style={{ borderTop: "1px solid #f1f5f9" }}>
            {/* Bill summary */}
            <div
              className="rounded-2xl p-3 mb-3 space-y-1.5 text-sm"
              style={{ background: "#f8fafc" }}
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill Summary</p>
              <div className="flex justify-between text-slate-600">
                <span>Item total</span>
                <span className="font-semibold text-slate-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery fee</span>
                <span className="font-semibold" style={{ color: "#16a34a" }}>FREE</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-semibold" style={{ color: "#16a34a" }}>
                  <span>Discount (10% off)</span>
                  <span>−₹{discount}</span>
                </div>
              )}
              <div
                className="flex justify-between font-black text-base pt-2"
                style={{ borderTop: "1px dashed #e2e8f0", color: "#0f172a" }}
              >
                <span>To Pay</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={onProceed}
              className="w-full text-white font-black py-4 rounded-2xl transition-all active:scale-[.98] flex items-center justify-between px-5 text-sm"
              style={{ background: "#1a3c34" }}
            >
              <span>{cart.reduce((s, i) => s + i.cart_qty, 0)} item{cart.reduce((s, i) => s + i.cart_qty, 0) !== 1 ? "s" : ""}</span>
              <span>Proceed  →</span>
              <span>₹{total}</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
