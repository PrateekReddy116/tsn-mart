"use client";

import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  const { cart, addToCart, changeQty } = useCartStore();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
        <span className="text-5xl">🔍</span>
        <p className="text-base font-medium">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {products.map((p) => {
        const cartItem = cart.find((c) => c.id === p.id);
        const inCart = cartItem?.cart_qty ?? 0;
        const remaining = p.qty - inCart;
        const isAvailable = p.stock && remaining > 0;
        const atMax = inCart >= p.qty;

        return (
          <div
            key={p.id}
            className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-0.5"
            style={{
              boxShadow: "0 1px 4px rgba(0,0,0,.07), 0 4px 12px rgba(0,0,0,.05)",
            }}
          >
            {/* Image area */}
            <div className="relative bg-slate-50 flex items-center justify-center"
              style={{ height: "9rem", padding: "0.75rem" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://cdn-icons-png.flaticon.com/512/2674/2674486.png";
                }}
              />
              {!p.stock && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="bg-slate-100 text-slate-500 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
              {remaining <= 3 && remaining > 0 && (
                <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight">
                  {remaining} left
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-3 gap-2">
              <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                {p.name}
              </h3>
              <p className="text-[15px] font-bold text-[#1a3c34] mt-auto">
                ₹{p.price}
              </p>

              {/* Action button */}
              {!isAvailable && inCart === 0 ? (
                <div className="h-8" /> /* spacer to keep card height consistent */
              ) : inCart > 0 ? (
                <div
                  className="flex items-center justify-between rounded-full px-1 py-0.5"
                  style={{ background: "#1a3c34" }}
                >
                  <button
                    onClick={() => changeQty(p.id, -1, p.qty)}
                    className="w-7 h-7 flex items-center justify-center text-white text-xl font-light hover:text-green-300 transition-colors rounded-full"
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <span className="text-white text-sm font-bold w-5 text-center">
                    {inCart}
                  </span>
                  <button
                    onClick={() => !atMax && addToCart(p)}
                    disabled={atMax}
                    className={`w-7 h-7 flex items-center justify-center text-white text-xl font-light rounded-full transition-colors ${
                      atMax ? "opacity-25 cursor-not-allowed" : "hover:text-green-300"
                    }`}
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(p)}
                  className="flex items-center justify-center gap-1 text-sm font-semibold text-white rounded-full py-1.5 transition-all active:scale-95 hover:opacity-90"
                  style={{ background: "#1a3c34" }}
                  aria-label={`Add ${p.name} to cart`}
                >
                  <span className="text-base leading-none">+</span>
                  Add
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
