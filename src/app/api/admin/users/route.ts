import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const [users, total] = await Promise.all([
      User.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments({}),
    ]);

    const emails = users.map((u) => u.email);
    const orderCounts = await Order.aggregate([
      { $match: { "customer.email": { $in: emails } } },
      { $group: { _id: "$customer.email", count: { $sum: 1 }, total: { $sum: "$total" } } },
    ]);
    const orderMap = Object.fromEntries(orderCounts.map((o) => [o._id, o]));

    const data = users.map((u) => ({
      ...u,
      orderCount: orderMap[u.email]?.count ?? 0,
      totalSpent: orderMap[u.email]?.total ?? 0,
    }));

    return Response.json({ data, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
