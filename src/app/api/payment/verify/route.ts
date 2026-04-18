import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { verifyRazorpaySignature } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, // our MongoDB order _id
    } = await req.json();

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return Response.json({ error: "Payment verification failed" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "paid",
        status: "confirmed",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

    return Response.json({ success: true, orderNumber: order.orderNumber });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
