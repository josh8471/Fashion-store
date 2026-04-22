import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/authGuard";
import { productCreateSchema, validationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    const [data, total] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments({}),
    ]);

    return Response.json({ data, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const parsed = productCreateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    await connectDB();
    const product = await Product.create({
      ...parsed.data,
      slug: slugify(parsed.data.name),
    });
    return Response.json({ data: product }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}
