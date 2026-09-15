import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    name: { type: String, default: "Valued Customer" },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "General Inquiry" },
    message: { type: String, default: "" },
    type: { type: String, enum: ["Inquiry", "Newsletter"], default: "Inquiry" },
    productSlug: { type: String, default: "" },
    productTitle: { type: String, default: "" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Resolved"],
      default: "New",
    },
  },
  { timestamps: true, strict: false }
);

delete mongoose.models.Inquiry;
export default mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
