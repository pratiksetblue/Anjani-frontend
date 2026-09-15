import { NextResponse } from "next/server";
import { Readable } from "stream";
import { getFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams?.path;

    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const fileName = Array.isArray(pathSegments) ? pathSegments.join("/") : String(pathSegments);
    const range = request.headers.get("range");

    const file = await getFile(fileName, range);
    if (!file) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const webStream = Readable.toWeb(file.stream);

    return new NextResponse(webStream, {
      status: file.status,
      headers: file.headers,
    });
  } catch (err) {
    console.error("[Uploads Route] Error serving file:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
