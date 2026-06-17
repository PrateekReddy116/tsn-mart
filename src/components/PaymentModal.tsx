"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";

interface Props {
  onClose: () => void;
  onMethod: (method: "phonepe" | "whatsapp") => void;
}

export default function PaymentModal({ onClose, onMethod }: Props) {
  const { cart, cartSubtotal, cartDiscount, cartTotal } = useCartStore();
  const [showQR, setShowQR] = useState(false);

  const subtotal = cartSubtotal();
  const discount = cartDiscount();
  const total = cartTotal();

  const upiData = `upi://pay?pa=8897162149@ybl&pn=TSN%20Mart&am=${total}&cu=INR&tn=TSNMart%20Order`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(upiData)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-md overflow-y-auto relative"
        style={{
          maxHeight: "90vh",
          boxShadow: "0 25px 60px rgba(0,0,0,.3)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Choose Payment</h2>
            <p className="text-xs text-slate-400 mt-0.5">Select how you&apos;d like to pay</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Order summary */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-slate-600 truncate mr-4">
                  {item.name} <span className="text-slate-400">×{item.cart_qty}</span>
                </span>
                <span className="font-semibold text-slate-800 shrink-0">
                  ₹{item.price * item.cart_qty}
                </span>
              </div>
            ))}
            {discount > 0 && (
              <>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-semibold">
                  <span>🏷️ Discount (10%)</span>
                  <span>−₹{discount}</span>
                </div>
              </>
            )}
            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-800">
              <span>Total</span>
              <span className="text-[#1a3c34]">₹{total}</span>
            </div>
          </div>

          {/* Payment buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => setShowQR(true)}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all active:scale-[.98]"
              style={{
                borderColor: showQR ? "#7c3aed" : "#e2e8f0",
                background: showQR ? "#faf5ff" : "white",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PhonePe_Logo.png/220px-PhonePe_Logo.png"
                alt="PhonePe"
                className="h-8 w-auto shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm">PhonePe / UPI</p>
                <p className="text-xs text-slate-400">Scan QR &amp; pay instantly</p>
              </div>
              <span className="text-slate-300 text-lg shrink-0">›</span>
            </button>

            <button
              onClick={() => onMethod("whatsapp")}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-green-400 hover:bg-green-50 text-left transition-all active:scale-[.98]"
            >
              <span className="text-2xl shrink-0">📲</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm">Order via WhatsApp</p>
                <p className="text-xs text-slate-400">Send order &amp; pay on delivery</p>
              </div>
              <span className="text-slate-300 text-lg shrink-0">›</span>
            </button>
          </div>

          {/* QR Code section */}
          {showQR && (
            <div className="bg-slate-50 rounded-xl p-5 text-center border border-slate-200 space-y-3">
              <div className="flex items-center justify-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PhonePe_Logo.png/220px-PhonePe_Logo.png"
                  alt="PhonePe"
                  className="h-6"
                />
                <span className="font-semibold text-slate-700 text-sm">Scan to Pay</span>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt="UPI QR Code"
                className="mx-auto rounded-xl"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,.1)" }}
              />

              <div className="space-y-0.5">
                <p className="text-xs text-slate-400">
                  UPI ID: <span className="font-semibold text-slate-600">8897162149@ybl</span>
                </p>
                <p className="text-base font-bold text-[#1a3c34]">Pay ₹{total}</p>
                <p className="text-xs text-slate-400">
                  Open PhonePe / GPay / any UPI app and scan
                </p>
              </div>

              <button
                onClick={() => onMethod("phonepe")}
                className="w-full bg-[#1a3c34] hover:bg-[#2a5c4c] active:scale-[.98] text-white font-semibold py-3 rounded-xl transition-all text-sm"
              >
                ✅ I&apos;ve Paid — Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
