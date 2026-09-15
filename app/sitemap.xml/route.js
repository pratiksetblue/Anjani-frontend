import { NextResponse } from "next/server";
import { getSeoSettings, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const seo = await getSeoSettings();
    const siteUrl = (seo.siteUrl || "https://www.anjaniindustries.in").replace(/\/+$/, "");

    const today = new Date().toISOString().split("T")[0];

    // Core static pages
    const corePages = [
      { loc: `${siteUrl}/`, lastmod: today, changefreq: "weekly", priority: "1.0" },
      { loc: `${siteUrl}/about-us`, lastmod: today, changefreq: "monthly", priority: "0.8" },
      { loc: `${siteUrl}/our-story`, lastmod: today, changefreq: "monthly", priority: "0.7" },
      { loc: `${siteUrl}/values-ethics`, lastmod: today, changefreq: "monthly", priority: "0.7" },
      { loc: `${siteUrl}/products`, lastmod: today, changefreq: "weekly", priority: "0.9" },
      { loc: `${siteUrl}/contact-us`, lastmod: today, changefreq: "monthly", priority: "0.8" },
    ];

    // Dynamic products from MongoDB
    let productPages = [];
    if (seo.sitemap?.autoGenerateProducts !== false) {
      const products = await getProducts();
      productPages = products.map((p) => {
        const lastmod = p.updatedAt
          ? new Date(p.updatedAt).toISOString().split("T")[0]
          : today;
        return {
          loc: `${siteUrl}/${p.slug}`,
          lastmod,
          changefreq: "monthly",
          priority: "0.85",
        };
      });
    }

    // Extra custom URLs
    const extraPages = (seo.sitemap?.extraUrls || [])
      .filter((item) => item.url)
      .map((item) => ({
        loc: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
        lastmod: item.lastmod || today,
        changefreq: item.changefreq || "monthly",
        priority: item.priority || "0.7",
      }));

    const allPages = [...corePages, ...productPages, ...extraPages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(page.loc)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
    }
  });
}
