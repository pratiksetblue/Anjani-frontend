import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://nikunjhapani703560_db_user:I5r46ftWSjuI2PbV@setblue.fdvaydt.mongodb.net/anjani_industries";

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

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const richDescription = `<p>The <span class="red fw-semibold" style="color: #cb0000; font-weight: 600;">ANJANI</span> <span class="green fw-semibold" style="color: #00B050; font-weight: 600;">ECO+</span> <strong style="font-weight: 600;">Soft Flow Dyeing Machine</strong> is designed to deliver efficient fabric dyeing with a <strong style="font-weight: 600;">low liquor ratio, reduced process time and optimized energy consumption</strong>. Developed with modern soft-flow technology, ECO+ combines controlled fabric movement, automatic nozzle adjustment and efficient dye-liquor circulation for consistent processing across a wide range of fabric types.</p><p>The machine is designed to process fabrics from <strong style="font-weight: 600;">low GSM to high GSM</strong> and incorporates <strong style="font-weight: 600;">Double Rope Dyeing Technology</strong>, providing flexibility for different fabric constructions and production requirements.</p>`;

  const res = await Product.findOneAndUpdate(
    { slug: "plc-based-low-liquor-ratio-eco-soft-flow-dyeing-machine" },
    {
      $set: {
        description: richDescription,
        paragraphs: [
          richDescription.split("</p><p>")[0] + "</p>",
          "<p>" + richDescription.split("</p><p>")[1],
        ],
      },
    },
    { returnDocument: "after" }
  );

  console.log("Updated prod-1 rich description successfully:", res?.slug);
  await mongoose.disconnect();
}

main().catch(console.error);
