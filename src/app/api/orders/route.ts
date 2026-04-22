import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { generateOrderNumber } from "@/lib/utils";
import { orderCreateSchema, validationError } from "@/lib/validation";
import { getSessionUser } from "@/lib/authGuard";

export async function POST(req: NextRequest) {
  const parsed = orderCreateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  // Server-side total verification: prevent client-side tampering with prices.
  const computedSubtotal = parsed.data.items.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );
  const computedTotal = computedSubtotal + parsed.data.shippingCost;
  // Allow rounding drift up to 1 unit.
  if (Math.abs(computedSubtotal - parsed.data.subtotal) > 1 || Math.abs(computedTotal - parsed.data.total) > 1) {
    return Response.json({ error: "Order totals do not match items" }, { status: 400 });
  }

  try {
    await connectDB();
    const orderNumber = generateOrderNumber();
    const order = await Order.create({ ...parsed.data, orderNumber });
    return Response.json({ data: order }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const orders = await Order.find({ "customer.email": user.email.toLowerCase() })
      .sort({ createdAt: -1 })
      .lean();
    return Response.json({ data: orders });
  } catch {
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
