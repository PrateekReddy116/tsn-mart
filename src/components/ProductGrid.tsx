"use client";

import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { CATEGORIES } from "./CategoryChips";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Props {
  products: Product[];
  user?: any;
  savedItems?: number[];
  setSavedItems?: (items: number[]) => void;
}

function getDeliveryLabel(category: string) {
  return CATEGORIES.find((c) => c.key === category)?.delivery ?? "Same day";
}

export default function ProductGrid({ products, user, savedItems = [], setSavedItems }: Props) {
  const { cart, addToCart, changeQty } = useCartStore();
  const router = useRouter();
  const supabase = createClient();
  const [localSaved, setLocalSaved] = useState<number[]>(savedItems);

  useEffect(() => {
    setLocalSaved(savedItems);
  }, [savedItems]);

  async function toggleSave(productId: number) {
    if (!user) {
      router.push("/signin");
      return;
    }

    const isSaved = localSaved.includes(productId);
    if (isSaved) {
      // Remove
      setLocalSaved(localSaved.filter(id => id !== productId));
      if (setSavedItems) setSavedItems(localSaved.filter(id => id !== productId));
      await supabase.from("saved_items").delete().match({ user_id: user.id, product_id: productId });
    } else {
      // Add
      setLocalSaved([...localSaved, productId]);
      if (setSavedItems) setSavedItems([...localSaved, productId]);
      await supabase.from("saved_items").insert([{ user_id: user.id, product_id: productId }]);
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: "var(--text3)" }}>
        <svg className="w-14 h-14 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p className="font-semibold text-base">No products found</p>
        <p className="text-sm">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {products.map((p) => {
        const cartItem  = cart.find((c) => c.id === p.id);
        const inCart    = cartItem?.cart_qty ?? 0;
        const remaining = p.qty - inCart;
        const isAvail   = p.stock && remaining > 0;
        const atMax     = inCart >= p.qty;
        const delivery  = getDeliveryLabel(p.category);

        return (
          <div
            key={p.id}
            className="rounded-2xl overflow-hidden flex flex-col group transition-transform hover:-translate-y-0.5"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border2)",
              boxShadow: "0 1px 4px rgba(0,0,0,.06)",
            }}
          >
            {/* Image */}
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{ height: "8.5rem", background: "var(--surface2)" }}
            >
              <button 
                onClick={() => toggleSave(p.id)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-[var(--text2)] hover:text-red-500 hover:bg-white transition-colors shadow-sm"
              >
                <Heart 
                  size={16} 
                  fill={localSaved.includes(p.id) ? "currentColor" : "none"} 
                  className={localSaved.includes(p.id) ? "text-red-500" : ""} 
                />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://cdn-icons-png.flaticon.com/512/2674/2674486.png";
                }}
              />
              {/* Out of stock */}
              {!isAvail && inCart === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-[1px]">
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: "var(--surface)",
                      color: "var(--text3)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    Out of Stock
                  </span>
                </div>
              )}
              {/* Low stock */}
              {isAvail && remaining <= 3 && (
                <span
                  className="absolute top-1.5 left-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
                >
                  {remaining} left!
                </span>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-3 gap-1">
              <p className="text-[11px] font-medium" style={{ color: "var(--text3)" }}>
                {delivery}
              </p>
              <h3 className="text-sm font-bold leading-snug line-clamp-2 flex-1" style={{ color: "var(--text)" }}>
                {p.name}
              </h3>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[15px] font-black" style={{ color: "var(--brand)" }}>
                  ₹{p.price}
                </span>

                {!isAvail && inCart === 0 ? (
                  <span className="text-[10px] font-semibold" style={{ color: "var(--text3)" }}>
                    Notify me
                  </span>
                ) : inCart > 0 ? (
                  <div
                    className="flex items-center rounded-xl overflow-hidden"
                    style={{ border: "1.5px solid var(--brand)" }}
                  >
                    <button
                      onClick={() => changeQty(p.id, -1, p.qty)}
                      className="w-7 h-7 flex items-center justify-center font-bold text-base transition-colors"
                      style={{ color: "var(--brand)" }}
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-black" style={{ color: "var(--brand)" }}>
                      {inCart}
                    </span>
                    <button
                      onClick={() => !atMax && addToCart(p)}
                      disabled={atMax}
                      className="w-7 h-7 flex items-center justify-center font-bold text-base transition-colors"
                      style={{
                        background: atMax ? "var(--surface2)" : "var(--brand)",
                        color: atMax ? "var(--text3)" : "white",
                      }}
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(p)}
                    className="flex items-center justify-center w-8 h-8 rounded-xl font-bold text-xl text-white transition-all active:scale-90"
                    style={{ background: "var(--brand)" }}
                    aria-label={`Add ${p.name}`}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
