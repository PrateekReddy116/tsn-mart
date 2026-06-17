"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";

interface Props {
  onClose: () => void;
  onComplete: (order: {
    name: string;
    address: string;
    items: string;
    total: number;
    paymentId: string;
  }) => void;
}

type Step = "details" | "paying";

export default function CheckoutModal({ onClose, onComplete }: Props) {
  const { cart, cartSubtotal, cartDiscount, cartTotal, clearCart } = useCartStore();

  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cartSubtotal();
  const discount = cartDiscount();
  const total = cartTotal();

  function validateDetails() {
    if (!name.trim()) { setError("Please enter your name."); return false; }
    if (!phone.trim() || !/^\d{10}$/.test(phone.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }
    if (!address.trim()) { setError("Please enter your delivery address."); return false; }
    return true;
  }

  async function handleProceedToPayment() {
    setError("");
    if (!validateDetails()) return;
    setStep("paying");
    setLoading(true);

    try {
      // 1. Create Razorpay order on server
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create payment order");

      // 2. Load Razorpay SDK and open checkout
      await loadRazorpayScript();

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: "INR",
        name: "TSN Mart",
        description: `Order for ${name.trim()}`,
        order_id: data.orderId,
        prefill: {
          name: name.trim(),
          contact: phone.trim(),
        },
        theme: { color: "#1a3c34" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStep("details");
          },
        },
        handler: async (response: RazorpayResponse) => {
          // 3. Payment succeeded — save order then show success
          await saveOrder(response.razorpay_payment_id);
        },
      };

      const rzp = new (window as unknown as WindowWithRazorpay).Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setStep("details");
      setLoading(false);
    }
  }

  async function saveOrder(paymentId: string) {
    const itemsList = cart.map((i) => `${i.name} ×${i.cart_qty}`).join(", ");

    // Save to Supabase
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
        payment_method: "razorpay",
        payment_id: paymentId,
        status: "confirmed",
      }),
    });

    // Send WhatsApp notification to store
    let msg = `🛒 *New Order — TSN Mart*\n\n👤 *${name.trim()}*\n📞 ${phone.trim()}\n📍 ${address.trim()}\n\n`;
    cart.forEach((item) => {
      msg += `• ${item.name} ×${item.cart_qty} = ₹${item.price * item.cart_qty}\n`;
    });
    msg += `\n🧾 Subtotal: ₹${subtotal}`;
    if (discount > 0) msg += `\n🏷️ Discount (10%): −₹${discount}`;
    msg += `\n💰 *Total: ₹${total}*`;
    msg += `\n💳 Payment: Razorpay ✅ Paid\n🔖 ID: ${paymentId}`;
    window.open(`https://wa.me/918897162149?text=${encodeURIComponent(msg)}`, "_blank");

    clearCart();
    onComplete({ name: name.trim(), address: address.trim(), items: itemsList, total, paymentId });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,.25)", maxHeight: "95vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {/* Step indicator */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: "#1a3c34", color: "white" }}
              >
                1
              </span>
              <span className="text-xs font-medium text-slate-800">Details</span>
              <span className="text-slate-300 mx-1">—</span>
              <span
                className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                style={{
                  background: step === "paying" ? "#1a3c34" : "#e2e8f0",
                  color: step === "paying" ? "white" : "#94a3b8",
                }}
              >
                2
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: step === "paying" ? "#1e293b" : "#94a3b8" }}
              >
                Payment
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(95vh - 65px)" }}>
          <div className="px-6 py-5 space-y-4">
            {/* Order summary — compact */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-1.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Order Summary
              </p>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600 truncate mr-3">
                    {item.name}
                    <span className="text-slate-400 ml-1">×{item.cart_qty}</span>
                  </span>
                  <span className="font-medium text-slate-800 shrink-0">
                    ₹{item.price * item.cart_qty}
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 mt-1 space-y-1">
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Discount (10% off)</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Total</span>
                  <span className="text-[#1a3c34] text-base">₹{total}</span>
                </div>
              </div>
            </div>

            {/* Delivery details form */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Delivery Details
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Full Name *"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#1a3c34] transition-colors"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                placeholder="Phone Number (10 digits) *"
                autoComplete="tel"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#1a3c34] transition-colors"
              />
              <textarea
                value={address}
                onChange={(e) => { setAddress(e.target.value); setError(""); }}
                placeholder="Delivery Address — House No., Street, Area, City *"
                rows={3}
                autoComplete="street-address"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#1a3c34] transition-colors resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <span className="text-red-500 text-sm">⚠</span>
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handleProceedToPayment}
              disabled={loading || cart.length === 0}
              className="w-full text-white font-semibold py-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 active:scale-[.98] disabled:opacity-60"
              style={{ background: "#1a3c34" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Opening Payment…
                </>
              ) : (
                <>
                  Pay ₹{total} securely
                  <span className="text-base">→</span>
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                🔒 Secured by Razorpay
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                ✓ UPI · Cards · NetBanking
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Types for Razorpay browser SDK ──────────────────────────
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; contact: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface WindowWithRazorpay {
  Razorpay: new (options: RazorpayOptions) => { open: () => void };
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as unknown as WindowWithRazorpay).Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}
