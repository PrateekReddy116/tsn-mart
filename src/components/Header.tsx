"use client";

import { Search, Menu, ShoppingCart, User, X, Home, Bookmark, ReceiptText } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import Link from "next/link";

const navItems = [
  { icon: Home, href: "/", label: "Home" },
  { icon: Bookmark, href: "/saved", label: "Saved Items" },
  { icon: ReceiptText, href: "/orders", label: "Past Orders" },
  { icon: User, href: "/profile", label: "Profile" },
];

interface Props {
  search: string;
  onSearch: (v: string) => void;
  onCartToggle: () => void;
  user?: any;
  profile?: any;
}

export default function Header({ search, onSearch, onCartToggle, user, profile }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
      
      {/* Mobile Menu Button (Hamburger) - Only visible on small screens */}
      <button 
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden text-[var(--text2)] p-2 -ml-2 rounded-lg hover:bg-[var(--surface2)]"
      >
        <Menu size={24} />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text3)] pointer-events-none">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search"
          className="w-full pl-11 pr-4 py-2.5 bg-[var(--surface2)] text-[var(--text)] placeholder-[var(--text3)] rounded-full text-sm outline-none focus:ring-2 focus:ring-[var(--brand)] transition-shadow"
        />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <ThemeToggle className="hidden sm:flex" />
        <button onClick={onCartToggle} className="text-[var(--text2)] hover:text-[var(--text)] transition-colors">
          <ShoppingCart size={20} />
        </button>

        {/* Profile */}
        <Link href={user ? "/profile" : "/signin"} className="hidden sm:flex items-center gap-3 pl-2 sm:pl-4 border-l border-[var(--border)] hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-[var(--brand)] flex items-center justify-center text-white font-bold uppercase shadow-sm">
            {profile?.name ? profile.name.charAt(0) : user?.email?.charAt(0) || "G"}
          </div>
          <div className="hidden lg:block text-sm">
            <p className="font-bold text-[var(--text)] leading-none">{profile?.name || "Guest"}</p>
            <p className="text-[11px] text-[var(--text3)] mt-0.5">{user?.email || "Sign in to sync"}</p>
          </div>
        </Link>
      </div>
    </header>

    {/* Mobile Navigation Drawer */}
    {mobileMenuOpen && (
      <div className="fixed inset-0 z-50 flex md:hidden">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Drawer */}
        <div className="relative w-64 max-w-sm bg-[var(--surface)] h-full flex flex-col shadow-2xl transition-transform transform translate-x-0">
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <div className="w-8 h-8 relative">
              <Image src="/logo.png" alt="TSN Mart" fill className="object-contain" />
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 -mr-2 text-[var(--text2)] hover:bg-[var(--surface2)] rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <p className="text-xs font-bold text-[var(--text3)] uppercase tracking-wider mb-4">Menu</p>
            <nav className="flex flex-col gap-2">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                      isActive 
                        ? "bg-[var(--brand)] text-white" 
                        : "text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--text2)]">Dark Mode</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    )}
    </>
  );
}
