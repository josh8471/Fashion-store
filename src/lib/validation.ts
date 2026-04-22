import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid id");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email")
  .max(254);

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[+\d][\d\s-]{6,20}$/, "Invalid phone");

export const nameSchema = z.string().trim().min(2).max(100);

export const productCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  price: z.number().nonnegative().max(10_000_000),
  compareAtPrice: z.number().nonnegative().max(10_000_000).optional(),
  images: z.array(z.string().url()).max(20).default([]),
  category: z.string().trim().min(1).max(100),
  collectionId: objectIdSchema.optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  variants: z
    .array(
      z.object({
        size: z.string().trim().min(1).max(20),
        stock: z.number().int().nonnegative().max(1_000_000),
      })
    )
    .max(50)
    .default([]),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const collectionCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const collectionUpdateSchema = collectionCreateSchema.partial();

export const orderCreateSchema = z.object({
  customer: z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
  }),
  shippingAddress: z.object({
    line1: z.string().trim().min(1).max(200),
    line2: z.string().trim().max(200).optional(),
    city: z.string().trim().min(1).max(100),
    state: z.string().trim().min(1).max(100),
    pincode: z.string().trim().min(3).max(20),
    country: z.string().trim().min(2).max(100).default("India"),
  }),
  items: z
    .array(
      z.object({
        productId: objectIdSchema,
        name: z.string().trim().min(1).max(200),
        image: z.string().url().optional().or(z.literal("")),
        size: z.string().trim().min(1).max(20),
        price: z.number().nonnegative().max(10_000_000),
        quantity: z.number().int().min(1).max(1000),
      })
    )
    .min(1)
    .max(100),
  subtotal: z.number().nonnegative().max(100_000_000),
  shippingCost: z.number().nonnegative().max(10_000_000).default(0),
  total: z.number().nonnegative().max(100_000_000),
});

export const orderStatusUpdateSchema = z.object({
  orderId: objectIdSchema,
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
});

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z.string().min(8).max(128),
});

export const paymentOrderSchema = z.object({
  amount: z.number().positive().max(100_000_000),
  currency: z.string().length(3).default("INR"),
  receipt: z.string().max(40).optional(),
});

export const paymentVerifySchema = z.object({
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_signature: z.string().min(1).max(200),
  orderId: objectIdSchema,
});

export function validationError(error: z.ZodError) {
  return Response.json(
    {
      error: "Validation failed",
      issues: error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    },
    { status: 400 }
  );
}
