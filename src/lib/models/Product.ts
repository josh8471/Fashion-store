import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  collectionId?: mongoose.Types.ObjectId;
  tags: string[];
  variants: {
    size: string;
    stock: number;
  }[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    images: [{ type: String }],
    category: { type: String, required: true },
    collectionId: { type: Schema.Types.ObjectId, ref: "Collection" },
    tags: [{ type: String }],
    variants: [
      {
        size: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// slug already indexed via unique:true — skip duplicate
ProductSchema.index({ collectionId: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ name: "text", description: "text", tags: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
