import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local" },
        { status: 500 }
      );
    }

    // Instantiate lazily so missing keys don't crash the module
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // Razorpay expects amount in paise (₹1 = 100 paise)
    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100),
      currency: "INR",
      receipt:  `tsn_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount:  order.amount,
      keyId,          // send key back so client is always in sync with server
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Payment gateway error" }, { status: 500 });
  }
}
