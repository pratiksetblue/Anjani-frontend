import { NextResponse } from "next/server";
import { getHomeContent, saveHomeContent } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const content = await getHomeContent();
  return NextResponse.json(content);
}

export async function PUT(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await saveHomeContent(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Save home content error:", error);
    return NextResponse.json(
      { error: "Failed to save home content" },
      { status: 500 }
    );
  }
}
