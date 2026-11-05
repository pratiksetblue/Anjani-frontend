import mongoose from "mongoose";

const ExhibitorSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

delete mongoose.models.Exhibitor;
export default mongoose.models.Exhibitor || mongoose.model("Exhibitor", ExhibitorSchema);
