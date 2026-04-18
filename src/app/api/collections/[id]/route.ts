import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const collection = await Collection.findOne({
      $or: [{ slug: id }, { _id: id.match(/^[a-f\d]{24}$/i) ? id : null }],
      isActive: true,
    }).lean();
    if (!collection) return Response.json({ error: "Not found" }, { status: 404 });

    const products = await Product.find({
      collectionId: (collection as unknown as { _id: string })._id,
      isActive: true,
    }).lean();

    return Response.json({ data: collection, products });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch collection" }, { status: 500 });
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
    const collection = await Collection.findByIdAndUpdate(id, body, { new: true });
    if (!collection) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: collection });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to update collection" }, { status: 500 });
  }
}
