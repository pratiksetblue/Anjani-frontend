import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, default: "" },
    gallery: [{ type: String }],
    highlights: [{ type: String }],
    paragraphs: [{ type: String }],
    description: { type: String, default: "" },
    capacity: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    brochureUrl: { type: String, default: "" },
    keyAdvantages: [{ type: String }],
    spaceModel: [
      {
        model: { type: String, default: "" },
        capacity: { type: String, default: "" },
        width: { type: String, default: "" },
        length: { type: String, default: "" },
        breadth: { type: String, default: "" },
        height: { type: String, default: "" },
      },
    ],
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
