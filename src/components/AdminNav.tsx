"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Package, ReceiptText } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header
      className="sticky top-0 z-40 h-16 bg-[var(--surface)] border-b border-[var(--border)] shadow-sm"
    >
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="TSN Mart" className="w-6 h-6 object-contain" />
          <span className="font-bold text-[var(--text)] text-base">TSN Mart</span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full ml-1 bg-[var(--surface2)] text-[var(--text2)]"
          >
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link
            href="/admin"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/admin"
                ? "bg-[var(--brand)] text-white"
                : "text-[var(--text2)] hover:bg-[var(--surface2)]"
            }`}
          >
            <Package size={16} />
            <span>Products</span>
          </Link>
          <Link
            href="/admin/customers"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/admin/customers"
                ? "bg-[var(--brand)] text-white"
                : "text-[var(--text2)] hover:bg-[var(--surface2)]"
            }`}
          >
            <ReceiptText size={16} />
            <span>Orders</span>
          </Link>
          <div className="w-px h-6 bg-[var(--border)] mx-1" />
          <ThemeToggle />
          <Link
            href="/"
            className="text-sm px-3 py-1.5 rounded-lg transition-colors text-[var(--text2)] hover:bg-[var(--surface2)]"
          >
            ← Store
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg transition-colors bg-red-500/10 text-red-500 hover:bg-red-500/20"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
