"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header
      className="sticky top-0 z-40 h-16"
      style={{
        background: "#111318",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        boxShadow: "0 1px 0 rgba(255,255,255,.04)",
      }}
    >
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 select-none">
          <span className="text-xl">🛍️</span>
          <span className="font-bold text-white text-base">TSN Mart</span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full ml-1"
            style={{ background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.5)" }}
          >
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: pathname === "/admin" ? "rgba(255,255,255,.1)" : "transparent",
              color: pathname === "/admin" ? "white" : "rgba(255,255,255,.45)",
            }}
          >
            <span>📦</span>
            <span>Products</span>
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: pathname === "/admin/customers" ? "rgba(255,255,255,.1)" : "transparent",
              color: pathname === "/admin/customers" ? "white" : "rgba(255,255,255,.45)",
            }}
          >
            <span>🧾</span>
            <span>Orders</span>
          </Link>
          <Link
            href="/"
            className="text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,.3)" }}
          >
            ← Store
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: "rgba(239,68,68,.12)",
              color: "rgba(239,68,68,.8)",
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
