"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/lib/types";
import Header from "./Header";
import HeroBanner from "./HeroBanner";
import CategoryChips from "./CategoryChips";
import ProductGrid from "./ProductGrid";
import CartSidebar from "./CartSidebar";
import CheckoutModal from "./CheckoutModal";
import SuccessModal from "./SuccessModal";

const CATEGORY_MAP: Record<string, number[]> = {
  rice: [1, 5, 6],
  dairy: [2, 3],
  bakery: [4],
  personal: [7, 8],
  home: [9],
};

interface Props {
  initialProducts: Product[];
}

export default function StorefrontClient({ initialProducts }: Props) {
  const [products] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{
    name: string;
    address: string;
    items: string;
    total: number;
    paymentId: string;
  } | null>(null);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "all") {
      const ids = CATEGORY_MAP[category] || [];
      list = list.filter((p) => ids.includes(p.id) || p.category === category);
    }
    if (search) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [products, category, search]);

  function handleProceed() {
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header
        search={search}
        onSearch={setSearch}
        onCartToggle={() => setCartOpen(true)}
      />

      <HeroBanner />

      <CategoryChips active={category} onChange={setCategory} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-800">You might need</h2>
          <span className="text-sm text-slate-400">{filtered.length} items</span>
        </div>
        <ProductGrid products={filtered} />
      </main>

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onProceed={handleProceed}
        products={products}
      />

      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
          onComplete={(order) => {
            setCheckoutOpen(false);
            setSuccessOrder(order);
          }}
        />
      )}

      {successOrder && (
        <SuccessModal
          order={successOrder}
          onClose={() => setSuccessOrder(null)}
        />
      )}
    </div>
  );
}
