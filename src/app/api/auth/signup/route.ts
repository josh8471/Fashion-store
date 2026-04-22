import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signupSchema, validationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const parsed = signupSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    await connectDB();

    const existing = await User.findOne({ email: parsed.data.email });
    if (existing) {
      return Response.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(parsed.data.password, 12);
    await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
    });

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Signup failed. Please try again." }, { status: 500 });
  }
}
