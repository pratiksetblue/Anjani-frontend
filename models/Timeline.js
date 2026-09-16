import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    heading: { type: String, default: "" },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
    isLarge: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

delete mongoose.models.Timeline;
export default mongoose.models.Timeline || mongoose.model("Timeline", TimelineSchema);
