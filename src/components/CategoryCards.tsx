"use client";

import { Category } from "@/lib/types";

export const CATEGORIES: {
  key: Category;
  label: string;
  image: string;
}[] = [
  { key: "all",      label: "All",           image: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png" },
  { key: "rice",     label: "Rice & Grains", image: "https://cdn-icons-png.flaticon.com/512/2821/2821808.png" },
  { key: "dairy",    label: "Dairy",         image: "https://cdn-icons-png.flaticon.com/512/869/869502.png" },
  { key: "bakery",   label: "Bakery",        image: "https://cdn-icons-png.flaticon.com/512/3081/3081907.png" },
  { key: "personal", label: "Personal",      image: "https://cdn-icons-png.flaticon.com/512/2611/2611116.png" },
  { key: "home",     label: "Home",          image: "https://cdn-icons-png.flaticon.com/512/6122/6122754.png" },
];

interface Props {
  active: Category;
  onChange: (cat: Category) => void;
}

export default function CategoryCards({ active, onChange }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 pb-4">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className={`shrink-0 flex flex-col items-center justify-center p-4 rounded-3xl w-28 h-32 transition-all active:scale-95 ${
              isActive
                ? "bg-[var(--brand)] text-white shadow-md scale-105"
                : "bg-[var(--surface)] text-[var(--text2)] shadow-sm hover:shadow-md border border-[var(--border)]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={cat.image} 
              alt={cat.label} 
              className={`w-14 h-14 object-contain mb-3 ${isActive ? "drop-shadow-md brightness-0 invert" : ""}`}
            />
            <span className="text-xs font-semibold text-center leading-tight">
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
