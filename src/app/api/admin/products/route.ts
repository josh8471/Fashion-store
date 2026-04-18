import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const [data, total] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments({}),
    ]);

    return Response.json({ data, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name?.trim() || !body.price || !body.category?.trim()) {
      return Response.json({ error: "Name, price and category are required" }, { status: 400 });
    }
    body.slug = slugify(body.name);
    const product = await Product.create(body);
    return Response.json({ data: product }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}
