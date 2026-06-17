"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";

interface Props {
  method: "phonepe" | "whatsapp";
  onClose: () => void;
  onComplete: (order: {
    name: string;
    address: string;
    items: string;
    total: number;
    method: string;
  }) => void;
}

export default function CustomerModal({ method, onClose, onComplete }: Props) {
  const { cart, cartSubtotal, cartDiscount, cartTotal, clearCart } = useCartStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const subtotal = cartSubtotal();
      const discount = cartDiscount();
      const total = cartTotal();

      // Save to Supabase (best-effort)
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_address: address.trim(),
          items: cart.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            qty: item.cart_qty,
          })),
          subtotal,
          discount,
          total,
          payment_method: method,
          status: "pending",
        }),
      });

      // Build WhatsApp message
      let msg = `🛒 *New Order from TSN Mart*\n\n👤 *${name.trim()}*\n📞 ${phone.trim()}\n📍 ${address.trim()}\n\n`;
      cart.forEach((item) => {
        msg += `• ${item.name} ×${item.cart_qty} = ₹${item.price * item.cart_qty}\n`;
      });
      msg += `\n🧾 Subtotal: ₹${subtotal}`;
      if (discount > 0) msg += `\n🏷️ Discount (10%): −₹${discount}`;
      msg += `\n💰 *Total: ₹${total}*`;
      msg += `\n💳 Payment: ${method === "phonepe" ? "PhonePe / UPI ✅ Paid" : "Cash on Delivery"}`;

      const itemsList = cart.map((i) => `${i.name} ×${i.cart_qty}`).join(", ");

      window.open(`https://wa.me/918897162149?text=${encodeURIComponent(msg)}`, "_blank");

      clearCart();
      onComplete({ name: name.trim(), address: address.trim(), items: itemsList, total, method });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-sm"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,.3)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Your Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">So we know where to deliver</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name *"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#1a3c34] focus:bg-white transition-colors"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number *"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#1a3c34] focus:bg-white transition-colors"
          />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Delivery Address *"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#1a3c34] focus:bg-white transition-colors resize-none"
          />

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-[#1a3c34] hover:bg-[#2a5c4c] active:scale-[.98] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all text-sm mt-1"
          >
            {loading ? "Placing Order…" : "Confirm Order ✅"}
          </button>
        </div>
      </div>
    </div>
  );
}
