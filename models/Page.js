import mongoose from "mongoose";

const PageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    bannerTitle: { type: String },
    bannerImage: { type: String, default: "/assets/img/about-banner.jpg" },
    title: { type: String },
    headline: { type: String },
    description: { type: String },
    paragraphs: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Page || mongoose.model("Page", PageSchema);
