"use client";

import { Category } from "@/lib/types";

const CATEGORIES: { key: Category; emoji: string; label: string }[] = [
  { key: "all",      emoji: "🏪", label: "All" },
  { key: "rice",     emoji: "🌾", label: "Rice & Grains" },
  { key: "dairy",    emoji: "🥛", label: "Dairy" },
  { key: "bakery",   emoji: "🍞", label: "Bakery" },
  { key: "personal", emoji: "🧴", label: "Personal Care" },
  { key: "home",     emoji: "🏠", label: "Home" },
];

interface Props {
  active: Category;
  onChange: (cat: Category) => void;
}

export default function CategoryChips({ active, onChange }: Props) {
  return (
    <div
      id="products"
      className="sticky top-16 z-30 bg-white"
      style={{ borderBottom: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,.06)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className={[
              "shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all select-none",
              active === cat.key
                ? "bg-[#1a3c34] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            ].join(" ")}
          >
            <span className="text-base leading-none">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
