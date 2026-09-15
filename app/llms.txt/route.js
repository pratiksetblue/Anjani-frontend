import { NextResponse } from "next/server";
import { getSeoSettings, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const seo = await getSeoSettings();

    if (seo.llmsTxt?.enabled === false) {
      return new NextResponse("# LLM Access Disabled", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    let content = seo.llmsTxt?.content;

    // If no custom content, generate from live products in MongoDB
    if (!content) {
      const siteUrl = (seo.siteUrl || "https://www.anjaniindustries.in").replace(/\/+$/, "");
      const products = await getProducts();

      content = `# Anjani Industries

> Leading manufacturer of advanced fabric dyeing and textile processing machinery since 1990.

## Overview
- **Website**: ${siteUrl}
- **Experience**: 36+ Years in Fabric Dyeing Engineering
- **Headquarters**: Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India.
- **Contact**: anjani_ind@yahoo.com | +91 8154 888 370

## Key Machinery Catalog
${products
  .map(
    (p, i) =>
      `${i + 1}. **${p.title}**
   - URL: ${siteUrl}/${p.slug}
   - Capacity: ${p.capacity || "Industrial standard"}
   - Description: ${(p.paragraphs && p.paragraphs[0]) || "Precision fabric dyeing machine."}`
  )
  .join("\n\n")}

## Accreditations
- ISO 9001:2015 Certified
- GO GREEN Sustainable Manufacturing
- Industry Outlook Recognized Textile Machinery Manufacturer
`;
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("llms.txt error:", error);
    return new NextResponse("# Anjani Industries\n\nFabric Dyeing Machinery", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
