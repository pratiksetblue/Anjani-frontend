import { NextResponse } from "next/server";
import { getExhibitorById, updateExhibitor, deleteExhibitor } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const exhibitor = await getExhibitorById(id);
    if (!exhibitor) {
      return NextResponse.json({ error: "Exhibitor not found" }, { status: 404 });
    }
    return NextResponse.json(exhibitor);
  } catch (error) {
    console.error("Get exhibitor error:", error);
    return NextResponse.json(
      { error: "Failed to get exhibitor", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateExhibitor(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update exhibitor error:", error);
    return NextResponse.json(
      { error: "Failed to update exhibitor", details: error.message },
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
    await deleteExhibitor(id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Delete exhibitor error:", error);
    return NextResponse.json(
      { error: "Failed to delete exhibitor", details: error.message },
      { status: 500 }
    );
  }
}
