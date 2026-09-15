import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import connectToDatabase from "./mongodb";

const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".ogg": "video/ogg",
  ".ogv": "video/ogg",
};

export function getMimeType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

export function getUploadsDir() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (err) {
    console.warn("[Storage] Local uploads directory not writable:", err.message);
  }
  return uploadsDir;
}

/**
 * Upload a file to MongoDB GridFS and optionally save to local disk
 */
export async function uploadFile(buffer, fileName, contentType, metadata = {}) {
  await connectToDatabase();
  const db = mongoose.connection.db;
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });

  const mime = contentType || getMimeType(fileName);

  // 1. Delete existing file in GridFS if it has the exact same name
  try {
    const existing = await bucket.find({ filename: fileName }).toArray();
    for (const file of existing) {
      await bucket.delete(file._id);
    }
  } catch (err) {
    console.warn("[GridFS] Cleanup existing file error:", err.message);
  }

  // 2. Upload to MongoDB Atlas GridFS
  const uploadStream = bucket.openUploadStream(fileName, {
    contentType: mime,
    metadata: {
      ...metadata,
      uploadDate: new Date(),
    },
  });

  await new Promise((resolve, reject) => {
    uploadStream.end(buffer, (err) => {
      if (err) reject(err);
      else resolve(uploadStream.id);
    });
  });

  // 3. Save copy to local disk if writable (acts as local cache)
  try {
    const uploadsDir = getUploadsDir();
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);
  } catch (err) {
    console.warn("[Storage] Local disk cache write skipped (serverless/read-only):", err.message);
  }

  return {
    fileName,
    url: `/uploads/${fileName}`,
    contentType: mime,
    size: buffer.length,
  };
}

/**
 * Retrieve a file from local disk or MongoDB GridFS with Range support (for videos)
 */
export async function getFile(fileName, rangeHeader = null) {
  const uploadsDir = getUploadsDir();
  const localFilePath = path.join(uploadsDir, fileName);

  // Check if local file exists on disk
  if (fs.existsSync(localFilePath)) {
    try {
      const stats = fs.statSync(localFilePath);
      const mime = getMimeType(fileName);
      const fileSize = stats.size;

      if (rangeHeader) {
        const parts = rangeHeader.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        const fileStream = fs.createReadStream(localFilePath, { start, end });

        return {
          stream: fileStream,
          status: 206,
          headers: {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": String(chunkSize),
            "Content-Type": mime,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        };
      }

      const fileStream = fs.createReadStream(localFilePath);
      return {
        stream: fileStream,
        status: 200,
        headers: {
          "Content-Length": String(fileSize),
          "Content-Type": mime,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      };
    } catch (err) {
      console.warn("[Storage] Error reading local file, falling back to GridFS:", err.message);
    }
  }

  // Fallback: Fetch from MongoDB Atlas GridFS
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });

    const files = await bucket.find({ filename: fileName }).limit(1).toArray();
    if (!files || files.length === 0) {
      return null;
    }

    const fileDoc = files[0];
    const fileSize = fileDoc.length;
    const mime = fileDoc.contentType || getMimeType(fileName);

    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const downloadStream = bucket.openDownloadStreamByName(fileName, {
        start,
        end: end + 1, // GridFS end is exclusive
      });

      return {
        stream: downloadStream,
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunkSize),
          "Content-Type": mime,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      };
    }

    const downloadStream = bucket.openDownloadStreamByName(fileName);
    return {
      stream: downloadStream,
      status: 200,
      headers: {
        "Content-Length": String(fileSize),
        "Content-Type": mime,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    };
  } catch (err) {
    console.error("[GridFS] Error retrieving file:", err);
    return null;
  }
}
