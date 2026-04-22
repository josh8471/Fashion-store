import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/authGuard";
import {
  objectIdSchema,
  productUpdateSchema,
  validationError,
} from "@/lib/validation";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const idParse = objectIdSchema.safeParse(id);
  if (!idParse.success) return validationError(idParse.error);

  const bodyParse = productUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!bodyParse.success) return validationError(bodyParse.error);

  try {
    await connectDB();
    const update: Record<string, unknown> = { ...bodyParse.data };
    if (bodyParse.data.name) update.slug = slugify(bodyParse.data.name);
    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: product });
  } catch {
    return Response.json({ error: "Failed to update product" }, { status: 500 });
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
    await Product.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
