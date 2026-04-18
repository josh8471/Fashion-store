import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");

    const filter = status ? { status } : {};
    const [data, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return Response.json({ data, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { orderId, status } = await req.json();
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: order });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
