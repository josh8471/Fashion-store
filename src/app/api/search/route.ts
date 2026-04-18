import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    if (!q) return Response.json({ data: [] });

    const data = await Product.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(20)
      .lean();

    return Response.json({ data });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
