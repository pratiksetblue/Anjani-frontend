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

  const descHtml =
    '<p>The <strong style="color: #cb0000;">ANJANI</strong> PLC Based Low Liquor Ratio Sample ECO+ Soft Flow Dyeing Machine is designed for high efficiency fabric dyeing with precision engineering, reliable process performance, and optimized power and water consumption.</p>';

  const res = await Product.findOneAndUpdate(
    { slug: "plc-based-low-liquor-ratio-sample-eco-soft-flow-dyeing-machine" },
    {
      $set: {
        title: "PLC Based Low Liquor Ratio Sample ECO+ Soft Flow Dyeing Machine",
        image: "/assets/img/product/product2.jpg",
        gallery: ["/assets/img/product/product2.jpg"],
        highlights: [
          "Accurate Sample Development",
          "Accurate Color Matching",
          "Low-Tension Fabric Handling",
          "Precise Process Control",
        ],
        paragraphs: [
          "The ANJANI PLC Based Low Liquor Ratio Sample ECO+ Soft Flow Dyeing Machine is designed for high efficiency fabric dyeing with precision engineering, reliable process performance, and optimized power and water consumption.",
        ],
        description: descHtml,
        capacity: "Customized Capacity Available",
        whatsappNumber: "917096007670",
        brochureUrl: "/assets/pdf/U-TYPE-CATALOGUE.pdf",
        keyAdvantages: [
          "Robust SS 316L construction",
          "Short liquor ratio dyeing",
          "Efficient heating & cooling heat exchanger",
          "PLC-based process control",
          "Smooth fabric transport",
        ],
      },
    },
    { new: true }
  );

  console.log("Updated prod-2:", res?.slug, "title:", res?.title, "img:", res?.image);
  await mongoose.disconnect();
}

main().catch(console.error);
