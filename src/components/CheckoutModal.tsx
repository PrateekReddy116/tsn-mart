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

export default function CheckoutModal({ onClose, onComplete }: Props) {
  const { cart, cartSubtotal, cartDiscount, cartTotal, clearCart } = useCartStore();

  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [address, setAddress] = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cartSubtotal();
  const discount = cartDiscount();
  const total    = cartTotal();

  function validate() {
    if (!name.trim())    { setError("Please enter your name."); return false; }
    if (!/^\d{10}$/.test(phone.trim())) {
      setError("Enter a valid 10-digit phone number."); return false;
    }
    if (!address.trim()) { setError("Please enter your delivery address."); return false; }
    return true;
  }

  async function handlePay() {
    setError("");
    if (!validate()) return;
    setLoading(true);

    try {
      // 1 — Create order on server, which also returns the live key
      const res  = await fetch("/api/razorpay/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ amount: total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create payment order");

      // 2 — Load Razorpay SDK
      await loadRazorpayScript();

      // 3 — Open checkout using keyId returned from server (never a placeholder)
      const options: RazorpayOptions = {
        key:         data.keyId,          // ← server-sourced, always correct
        amount:      data.amount,
        currency:    "INR",
        name:        "TSN Mart",
        description: `Order for ${name.trim()}`,
        order_id:    data.orderId,
        prefill:     { name: name.trim(), contact: phone.trim() },
        theme:       { color: "#1a3c34" },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response: RazorpayResponse) => {
          // Verify signature on server before finalising order
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.verified) {
            setError("Payment could not be verified. Contact support with your payment ID.");
            setLoading(false);
            return;
          }

          await finalise(response.razorpay_payment_id);
        },
      };

      const rzp = new (window as unknown as WindowWithRazorpay).Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  async function finalise(paymentId: string) {
    const itemsList = cart.map((i) => `${i.name} ×${i.cart_qty}`).join(", ");

    // Save order to Supabase (best-effort)
    await fetch("/api/orders", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        customer_name:    name.trim(),
        customer_phone:   phone.trim(),
        customer_address: address.trim(),
        items: cart.map((i) => ({
          product_id:   i.id,
          product_name: i.name,
          price:        i.price,
          qty:          i.cart_qty,
        })),
        subtotal,
        discount,
        total,
        payment_method: "razorpay",
        payment_id:     paymentId,
        status:         "confirmed",
      }),
    });

    // WhatsApp notification to store
    let msg = `🛒 *New Order — TSN Mart*\n\n👤 *${name.trim()}*\n📞 ${phone.trim()}\n📍 ${address.trim()}\n\n`;
    cart.forEach((i) => { msg += `• ${i.name} ×${i.cart_qty} = ₹${i.price * i.cart_qty}\n`; });
    if (discount > 0) msg += `\n🏷️ Discount: −₹${discount}`;
    msg += `\n💰 *Total: ₹${total}*\n💳 Razorpay ✅  ID: ${paymentId}`;
    window.open(`https://wa.me/918897162149?text=${encodeURIComponent(msg)}`, "_blank");

    clearCart();
    onComplete({ name: name.trim(), address: address.trim(), items: itemsList, total, paymentId });
  }

  const inputCls = "w-full px-4 py-3 rounded-2xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors";
  const inputStyle = { background: "#f8fafc", border: "1.5px solid #e2e8f0" };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,.25)", maxHeight: "95vh" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div>
            <h2 className="text-base font-black text-slate-900">Confirm Order</h2>
            <p className="text-xs text-slate-400 mt-0.5">Fill details and pay securely</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            style={{ background: "#f8fafc" }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(95vh - 69px)" }}>
          <div className="px-5 py-4 space-y-4">

            {/* Order summary */}
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Your Order</p>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #f1f5f9" }}>
                {cart.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-2.5"
                    style={{ borderTop: i > 0 ? "1px solid #f8fafc" : undefined }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name}
                      className="w-9 h-9 object-contain rounded-xl shrink-0"
                      style={{ background: "#f8fafc" }}
                    />
                    <span className="flex-1 text-sm font-semibold text-slate-700 truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-400 shrink-0">×{item.cart_qty}</span>
                    <span className="text-sm font-black shrink-0" style={{ color: "#1a3c34" }}>
                      ₹{item.price * item.cart_qty}
                    </span>
                  </div>
                ))}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderTop: "1.5px dashed #e2e8f0", background: "#fafafa" }}
                >
                  {discount > 0 && (
                    <span className="text-xs font-semibold" style={{ color: "#16a34a" }}>
                      🏷️ −₹{discount} discount applied
                    </span>
                  )}
                  <span className="ml-auto text-sm font-black text-slate-900">
                    Total ₹{total}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery details */}
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Deliver To</p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="Full Name *"
                  autoComplete="name"
                  className={inputCls}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#1a3c34")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#e2e8f0")}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                  placeholder="Phone Number (10 digits) *"
                  autoComplete="tel"
                  className={inputCls}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#1a3c34")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#e2e8f0")}
                />
                <textarea
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setError(""); }}
                  placeholder="House / Flat No., Street, Landmark, City *"
                  rows={3}
                  autoComplete="street-address"
                  className={inputCls + " resize-none"}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#1a3c34")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#e2e8f0")}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2 px-4 py-3 rounded-2xl text-sm"
                style={{ background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c" }}
              >
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading || cart.length === 0}
              className="w-full text-white font-black py-4 rounded-2xl transition-all active:scale-[.98] disabled:opacity-60 flex items-center justify-center gap-3 text-sm"
              style={{ background: "#1a3c34" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Opening Payment…</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{total}</span>
                  <span className="opacity-60">·</span>
                  <span className="font-normal opacity-80 text-xs">Razorpay</span>
                  <span>→</span>
                </>
              )}
            </button>

            {/* Trust */}
            <div className="flex items-center justify-center gap-3 pb-2">
              <span className="text-xs text-slate-400">🔒 100% secure</span>
              <span className="text-slate-200">|</span>
              <span className="text-xs text-slate-400">UPI · Cards · Wallets</span>
              <span className="text-slate-200">|</span>
              <span className="text-xs text-slate-400">No data stored</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Razorpay browser SDK types ── */
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
  handler: (r: RazorpayResponse) => void;
}
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: () => void) => void;
}
type WindowWithRazorpay = Window & { Razorpay: new (o: RazorpayOptions) => RazorpayInstance };

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as unknown as WindowWithRazorpay).Razorpay) { resolve(); return; }
    const s   = document.createElement("script");
    s.src     = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(s);
  });
}
