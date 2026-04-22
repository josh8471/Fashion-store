import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Collection from "@/lib/models/Collection";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/authGuard";
import { collectionCreateSchema, validationError } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    const data = await Collection.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    return Response.json({ data });
  } catch {
    return Response.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const parsed = collectionCreateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    await connectDB();
    const collection = await Collection.create({
      ...parsed.data,
      slug: slugify(parsed.data.name),
    });
    return Response.json({ data: collection }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create collection" }, { status: 500 });
  }
}
