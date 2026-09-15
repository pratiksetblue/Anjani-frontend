import { NextResponse } from "next/server";
import path from "path";
import { getAdminSession } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name).toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".pdf", ".mp4", ".webm", ".mov", ".ogg"];
    if (!allowed.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid file type. Only Images, PDFs, and Videos (MP4, WEBM) are allowed." },
        { status: 400 }
      );
    }

    const safeBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40);

    const fileName = `${Date.now()}-${safeBaseName}${ext}`;

    const uploaded = await uploadFile(buffer, fileName, file.type, {
      originalName: file.name,
      uploadedBy: session.email || "admin",
    });

    return NextResponse.json({ url: uploaded.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
