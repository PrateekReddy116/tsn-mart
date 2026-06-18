import { createClient } from "@/lib/supabase/server";
import OrdersClient from "@/components/OrdersClient";
import { Order } from "@/lib/types";

export default async function CustomersPage() {
  let orders: Order[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      orders = data as Order[];
    }
  } catch {
    // Supabase not configured yet
  }

  return <OrdersClient initialOrders={orders} />;
}
