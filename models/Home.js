import mongoose from "mongoose";

const HomeSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: "Engineering the Future of Fabric Dyeing Machinery Since 1990" },
      subtitle: {
        type: String,
        default: "Delivering advanced fabric dyeing machinery trusted by textile manufacturers worldwide for over 36 years.",
      },
      buttonText: { type: String, default: "Learn More" },
      buttonLink: { type: String, default: "/about-us" },
      videoDesktop: { type: String, default: "/assets/video/main.mp4" },
      videoMobile: { type: String, default: "/assets/video/mobile.mp4" },
    },
    about: {
      badge: { type: String, default: "About Our Story" },
      title: { type: String, default: "Anjani – A Leading Manufacturer of Fabric Dyeing Machinery" },
      highlight: { type: String },
      portfolioPrefix: { type: String, default: "Our comprehensive product portfolio includes" },
      productsHighlight: { type: String },
      portfolioSuffix: { type: String, default: "and a wide range of customized textile processing machinery." },
      description: { type: String },
      image: { type: String, default: "/assets/img/home1/about-img.jpg" },
    },
    counters: [
      {
        number: { type: String },
        suffix: { type: String },
        label: { type: String },
      },
    ],
    bannerImage: { type: String, default: "/assets/img/home1/singleimg.jpg" },
    certifications: [
      {
        image: { type: String },
        title: { type: String },
        description: { type: String },
      },
    ],
  },
  { timestamps: true, strict: false }
);

delete mongoose.models.Home;
export default mongoose.models.Home || mongoose.model("Home", HomeSchema);
