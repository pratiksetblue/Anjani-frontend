import { NextResponse } from "next/server";
import { reorderProducts } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function PUT(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items } = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items array is required" },
        { status: 400 }
      );
    }

    await reorderProducts(items);
    return NextResponse.json({ success: true, count: items.length });
  } catch (error) {
    console.error("Reorder products error:", error);
    return NextResponse.json(
      { error: "Failed to reorder products" },
      { status: 500 }
    );
  }
}
