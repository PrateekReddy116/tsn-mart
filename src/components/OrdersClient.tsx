"use client";

import { useState, useMemo } from "react";
import { Order } from "@/lib/types";
import { ReceiptText, Users, Banknote, Trash2, Inbox, Phone, MapPin, CheckCircle, Clock } from "lucide-react";

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

  const inputCls =
    "px-4 py-2.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text3)] text-sm outline-none focus:border-[var(--brand)] transition-colors";

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl p-6 bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-lg shadow-fuchsia-500/20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4">
              <ReceiptText size={24} className="text-white" />
            </div>
            <div className="text-4xl font-black mb-1">{orders.length}</div>
            <div className="text-fuchsia-100 font-medium">Total Orders</div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
            <ReceiptText size={140} strokeWidth={1} />
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4">
              <Users size={24} className="text-white" />
            </div>
            <div className="text-4xl font-black mb-1">{uniqueCustomers}</div>
            <div className="text-cyan-100 font-medium">Unique Customers</div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
            <Users size={140} strokeWidth={1} />
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4">
              <Banknote size={24} className="text-white" />
            </div>
            <div className="text-4xl font-black mb-1">₹{totalRevenue}</div>
            <div className="text-amber-100 font-medium">Total Revenue</div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
            <Banknote size={140} strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone…"
          className={`${inputCls} flex-1 w-full sm:w-auto`}
        />
        <div className="flex w-full sm:w-auto gap-3">
          <select
            value={payFilter}
            onChange={(e) => setPayFilter(e.target.value)}
            className={`${inputCls} flex-1 sm:flex-none cursor-pointer`}
          >
            <option value="all">All Payments</option>
            <option value="razorpay">Online (Razorpay)</option>
            <option value="whatsapp">Cash on Delivery</option>
          </select>
          <button
            onClick={clearAllOrders}
            disabled={clearing}
            className="flex items-center justify-center gap-1.5 text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 bg-red-500/10 text-red-500 hover:bg-red-500/20"
          >
            <Trash2 size={16} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Orders list */}
      <div className="rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        <h2 className="text-base font-semibold text-[var(--text)] mb-5">Order History</h2>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 text-[var(--text3)]">
            <Inbox size={48} strokeWidth={1.5} className="mb-4 opacity-30" />
            <p className="text-sm">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
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
                  className="rounded-xl p-5 bg-[var(--surface2)] border border-[var(--border)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Customer info */}
                    <div className="space-y-1">
                      <p className="font-semibold text-[var(--text)] text-base">{order.customer_name}</p>
                      <p className="text-sm text-[var(--text2)] flex items-center gap-1.5">
                        <Phone size={14} /> {order.customer_phone}
                      </p>
                      <p className="text-sm text-[var(--text2)] flex items-start gap-1.5 mt-1">
                        <MapPin size={14} className="shrink-0 mt-0.5" /> <span>{order.customer_address}</span>
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="sm:text-right space-y-1.5 flex flex-col sm:items-end">
                      <p className="text-xl font-bold text-[var(--text)]">₹{order.total}</p>
                      <p className="text-xs text-[var(--text3)]">{date}</p>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${
                          isOnline
                            ? "bg-green-500/10 text-green-500"
                            : "bg-[var(--border2)] text-[var(--text2)]"
                        }`}
                      >
                        {isOnline ? (
                          <><CheckCircle size={12} /> Paid Online</>
                        ) : (
                          <><Clock size={12} /> Cash on Delivery</>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap gap-2">
                    {(order.items || []).map((item, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--surface)] text-[var(--text2)] border border-[var(--border)]"
                      >
                        {item.product_name} <span className="opacity-60 text-xs ml-0.5">×{item.qty}</span>
                      </span>
                    ))}
                  </div>

                  {/* Payment ID for online orders */}
                  {isOnline && (order as Order & { payment_id?: string }).payment_id && (
                    <p className="mt-3 text-xs font-mono text-[var(--text3)] break-all">
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
