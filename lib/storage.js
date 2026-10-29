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
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".zip": "application/zip",
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

/**
 * List files stored in MongoDB GridFS and local storage with stats & filters
 */
export async function listFiles({ search = "", type = "all", page = 1, limit = 60 } = {}) {
  await connectToDatabase();
  const db = mongoose.connection.db;
  const filesColl = db.collection("uploads.files");

  // Sync any untracked files from local public/uploads directory into GridFS
  try {
    const uploadsDir = getUploadsDir();
    if (fs.existsSync(uploadsDir)) {
      const diskFiles = fs.readdirSync(uploadsDir);
      for (const diskFile of diskFiles) {
        if (diskFile.startsWith(".") || diskFile.includes(".gitkeep")) continue;
        const exists = await filesColl.findOne({ filename: diskFile });
        if (!exists) {
          const filePath = path.join(uploadsDir, diskFile);
          const stats = fs.statSync(filePath);
          if (stats.isFile()) {
            const buffer = fs.readFileSync(filePath);
            await uploadFile(buffer, diskFile, getMimeType(diskFile), {
              originalName: diskFile,
              uploadedBy: "system-sync",
              uploadDate: stats.mtime,
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn("[Storage] Local file sync check skipped:", err.message);
  }

  // Build filter query
  const query = {};
  if (search && search.trim()) {
    const s = search.trim();
    query.$or = [
      { filename: { $regex: s, $options: "i" } },
      { "metadata.originalName": { $regex: s, $options: "i" } },
    ];
  }

  if (type === "images") {
    query.$or = [
      { contentType: { $regex: "^image/", $options: "i" } },
      { filename: { $regex: "\\.(jpg|jpeg|png|webp|svg|gif|ico)$", $options: "i" } },
    ];
  } else if (type === "documents" || type === "pdf") {
    query.$or = [
      { contentType: { $regex: "pdf|document|sheet|text|msword|presentation", $options: "i" } },
      { filename: { $regex: "\\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv)$", $options: "i" } },
    ];
  } else if (type === "videos") {
    query.$or = [
      { contentType: { $regex: "^video/", $options: "i" } },
      { filename: { $regex: "\\.(mp4|webm|mov|ogg|ogv)$", $options: "i" } },
    ];
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 60));
  const skip = (safePage - 1) * safeLimit;

  // Global aggregate stats
  let totalFiles = 0;
  let totalSize = 0;
  let imageCount = 0;
  let docCount = 0;
  let videoCount = 0;

  try {
    const statsAgg = await filesColl
      .aggregate([
        {
          $group: {
            _id: null,
            totalSize: { $sum: "$length" },
            totalCount: { $sum: 1 },
          },
        },
      ])
      .toArray();

    if (statsAgg.length > 0) {
      totalFiles = statsAgg[0].totalCount || 0;
      totalSize = statsAgg[0].totalSize || 0;
    }

    const countsByTypeAgg = await filesColl
      .aggregate([
        {
          $project: {
            filename: 1,
            isImage: {
              $regexMatch: {
                input: "$filename",
                regex: "\\.(jpg|jpeg|png|webp|svg|gif|ico)$",
                options: "i",
              },
            },
            isDoc: {
              $regexMatch: {
                input: "$filename",
                regex: "\\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv)$",
                options: "i",
              },
            },
            isVideo: {
              $regexMatch: {
                input: "$filename",
                regex: "\\.(mp4|webm|mov|ogg|ogv)$",
                options: "i",
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            images: { $sum: { $cond: ["$isImage", 1, 0] } },
            documents: { $sum: { $cond: ["$isDoc", 1, 0] } },
            videos: { $sum: { $cond: ["$isVideo", 1, 0] } },
          },
        },
      ])
      .toArray();

    if (countsByTypeAgg.length > 0) {
      imageCount = countsByTypeAgg[0].images || 0;
      docCount = countsByTypeAgg[0].documents || 0;
      videoCount = countsByTypeAgg[0].videos || 0;
    }
  } catch (err) {
    console.warn("[Storage] Stats calculation error:", err.message);
  }

  const filteredTotal = await filesColl.countDocuments(query);
  const items = await filesColl
    .find(query)
    .sort({ uploadDate: -1 })
    .skip(skip)
    .limit(safeLimit)
    .toArray();

  const files = items.map((f) => ({
    id: f._id.toString(),
    fileName: f.filename,
    originalName: f.metadata?.originalName || f.filename,
    url: `/uploads/${f.filename}`,
    contentType: f.contentType || getMimeType(f.filename),
    size: f.length,
    uploadDate: f.uploadDate || f.metadata?.uploadDate,
    uploadedBy: f.metadata?.uploadedBy || "admin",
  }));

  return {
    files,
    pagination: {
      total: filteredTotal,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(filteredTotal / safeLimit) || 1,
    },
    stats: {
      totalFiles,
      totalSize,
      imageCount,
      docCount,
      videoCount,
    },
  };
}

/**
 * Delete a file by filename from GridFS and local cache
 */
export async function deleteFile(fileName) {
  if (!fileName) return false;

  await connectToDatabase();
  const db = mongoose.connection.db;
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });

  try {
    const existing = await bucket.find({ filename: fileName }).toArray();
    for (const file of existing) {
      await bucket.delete(file._id);
    }
  } catch (err) {
    console.warn("[GridFS] Delete file error:", err.message);
  }

  try {
    const uploadsDir = getUploadsDir();
    const filePath = path.join(uploadsDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn("[Storage] Local file unlink error:", err.message);
  }

  return true;
}
