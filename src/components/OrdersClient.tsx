"use client";

import { useState, useMemo } from "react";
import { Order } from "@/lib/types";

interface Props {
  initialOrders: Order[];
}

export default function OrdersClient({ initialOrders }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [payFilter, setPayFilter] = useState("all");
  const [clearing, setClearing] = useState(false);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !search ||
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_phone.includes(search);
      const matchPay = payFilter === "all" || o.payment_method === payFilter;
      return matchSearch && matchPay;
    });
  }, [orders, search, payFilter]);

  const uniqueCustomers = useMemo(
    () => new Set(orders.map((o) => o.customer_phone)).size,
    [orders]
  );
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.total || 0), 0),
    [orders]
  );

  async function clearAllOrders() {
    if (!confirm("Clear all order history? This cannot be undone.")) return;
    setClearing(true);
    try {
      setOrders([]);
    } finally {
      setClearing(false);
    }
  }

  const inputStyle = {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.08)",
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: "🧾", num: orders.length, label: "Total Orders" },
          { icon: "👥", num: uniqueCustomers, label: "Unique Customers" },
          { icon: "💰", num: `₹${totalRevenue}`, label: "Total Revenue" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" }}
          >
            <span className="text-3xl">{s.icon}</span>
            <div>
              <div className="text-2xl font-bold text-white">{s.num}</div>
              <div className="text-sm" style={{ color: "rgba(255,255,255,.4)" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone…"
          className="flex-1 min-w-48 px-4 py-2.5 rounded-lg text-white placeholder-white/25 text-sm outline-none"
          style={inputStyle}
        />
        <select
          value={payFilter}
          onChange={(e) => setPayFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-white text-sm outline-none"
          style={{ background: "#111318", border: "1px solid rgba(255,255,255,.08)" }}
        >
          <option value="all">All Payments</option>
          <option value="razorpay">Razorpay (Online)</option>
          <option value="whatsapp">Cash on Delivery</option>
        </select>
        <button
          onClick={clearAllOrders}
          disabled={clearing}
          className="text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          style={{ background: "rgba(239,68,68,.12)", color: "rgba(239,68,68,.8)" }}
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Orders list */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}
      >
        <h2 className="text-base font-semibold text-white mb-5">Order History</h2>

        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "rgba(255,255,255,.2)" }}>
            <div className="text-5xl mb-3">📭</div>
            <p className="text-sm">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const date = new Date(order.created_at).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              const isOnline = order.payment_method === "razorpay";

              return (
                <div
                  key={order.id}
                  className="rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)" }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* Customer info */}
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white text-sm">{order.customer_name}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,.4)" }}>
                        📞 {order.customer_phone}
                      </p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,.4)" }}>
                        📍 {order.customer_address}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="text-right space-y-1.5">
                      <p className="text-lg font-bold text-white">₹{order.total}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,.3)" }}>{date}</p>
                      <span
                        className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={
                          isOnline
                            ? { background: "rgba(34,197,94,.15)", color: "#4ade80" }
                            : { background: "rgba(148,163,184,.12)", color: "rgba(148,163,184,.8)" }
                        }
                      >
                        {isOnline ? "✅ Paid Online" : "Cash on Delivery"}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(order.items || []).map((item, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(255,255,255,.07)", color: "rgba(255,255,255,.55)" }}
                      >
                        {item.product_name} ×{item.qty}
                      </span>
                    ))}
                  </div>

                  {/* Payment ID for online orders */}
                  {isOnline && (order as Order & { payment_id?: string }).payment_id && (
                    <p
                      className="mt-2 text-xs font-mono"
                      style={{ color: "rgba(255,255,255,.2)" }}
                    >
                      ID: {(order as Order & { payment_id?: string }).payment_id}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
