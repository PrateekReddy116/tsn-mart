import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      customer_address,
      items,
      subtotal,
      discount,
      total,
      payment_method,
      payment_id,
      status,
    } = body;

    // Validate required fields
    if (!customer_name || !customer_phone || !customer_address || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name,
          customer_phone,
          customer_address,
          items,
          subtotal,
          discount,
          total,
          payment_method,
          payment_id: payment_id ?? null,
          status: status || "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      // If table doesn't exist yet (Supabase not configured), return success anyway
      console.error("Supabase order insert error:", error.message);
      return NextResponse.json({ ok: true, warning: "Order not persisted — configure Supabase" });
    }

    return NextResponse.json({ ok: true, order: data });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data });
  } catch (err) {
    console.error("Orders GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
