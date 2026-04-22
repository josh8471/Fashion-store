import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { requireAdmin } from "@/lib/authGuard";
import {
  collectionUpdateSchema,
  objectIdSchema,
  validationError,
} from "@/lib/validation";

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
    const collection = await Collection.findOne(query).lean();
    if (!collection) return Response.json({ error: "Not found" }, { status: 404 });

    const products = await Product.find({
      collectionId: (collection as unknown as { _id: string })._id,
      isActive: true,
    }).lean();

    return Response.json({ data: collection, products });
  } catch {
    return Response.json({ error: "Failed to fetch collection" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const idParse = objectIdSchema.safeParse(id);
  if (!idParse.success) return validationError(idParse.error);

  const bodyParse = collectionUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!bodyParse.success) return validationError(bodyParse.error);

  try {
    await connectDB();
    const collection = await Collection.findByIdAndUpdate(id, bodyParse.data, {
      new: true,
    });
    if (!collection) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: collection });
  } catch {
    return Response.json({ error: "Failed to update collection" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const idParse = objectIdSchema.safeParse(id);
  if (!idParse.success) return validationError(idParse.error);

  try {
    await connectDB();
    await Collection.findByIdAndUpdate(id, { isActive: false });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete collection" }, { status: 500 });
  }
}
