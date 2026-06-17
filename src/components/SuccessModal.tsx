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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-sm"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,.25)" }}
      >
        {/* Success icon */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: "#1a3c34" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-9 h-9"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Order Confirmed!</h2>
          <p className="text-sm text-slate-400 text-center leading-relaxed">
            Payment received. We&apos;ll deliver to your address shortly.
          </p>
        </div>

        {/* Details */}
        <div className="mx-6 mb-6 bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-slate-400 shrink-0">Name</span>
            <span className="font-semibold text-slate-800 text-right">{order.name}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400 shrink-0">Address</span>
            <span className="font-medium text-slate-700 text-right">{order.address}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400 shrink-0">Items</span>
            <span className="font-medium text-slate-700 text-right">{order.items}</span>
          </div>
          <div className="flex justify-between gap-3 pt-2 border-t border-slate-200">
            <span className="font-bold text-slate-800">Total Paid</span>
            <span className="font-bold text-[#1a3c34] text-base">₹{order.total}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-400 shrink-0">Payment ID</span>
            <span className="font-mono text-xs text-slate-500 text-right break-all">
              {order.paymentId}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full text-white font-semibold py-3.5 rounded-xl transition-all text-sm active:scale-[.98]"
            style={{ background: "#1a3c34" }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
