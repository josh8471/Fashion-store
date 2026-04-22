import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    const query: Record<string, unknown> = isObjectId
      ? { $or: [{ slug: id }, { _id: id }], isActive: true }
      : { slug: id, isActive: true };
    const product = await Product.findOne(query).lean();
    if (!product) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: product });
  } catch {
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
