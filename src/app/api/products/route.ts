import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const collection = searchParams.get("collection");
    const category = searchParams.get("category");
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const sort = searchParams.get("sort") || "createdAt";

    const filter: Record<string, unknown> = { isActive: true };
    if (featured === "true") filter.isFeatured = true;
    if (collection && /^[a-f\d]{24}$/i.test(collection)) filter.collectionId = collection;
    if (category) filter.category = category;

    const sortMap: Record<string, [string, 1 | -1][]> = {
      createdAt: [["createdAt", -1]],
      priceAsc: [["price", 1]],
      priceDesc: [["price", -1]],
      name: [["name", 1]],
    };

    const [data, total] = await Promise.all([
      Product.find(filter)
        .sort(sortMap[sort] || { createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return Response.json({ data, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
