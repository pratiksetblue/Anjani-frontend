import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, default: "/assets/img/product/product1.jpg" },
    gallery: [{ type: String }],
    highlights: [{ type: String }],
    paragraphs: [{ type: String }],
    capacity: { type: String, default: "Customized Capacity Available" },
    whatsappNumber: { type: String, default: "917096007670" },
    brochureUrl: { type: String, default: "/assets/pdf/U-TYPE-CATALOGUE.pdf" },
    keyAdvantages: [{ type: String }],
    spaceModel: [
      {
        model: { type: String },
        capacity: { type: String },
        width: { type: String },
        length: { type: String },
        breadth: { type: String },
        height: { type: String },
      },
    ],
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
