"use client";

interface Props {
  order: {
    name: string;
    address: string;
    items: string;
    total: number;
    paymentId: string;
  };
  onClose: () => void;
}

export default function SuccessModal({ order, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,.25)" }}
      >
        {/* Green top strip */}
        <div
          className="flex flex-col items-center py-8 px-6 text-white"
          style={{ background: "linear-gradient(135deg, #14532d, #1a3c34)" }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ background: "rgba(255,255,255,.15)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}
              strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-lg font-black mb-0.5">Order Confirmed! 🎉</h2>
          <p className="text-sm text-white/70 text-center">
            Payment received. We&apos;ll be in touch shortly.
          </p>
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-2.5">
          {[
            { label: "Name",       value: order.name },
            { label: "Address",    value: order.address },
            { label: "Items",      value: order.items },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 text-sm">
              <span className="text-slate-400 shrink-0">{label}</span>
              <span className="font-semibold text-slate-700 text-right">{value}</span>
            </div>
          ))}

          <div
            className="flex justify-between items-center pt-3"
            style={{ borderTop: "1.5px dashed #e2e8f0" }}
          >
            <span className="text-sm font-black text-slate-900">Total Paid</span>
            <span className="text-lg font-black" style={{ color: "#1a3c34" }}>₹{order.total}</span>
          </div>

          <p className="text-[10px] text-slate-300 font-mono break-all pt-1">
            Txn: {order.paymentId}
          </p>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full text-white font-black py-4 rounded-2xl text-sm transition-all active:scale-[.98]"
            style={{ background: "#1a3c34" }}
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    </div>
  );
}
