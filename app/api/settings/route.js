import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await saveSettings(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Save settings error:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
