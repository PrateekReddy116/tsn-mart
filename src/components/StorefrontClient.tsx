"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/lib/types";
import Header from "./Header";
import HeroBanner from "./HeroBanner";
import CategoryCards from "./CategoryCards";
import ProductGrid from "./ProductGrid";
import CartSidebar from "./CartSidebar";
import CheckoutModal from "./CheckoutModal";
import SuccessModal from "./SuccessModal";
import Sidebar from "./Sidebar";
import { useCartStore } from "@/lib/store";

const CATEGORY_MAP: Record<string, number[]> = {
  rice: [1, 5, 6],
  dairy: [2, 3],
  bakery: [4],
  personal: [7, 8],
  home: [9],
};

interface Props {
  initialProducts: Product[];
  user?: any;
  profile?: any;
  initialSavedItems?: number[];
}

export default function StorefrontClient({ initialProducts, user, profile, initialSavedItems = [] }: Props) {
  const [products] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<number[]>(initialSavedItems);
  const [successOrder, setSuccessOrder] = useState<{
    name: string;
    address: string;
    items: string;
    total: number;
    paymentId: string;
  } | null>(null);

  const cartCount = useCartStore((s) => s.cartCount());

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
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* Left Sidebar (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
        <Header
          search={search}
          onSearch={setSearch}
          onCartToggle={() => setCartOpen(!cartOpen)}
          user={user}
          profile={profile}
        />

        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto flex-1">
          <HeroBanner profile={profile} />
          
          <div className="mt-8 mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Category</h2>
            <button className="text-sm text-[var(--brand)] font-medium hover:underline">View all</button>
          </div>
          <CategoryCards active={category} onChange={setCategory} />

          <div className="mt-10 mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Trending Products</h2>
          </div>
          <ProductGrid 
            products={filtered} 
            user={user} 
            savedItems={savedItems} 
            setSavedItems={setSavedItems} 
          />
        </main>
      </div>

      {/* Right Cart Sidebar (Desktop persistent, Mobile overlay) */}
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onProceed={handleProceed}
        products={products}
      />

      {/* Mobile Floating Cart Button (only if cart closed) */}
      {!cartOpen && cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--brand)] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-40"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {cartCount}
          </span>
        </button>
      )}

      {checkoutOpen && (
        <CheckoutModal
          user={user}
          profile={profile}
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
