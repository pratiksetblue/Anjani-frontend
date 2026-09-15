import mongoose from "mongoose";

const SeoSchema = new mongoose.Schema(
  {
    siteUrl: { type: String, default: "https://www.anjaniindustries.in" },
    metaTitle: {
      type: String,
      default: "Anjani Industries | Fabric Dyeing Machinery Manufacturer",
    },
    metaDescription: {
      type: String,
      default:
        "Anjani Industries is a leading manufacturer of advanced fabric dyeing machinery in India since 1990. Explore eco soft flow, jet dyeing, and textile processing machines.",
    },
    metaKeywords: {
      type: String,
      default:
        "fabric dyeing machine, textile machinery, jet dyeing machine, eco soft flow dyeing, weight reduction machine, caustic recovery plant, surat textile machinery",
    },
    ogImage: {
      type: String,
      default: "/assets/img/logo.png",
    },
    pagesSeo: [
      {
        path: { type: String, required: true },
        pageName: { type: String, required: true },
        metaTitle: { type: String },
        metaDescription: { type: String },
        metaKeywords: { type: String },
      },
    ],
    googleAnalytics: {
      enabled: { type: Boolean, default: true },
      measurementId: { type: String, default: "G-NW6Z613EES" },
      googleSiteVerification: {
        type: String,
        default: "gzbGX_Ws9uHs_D0iP2jcKLR7rkKrX3C4iK5sgpa0nAM",
      },
      headCustomScripts: { type: String, default: "" },
    },
    robotsTxt: {
      enabled: { type: Boolean, default: true },
      content: {
        type: String,
        default: `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://www.anjaniindustries.in/sitemap.xml`,
      },
    },
    sitemap: {
      autoGenerateProducts: { type: Boolean, default: true },
      autoGeneratePages: { type: Boolean, default: true },
      extraUrls: [
        {
          url: { type: String },
          changefreq: { type: String, default: "weekly" },
          priority: { type: String, default: "0.8" },
        },
      ],
    },
    llmsTxt: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "Anjani Industries - Fabric Dyeing Machinery" },
      summary: {
        type: String,
        default:
          "Anjani Industries is one of India's leading manufacturers of textile dyeing and processing machinery, established in 1990 in Surat, Gujarat.",
      },
      content: {
        type: String,
        default: `# Anjani Industries

> Leading manufacturer of advanced fabric dyeing and textile processing machinery since 1990.

## Overview
- **Headquarters**: Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India.
- **Experience**: 36+ Years of Industry Excellence
- **Website**: https://www.anjaniindustries.in
- **Email**: anjani_ind@yahoo.com
- **WhatsApp/Phone**: +91 8154 888 370 / +91 7096 007 670

## Key Machinery Catalog
1. **PLC Based Low Liquor Ratio ECO+ Soft Flow Dyeing Machine**: Capacity 150 Kg to 2000 Kg, low liquor ratio 1:4 to 1:6, SS 316L construction.
2. **PLC Based Low Liquor Ratio Sample ECO+ Soft Flow Dyeing Machine**: Capacity 10 Kg to 100 Kg for laboratory and sampling.
3. **PLC Based U Type Rapid Jet Dyeing Machine**: Fast liquor circulation, energy efficient.
4. **PLC Based U Type Soft Flow Dyeing Machine**: Gentle fabric transport for delicate fabrics.
5. **PLC Based U Type Sample Jet Dyeing Machine**: High quality sample batches.
6. **PLC Based Long Tube Rapid Jet Dyeing Machine**: Ideal for heavy woven and knit fabrics.
7. **PLC Based Long Tube Rapid Jet Dyeing - One Autoclave Two Tubes**: Double tube continuous dyeing.
8. **PLC Based Long Tube Soft Flow Dyeing Machine**: Optimized flow dynamics.
9. **PLC Based Long Tube Rapid Jet Dyeing - Two Autoclave Two Tubes**: High-capacity industrial dyeing.
10. **PLC Based Long Tube Sample Jet Dyeing Machine**: R&D sampling unit.
11. **PLC Based Weight Reduction Machine with Caustic Recovery Unit**: For polyester fabric weight reduction and scouring.
12. **Fully Automatic Caustic Recovery Plant**: Sustainable recovery and reuse of caustic soda with up to 85% efficiency.

## Accreditations
- ISO 9001:2015 Certified
- GO GREEN Sustainable Manufacturing
- Industry Outlook Recognized Textile Machinery Manufacturer`,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Seo || mongoose.model("Seo", SeoSchema);
