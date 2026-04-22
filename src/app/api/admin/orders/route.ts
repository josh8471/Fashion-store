import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { requireAdmin } from "@/lib/authGuard";
import { orderStatusUpdateSchema, validationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
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
  } catch {
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const parsed = orderStatusUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(
      parsed.data.orderId,
      { status: parsed.data.status },
      { new: true }
    );
    if (!order) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: order });
  } catch {
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
