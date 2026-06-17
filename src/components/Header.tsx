"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  onCartToggle: () => void;
}

export default function Header({ search, onSearch, onCartToggle }: Props) {
  const cartCount = useCartStore((s) => s.cartCount());

  return (
    <header
      className="sticky top-0 z-40 h-16 bg-[#1a3c34]"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,.25)" }}
    >
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 select-none">
          <span className="text-2xl leading-none">🛍️</span>
          <span className="text-white font-bold text-lg leading-none">
            TSN&nbsp;<span className="text-green-400">Mart</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm select-none">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-white/10 border border-white/15 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:bg-white/20 focus:border-green-400 transition-colors"
            />
          </div>
        </div>

        {/* Cart only — admin link removed from customer-facing header */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onCartToggle}
            className="relative flex items-center gap-1.5 bg-green-500 hover:bg-green-400 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all select-none"
          >
            <span className="text-base leading-none">🛒</span>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
