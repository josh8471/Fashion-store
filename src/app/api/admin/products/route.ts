import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

// Admin: get all products (including inactive)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const [data, total] = await Promise.all([
      Product.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments({}),
    ]);

    return Response.json({ data, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
