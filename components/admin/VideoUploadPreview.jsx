"use client";

import React, { useState, useRef } from "react";
import { Upload, Video as VideoIcon, Trash2, Loader2, RefreshCw, PlayCircle } from "lucide-react";

export default function VideoUploadPreview({
  value = "",
  onChange,
  label = "Upload Video",
  helpText = "Supports MP4, WebM, MOV, OGG (Max 50MB)",
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|webm|mov|ogg)$/i)) {
      alert("Please upload a valid video file (MP4, WebM, MOV, OGG)");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (onChange) {
        onChange(data.url);
      }
    } catch (err) {
      alert(err.message || "Failed to upload video");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="video-upload-preview-wrapper" style={{ width: "100%" }}>
      {label && <label className="admin-label">{label}</label>}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.mov"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleUpload(e.target.files[0]);
          }
        }}
      />

      {value ? (
        /* Video Preview Box */
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: 12,
            backgroundColor: "#0f172a",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <video
              src={value}
              controls
              playsInline
              style={{
                width: "100%",
                maxHeight: 240,
                objectFit: "contain",
                borderRadius: 8,
              }}
            />

            {uploading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.75)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  zIndex: 10,
                }}
              >
                <Loader2 size={28} className="spin-animation" style={{ color: "#38bdf8" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Uploading video...</span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ flex: 1, justifyContent: "center" }}
            >
              <RefreshCw size={14} />
              <span>Change Video</span>
            </button>

            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange && onChange("")}
              className="admin-btn admin-btn-danger admin-btn-sm"
              title="Remove video"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "var(--admin-primary)" : "#cbd5e1"}`,
            borderRadius: 10,
            padding: "30px 16px",
            textAlign: "center",
            backgroundColor: dragOver ? "#eff6ff" : "#f8fafc",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={32} className="spin-animation" style={{ color: "var(--admin-primary)" }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Uploading video... Please wait
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#e0e7ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4338ca",
                }}
              >
                <VideoIcon size={24} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
                  Click to upload video
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {helpText}
                </div>
              </div>
              <span className="admin-btn admin-btn-secondary admin-btn-sm" style={{ pointerEvents: "none" }}>
                <Upload size={14} />
                <span>Select Video File</span>
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
