import { NextResponse } from "next/server";
import { getEmailSettings, saveEmailSettings } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const settings = await getEmailSettings();
  return NextResponse.json(settings);
}

export async function PUT(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await saveEmailSettings(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Save email settings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save email settings" },
      { status: 500 }
    );
  }
}
