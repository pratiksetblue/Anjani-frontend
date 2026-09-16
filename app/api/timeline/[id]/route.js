import { NextResponse } from "next/server";
import { getTimelineItemById, saveTimelineItem, deleteTimelineItem } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(request, { params }) {
  const { id } = await params;
  const item = await getTimelineItemById(id);
  if (!item) {
    return NextResponse.json({ error: "Timeline milestone not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PUT(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await saveTimelineItem({ ...body, _id: id, id });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update timeline item error:", error);
    return NextResponse.json(
      { error: "Failed to update timeline milestone" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const success = await deleteTimelineItem(id);
    if (!success) {
      return NextResponse.json({ error: "Timeline milestone not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete timeline item error:", error);
    return NextResponse.json(
      { error: "Failed to delete timeline milestone" },
      { status: 500 }
    );
  }
}
