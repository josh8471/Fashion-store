import { connectDB } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectDB();
    const [orderStats, totalProducts, totalUsers] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$total" },
            pendingOrders: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
            paidOrders: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] } },
          },
        },
      ]),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({}),
    ]);

    const stats = orderStats[0] || { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, paidOrders: 0 };

    return Response.json({
      totalOrders: stats.totalOrders,
      totalRevenue: stats.totalRevenue,
      pendingOrders: stats.pendingOrders,
      paidOrders: stats.paidOrders,
      totalProducts,
      totalUsers,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
