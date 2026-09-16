import { NextResponse } from "next/server";
import { getPageContentBySlug, savePageContent } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(request, { params }) {
  const { slug } = await params;
  const pageData = await getPageContentBySlug(slug);

  if (!pageData) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json(pageData);
}

export async function PUT(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();

    const updated = await savePageContent(slug, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Save page error:", error);
    return NextResponse.json(
      { error: "Failed to save page content" },
      { status: 500 }
    );
  }
}
