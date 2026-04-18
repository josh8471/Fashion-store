import { NextRequest } from "next/server";
import getRazorpay from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount < 1) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    return Response.json({ data: order });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
