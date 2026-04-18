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
    // support lookup by slug or _id
    const product = await Product.findOne({
      $or: [{ slug: id }, { _id: id.match(/^[a-f\d]{24}$/i) ? id : null }],
      isActive: true,
    }).lean();
    if (!product) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: product });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: product });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Product.findByIdAndUpdate(id, { isActive: false });
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
