import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const orderNumber = generateOrderNumber();
    const order = await Order.create({ ...body, orderNumber });
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
