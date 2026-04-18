import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { customer, shippingAddress, items, subtotal, shippingCost, total } = body;

    if (!customer?.name?.trim() || !customer?.email?.trim() || !customer?.phone?.trim()) {
      return Response.json({ error: "Customer name, email and phone are required" }, { status: 400 });
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(customer.email)) {
      return Response.json({ error: "Invalid customer email" }, { status: 400 });
    }
    if (!shippingAddress?.line1?.trim() || !shippingAddress?.city?.trim() || !shippingAddress?.state?.trim() || !shippingAddress?.pincode?.trim()) {
      return Response.json({ error: "Shipping address is incomplete" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ error: "Order must have at least one item" }, { status: 400 });
    }
    for (const item of items) {
      if (!item.productId || !item.name || !item.size || item.price == null || item.quantity == null) {
        return Response.json({ error: "Each item must have productId, name, size, price and quantity" }, { status: 400 });
      }
      if (item.price < 0 || item.quantity < 1) {
        return Response.json({ error: "Invalid item price or quantity" }, { status: 400 });
      }
    }
    if (typeof subtotal !== "number" || typeof total !== "number" || total < 0) {
      return Response.json({ error: "Invalid order totals" }, { status: 400 });
    }

    await connectDB();
    const orderNumber = generateOrderNumber();
    const order = await Order.create({ customer, shippingAddress, items, subtotal, shippingCost, total, orderNumber });
    return Response.json({ data: order }, { status: 201 });
  } catch (err) {
    console.error("ORDER CREATE ERROR:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: "Failed to create order", details: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const filter = email ? { "customer.email": email } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    return Response.json({ data: orders });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
