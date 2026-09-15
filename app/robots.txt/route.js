import { NextResponse } from "next/server";
import { getSeoSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const seo = await getSeoSettings();

    if (seo.robotsTxt?.enabled === false) {
      return new NextResponse("User-agent: *\nDisallow: /", {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const defaultContent = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${(seo.siteUrl || "https://www.anjaniindustries.in").replace(/\/+$/, "")}/sitemap.xml`;

    const content = seo.robotsTxt?.content || defaultContent;

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("robots.txt error:", error);
    return new NextResponse("User-agent: *\nAllow: /", { status: 200 });
  }
}
