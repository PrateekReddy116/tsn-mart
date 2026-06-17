"use client";

import { Category } from "@/lib/types";

export const CATEGORIES: {
  key: Category;
  emoji: string;
  label: string;
  color: string;
  delivery: string;   // shown on product cards in this category
}[] = [
  { key: "all",      emoji: "🏪", label: "All",           color: "#1a3c34", delivery: "Same day" },
  { key: "rice",     emoji: "🌾", label: "Rice & Grains", color: "#92400e", delivery: "Same day" },
  { key: "dairy",    emoji: "🥛", label: "Dairy",         color: "#1d4ed8", delivery: "Morning slot" },
  { key: "bakery",   emoji: "🍞", label: "Bakery",        color: "#b45309", delivery: "Morning slot" },
  { key: "personal", emoji: "🧴", label: "Personal",      color: "#6d28d9", delivery: "Same day" },
  { key: "home",     emoji: "🏠", label: "Home",          color: "#0f766e", delivery: "1–2 days" },
];

interface Props {
  active: Category;
  onChange: (cat: Category) => void;
}

export default function CategoryChips({ active, onChange }: Props) {
  return (
    <div
      id="products"
      className="sticky top-14 z-30 scrollbar-hide"
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 2px 8px rgba(0,0,0,.04)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2.5 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onChange(cat.key)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all select-none active:scale-95"
              style={
                isActive
                  ? { background: cat.color, color: "white", boxShadow: `0 2px 8px ${cat.color}50` }
                  : {
                      background: "var(--surface2)",
                      color: "var(--text2)",
                      border: "1.5px solid var(--border)",
                    }
              }
            >
              <span className="text-base leading-none">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
