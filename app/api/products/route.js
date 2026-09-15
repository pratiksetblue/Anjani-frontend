import { NextResponse } from "next/server";
import { getProducts, saveProduct } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json(
        { error: "Product title is required" },
        { status: 400 }
      );
    }

    const newProduct = await saveProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
