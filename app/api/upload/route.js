import { NextResponse } from "next/server";
import path from "path";
import { getAdminSession } from "@/lib/auth";
import { uploadFile, listFiles, deleteFile } from "@/lib/storage";

const ALLOWED_EXTENSIONS = [
  // Images
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg",
  ".gif",
  ".ico",
  // Documents
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
  ".zip",
  // Videos
  ".mp4",
  ".webm",
  ".mov",
  ".ogg",
  ".ogv",
];

export async function GET(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "60", 10);

    const result = await listFiles({ search, type, page, limit });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("List files error:", error);
    return NextResponse.json(
      { error: "Failed to load files", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    // Check both "files" (multiple) and "file" (single) form fields
    let files = formData.getAll("files");
    if (!files || files.length === 0) {
      files = formData.getAll("file");
    }

    // Filter out invalid/empty items
    files = files.filter((f) => f && typeof f !== "string" && f.name);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadedList = [];
    const errors = [];

    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        errors.push(`File type not allowed for: ${file.name}`);
        continue;
      }

      // Max size: 100MB
      if (file.size > 100 * 1024 * 1024) {
        errors.push(`File exceeds 100MB limit: ${file.name}`);
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeBaseName = path
        .basename(file.name, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 40);

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${safeBaseName || "file"}${ext}`;

      const uploaded = await uploadFile(buffer, fileName, file.type, {
        originalName: file.name,
        uploadedBy: session.email || "admin",
      });

      uploadedList.push({
        fileName: uploaded.fileName,
        url: uploaded.url,
        originalName: file.name,
        size: file.size,
        contentType: file.type,
      });
    }

    if (uploadedList.length === 0 && errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: uploadedList[0]?.url, // Backwards compatibility for single-file uploaders
      files: uploadedList,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let fileName = null;

    // Try reading fileName from JSON body or URL searchParams
    const { searchParams } = new URL(request.url);
    fileName = searchParams.get("fileName");

    if (!fileName) {
      try {
        const body = await request.json();
        fileName = body.fileName;
      } catch (e) {
        // body not json
      }
    }

    if (!fileName) {
      return NextResponse.json({ error: "fileName parameter is required" }, { status: 400 });
    }

    const success = await deleteFile(fileName);
    return NextResponse.json({ success: true, deleted: fileName });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: "Failed to delete file", details: error.message },
      { status: 500 }
    );
  }
}
