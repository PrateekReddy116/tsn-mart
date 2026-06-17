"use client";

import { Search, Menu, ShoppingCart, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

import Link from "next/link";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  onCartToggle: () => void;
  user?: any;
  profile?: any;
}

export default function Header({ search, onSearch, onCartToggle, user, profile }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
      
      {/* Mobile Menu Button (Hamburger) - Only visible on small screens */}
      <button className="md:hidden text-[var(--text2)] p-2 -ml-2 rounded-lg hover:bg-[var(--surface2)]">
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
  );
}
