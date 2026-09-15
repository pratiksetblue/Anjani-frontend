import { NextResponse } from "next/server";
import { getSeoSettings, saveSeoSettings } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const seo = await getSeoSettings();
  return NextResponse.json(seo);
}

export async function PUT(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await saveSeoSettings(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Save SEO error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save SEO settings" },
      { status: 500 }
    );
  }
}
