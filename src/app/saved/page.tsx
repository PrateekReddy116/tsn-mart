import { createClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import StorefrontClient from "@/components/StorefrontClient";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";

export default async function SavedItemsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex h-[100dvh] overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          {/* We use a mock header for non-client server page, but it's better to just render a simple one */}
          <header className="p-6 border-b border-[var(--border)]">
            <h1 className="text-xl font-bold">Saved Items</h1>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Bookmark size={48} className="mb-4 text-[var(--text3)] opacity-50" />
            <h2 className="text-xl font-bold mb-2">Sign in to see saved items</h2>
            <p className="text-[var(--text2)] mb-6">Create an account or sign in to sync your wishlist.</p>
            <Link 
              href="/signin"
              className="bg-[var(--brand)] text-white font-semibold py-3 px-8 rounded-full shadow-md"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch saved items
  const { data: savedIds } = await supabase
    .from("saved_items")
    .select("product_id")
    .eq("user_id", user.id);

  const ids = savedIds?.map((s) => s.product_id) || [];

  let products: Product[] = [];
  if (ids.length > 0) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .in("id", ids);
    products = data || [];
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="p-6 border-b border-[var(--border)]">
          <h1 className="text-xl font-bold">Saved Items</h1>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-[var(--text3)]">
              <Bookmark size={48} className="mb-4 opacity-30" />
              <p className="font-semibold text-lg text-[var(--text2)]">No saved items yet</p>
              <p className="text-sm">Items you save will appear here.</p>
            </div>
          ) : (
            <ProductGrid products={products} user={user} savedItems={ids} />
          )}
        </main>
      </div>
    </div>
  );
}
