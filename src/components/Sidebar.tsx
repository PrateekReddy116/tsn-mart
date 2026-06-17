"use client";

import { 
  Home, 
  Bookmark, 
  ReceiptText,
  User 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, href: "/" },
  { icon: Bookmark, href: "/saved" },
  { icon: ReceiptText, href: "/orders" },
  { icon: User, href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-20 h-full border-r border-[var(--border)] bg-[var(--surface)] items-center py-6">
      {/* Logo */}
      <div className="w-10 h-10 relative mb-8">
        <Image src="/logo.png" alt="TSN Mart" fill className="object-contain" priority />
      </div>

      {/* Nav Icons */}
      <nav className="flex flex-col gap-4 overflow-y-auto scrollbar-hide flex-1">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={i}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${
                isActive 
                  ? "bg-[var(--brand)] text-white shadow-md" 
                  : "text-[var(--text3)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
