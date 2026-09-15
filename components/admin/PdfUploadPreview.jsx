"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Trash2, Loader2, RefreshCw, ExternalLink } from "lucide-react";

export default function PdfUploadPreview({
  value = "",
  onChange,
  label = "Upload Brochure (PDF)",
  helpText = "Supports PDF files up to 25MB",
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      alert("Please upload a valid PDF document");
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
      alert(err.message || "Failed to upload PDF");
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

  // Get clean display name from value
  const displayName = value ? value.split("/").pop() : "";

  return (
    <div className="pdf-upload-preview-wrapper" style={{ width: "100%" }}>
      {label && <label className="admin-label">{label}</label>}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleUpload(e.target.files[0]);
          }
        }}
      />

      {value ? (
        /* PDF Attached Box */
        <div
          style={{
            border: "1px solid #fed7aa",
            borderRadius: 10,
            padding: 14,
            backgroundColor: "#fff7ed",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                backgroundColor: "#ea580c",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={24} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#9a3412",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={displayName}
              >
                {displayName || "Brochure PDF Attached"}
              </div>
              <div style={{ fontSize: 12, color: "#c2410c", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span>PDF Document Ready</span>
                <span>•</span>
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#ea580c",
                    fontWeight: 600,
                    textDecoration: "underline",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  View PDF <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ flex: 1, justifyContent: "center" }}
            >
              {uploading ? <Loader2 size={14} className="spin-animation" /> : <RefreshCw size={14} />}
              <span>{uploading ? "Uploading..." : "Replace PDF"}</span>
            </button>

            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange && onChange("")}
              className="admin-btn admin-btn-danger admin-btn-sm"
              title="Remove brochure"
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
              <div style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>Uploading PDF brochure...</div>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#dc2626",
                }}
              >
                <FileText size={22} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
                  Click to upload PDF brochure
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {helpText}
                </div>
              </div>
              <span className="admin-btn admin-btn-secondary admin-btn-sm" style={{ pointerEvents: "none" }}>
                <Upload size={14} />
                <span>Browse Document</span>
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
