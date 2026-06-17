import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeSync from "@/components/ThemeSync";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TSN Mart",
  description: "Fresh groceries and daily essentials delivered to your doorstep.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
