import { NextRequest } from "next/server";
import getRazorpay from "@/lib/razorpay";
import { paymentOrderSchema, validationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const parsed = paymentOrderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(parsed.data.amount * 100),
      currency: parsed.data.currency,
      receipt: parsed.data.receipt || `rcpt_${Date.now()}`,
    });

    return Response.json({ data: order });
  } catch {
    return Response.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
