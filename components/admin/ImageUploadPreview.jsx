"use client";

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Trash2, Loader2, RefreshCw } from "lucide-react";

export default function ImageUploadPreview({
  value = "",
  onChange,
  label = "Upload Image",
  aspectRatio = "auto",
  maxHeight = 180,
  helpText = "Supports JPG, PNG, WebP, SVG",
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP, SVG)");
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
      alert(err.message || "Failed to upload image");
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
    <div className="image-upload-preview-wrapper" style={{ width: "100%" }}>
      {label && <label className="admin-label">{label}</label>}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleUpload(e.target.files[0]);
          }
        }}
      />

      {value ? (
        /* Image Preview Box */
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: 12,
            backgroundColor: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxHeight,
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #cbd5e1",
            }}
          >
            <img
              src={value}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight,
                objectFit: "contain",
                display: "block",
              }}
            />
            {uploading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(255,255,255,0.85)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Loader2 size={24} className="spin-animation" style={{ color: "var(--admin-primary)" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Uploading...</span>
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
              <span>Change Image</span>
            </button>

            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange && onChange("")}
              className="admin-btn admin-btn-danger admin-btn-sm"
              title="Remove image"
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
            padding: "24px 16px",
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
              <Loader2 size={28} className="spin-animation" style={{ color: "var(--admin-primary)" }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>Uploading image...</div>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#475569",
                }}
              >
                <ImageIcon size={22} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
                  Click to upload image
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {helpText}
                </div>
              </div>
              <span className="admin-btn admin-btn-secondary admin-btn-sm" style={{ pointerEvents: "none" }}>
                <Upload size={14} />
                <span>Browse File</span>
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
