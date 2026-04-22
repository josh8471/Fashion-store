import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { verifyRazorpaySignature } from "@/lib/utils";
import { paymentVerifySchema, validationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const parsed = paymentVerifySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
    parsed.data;

  const isValid = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );
  if (!isValid) {
    return Response.json({ error: "Payment verification failed" }, { status: 400 });
  }

  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "paid",
        status: "confirmed",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

    return Response.json({ success: true, orderNumber: order.orderNumber });
  } catch {
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
