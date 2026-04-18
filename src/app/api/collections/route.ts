import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Collection from "@/lib/models/Collection";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const data = await Collection.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    return Response.json({ data });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const collection = await Collection.create(body);
    return Response.json({ data: collection }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to create collection" }, { status: 500 });
  }
}
