import { NextResponse } from "next/server";
import { getTimeline, saveTimelineItem, reorderTimeline } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("all") === "true";
  const items = await getTimeline(includeInactive);
  return NextResponse.json(items);
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.year || !body.description) {
      return NextResponse.json(
        { error: "Year and Description are required" },
        { status: 400 }
      );
    }

    const newItem = await saveTimelineItem(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Create timeline item error:", error);
    return NextResponse.json(
      { error: "Failed to create timeline milestone" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (Array.isArray(body.orderedIds)) {
      await reorderTimeline(body.orderedIds);
      return NextResponse.json({ success: true, message: "Timeline reordered successfully" });
    }
    return NextResponse.json({ error: "Invalid payload, orderedIds required" }, { status: 400 });
  } catch (error) {
    console.error("Reorder timeline error:", error);
    return NextResponse.json(
      { error: "Failed to reorder timeline" },
      { status: 500 }
    );
  }
}
