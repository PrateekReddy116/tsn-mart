"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/store";
import ThemeToggle from "./ThemeToggle";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  onCartToggle: () => void;
}

export default function Header({ search, onSearch, onCartToggle }: Props) {
  const cartCount = useCartStore((s) => s.cartCount());
  const cartTotal = useCartStore((s) => s.cartTotal());

  return (
    <header
      className="sticky top-0 z-40 h-14"
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 1px 8px rgba(0,0,0,.06)",
      }}
    >
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center gap-3">
        {/* Logo — swap public/logo.png with your custom logo */}
        <div className="flex items-center gap-2 shrink-0 select-none">
          <div className="w-8 h-8 relative rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background: "var(--brand)" }}
          >
            {/* When you add public/logo.png, uncomment this Image and remove the emoji span */}
            {/* <Image src="/logo.png" alt="TSN Mart" fill className="object-contain p-1" priority /> */}
            <span className="text-lg">🛍️</span>
          </div>
          <span className="font-black text-base tracking-tight" style={{ color: "var(--text)" }}>
            TSN<span style={{ color: "var(--brand)" }}>Mart</span>
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text3)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-colors"
              style={{
                background: "var(--surface2)",
                border: "1.5px solid var(--border)",
                color: "var(--text)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />

          <button
            onClick={onCartToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold transition-all active:scale-95 select-none"
            style={{ background: "var(--brand)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="hidden sm:inline">
              {cartCount > 0 ? `₹${cartTotal}` : "Cart"}
            </span>
            {cartCount > 0 && (
              <span
                className="text-[11px] font-black px-1.5 py-0.5 rounded-lg"
                style={{ background: "rgba(255,255,255,.25)" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
