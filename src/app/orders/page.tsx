import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { ReceiptText, CheckCircle, Clock } from "lucide-react";
import { Order } from "@/lib/types";

export default async function PastOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex h-[100dvh] overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          <header className="p-6 border-b border-[var(--border)]">
            <h1 className="text-xl font-bold">Past Orders</h1>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ReceiptText size={48} className="mb-4 text-[var(--text3)] opacity-50" />
            <h2 className="text-xl font-bold mb-2">Sign in to see past orders</h2>
            <p className="text-[var(--text2)] mb-6">Create an account or sign in to track your deliveries.</p>
            <Link 
              href="/signin"
              className="bg-[var(--brand)] text-white font-semibold py-3 px-8 rounded-full shadow-md"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="p-6 border-b border-[var(--border)]">
          <h1 className="text-xl font-bold">Past Orders</h1>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto flex-1">
          {!orders || orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-[var(--text3)]">
              <ReceiptText size={48} className="mb-4 opacity-30" />
              <p className="font-semibold text-lg text-[var(--text2)]">No orders yet</p>
              <p className="text-sm">When you place an order, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: Order) => {
                const date = new Date(order.created_at).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const isOnline = order.payment_method === "razorpay";

                return (
                  <div key={order.id} className="rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-[var(--text3)] mb-1">Order ID: <span className="font-mono text-xs">{order.id.split('-')[0]}</span></p>
                        <p className="text-sm font-semibold">{date}</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-lg font-black text-[var(--brand)]">₹{order.total}</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${
                          isOnline ? "bg-green-500/10 text-green-500" : "bg-[var(--surface2)] text-[var(--text2)]"
                        }`}>
                          {isOnline ? <><CheckCircle size={12} /> Paid Online</> : <><Clock size={12} /> Cash on Delivery</>}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--border)]">
                      <p className="text-xs font-bold text-[var(--text3)] uppercase tracking-wider mb-3">Items</p>
                      <div className="flex flex-wrap gap-2">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="flex items-center gap-2 bg-[var(--surface2)] px-3 py-2 rounded-lg text-sm border border-[var(--border)]">
                            <span className="font-medium">{item.product_name}</span>
                            <span className="text-[var(--text3)] text-xs">×{item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
