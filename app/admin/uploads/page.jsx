"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  UploadCloud,
  FolderUp,
  FileText,
  Image as ImageIcon,
  Film,
  File,
  Trash2,
  Copy,
  Check,
  Search,
  Grid,
  List,
  ExternalLink,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  Eye,
  HardDrive,
  Layers,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileArchive,
} from "lucide-react";

// Helper: Format bytes to human readable format
function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// Helper: Format date
function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return String(dateStr);
  }
}

// Helper: Determine file category & color
function getFileMeta(fileName = "", contentType = "") {
  const ext = fileName.split(".").pop().toLowerCase();

  if (
    contentType.startsWith("image/") ||
    ["jpg", "jpeg", "png", "webp", "svg", "gif", "ico"].includes(ext)
  ) {
    return {
      type: "image",
      label: "Image",
      badgeColor: "#dcfce7",
      textColor: "#15803d",
      icon: ImageIcon,
    };
  }

  if (
    contentType.startsWith("video/") ||
    ["mp4", "webm", "mov", "ogg", "ogv"].includes(ext)
  ) {
    return {
      type: "video",
      label: "Video",
      badgeColor: "#f3e8ff",
      textColor: "#7e22ce",
      icon: Film,
    };
  }

  if (ext === "pdf" || contentType.includes("pdf")) {
    return {
      type: "pdf",
      label: "PDF",
      badgeColor: "#fee2e2",
      textColor: "#b91c1c",
      icon: FileText,
    };
  }

  if (["xls", "xlsx", "csv"].includes(ext)) {
    return {
      type: "spreadsheet",
      label: "Spreadsheet",
      badgeColor: "#ecfdf5",
      textColor: "#047857",
      icon: FileSpreadsheet,
    };
  }

  if (["doc", "docx", "txt", "rtf"].includes(ext)) {
    return {
      type: "document",
      label: "Document",
      badgeColor: "#e0f2fe",
      textColor: "#0369a1",
      icon: FileText,
    };
  }

  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return {
      type: "archive",
      label: "Archive",
      badgeColor: "#fef3c7",
      textColor: "#b45309",
      icon: FileArchive,
    };
  }

  return {
    type: "file",
    label: ext.toUpperCase() || "File",
    badgeColor: "#f1f5f9",
    textColor: "#475569",
    icon: File,
  };
}

export default function AdminUploadsPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 36,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    imageCount: 0,
    docCount: 0,
    videoCount: 0,
  });

  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    count: 0,
    success: 0,
    errors: [],
  });
  const [copiedId, setCopiedId] = useState(null);

  // Modals
  const [previewFile, setPreviewFile] = useState(null);
  const [deleteConfirmFile, setDeleteConfirmFile] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Fetch file list
  const fetchFiles = useCallback(
    async (
      targetPage = page,
      currentSearch = search,
      currentType = typeFilter,
    ) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: targetPage.toString(),
          limit: "36",
          search: currentSearch,
          type: currentType,
        });

        const res = await fetch(`/api/upload?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setFiles(data.files || []);
          if (data.pagination) setPagination(data.pagination);
          if (data.stats) setStats(data.stats);
        } else {
          showToast("Failed to load files", "error");
        }
      } catch (err) {
        console.error("Failed to fetch uploads:", err);
        showToast("Error connecting to server", "error");
      } finally {
        setLoading(false);
      }
    },
    [page, search, typeFilter],
  );

  useEffect(() => {
    fetchFiles(page, search, typeFilter);
  }, [page, search, typeFilter, fetchFiles]);

  // Search debounce / enter handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // Copy URL with visual feedback
  const handleCopyUrl = async (file) => {
    try {
      const fullUrl = window.location.origin + file.url;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(file.fileName);
      showToast(`Copied URL: ${file.fileName}`, "success");
      setTimeout(() => {
        setCopiedId(null);
      }, 2500);
    } catch (err) {
      console.error("Copy error:", err);
      showToast("Failed to copy URL to clipboard", "error");
    }
  };

  // Copy relative path
  const handleCopyRelativePath = async (file) => {
    try {
      await navigator.clipboard.writeText(file.url);
      setCopiedId(file.fileName + "_rel");
      showToast(`Copied Path: ${file.url}`, "success");
      setTimeout(() => {
        setCopiedId(null);
      }, 2500);
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  // Multi-file upload handler
  const handleUploadFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setUploadStats({ count: fileList.length, success: 0, errors: [] });

    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const count = data.files ? data.files.length : 1;
        showToast(
          `Successfully uploaded ${count} file${count > 1 ? "s" : ""}!`,
          "success",
        );
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
        // Refresh list
        fetchFiles(1, search, typeFilter);
        setPage(1);
      } else {
        showToast(data.error || "File upload failed", "error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Failed to upload files. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop event listeners
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (
      e.dataTransfer &&
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // Delete file action
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmFile) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `/api/upload?fileName=${encodeURIComponent(deleteConfirmFile.fileName)}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Deleted ${deleteConfirmFile.fileName}`, "success");
        setDeleteConfirmFile(null);
        if (previewFile?.fileName === deleteConfirmFile.fileName) {
          setPreviewFile(null);
        }
        fetchFiles(page, search, typeFilter);
      } else {
        showToast(data.error || "Failed to delete file", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Error deleting file", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            backgroundColor: toast.type === "error" ? "#fee2e2" : "#ecfdf5",
            color: toast.type === "error" ? "#991b1b" : "#065f46",
            border: `1px solid ${toast.type === "error" ? "#f87171" : "#34d399"}`,
            borderRadius: 8,
            padding: "12px 18px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            fontWeight: 500,
            animation: "fadeIn 0.2s ease",
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              marginLeft: 8,
              padding: 2,
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                backgroundColor: "#fee2e2",
                color: "var(--admin-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FolderUp size={22} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  margin: 0,
                  color: "#0f172a",
                }}
              >
                Media & File Manager
              </h1>
              <p
                style={{ margin: "2px 0 0 0", color: "#64748b", fontSize: 13 }}
              >
                File and Media Manager — Upload images, product brochures, PDFs,
                and video assets with 1-click URL copy.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => fetchFiles(page, search, typeFilter)}
            disabled={loading}
            className="admin-btn admin-btn-secondary"
            title="Refresh files"
          >
            <RefreshCw size={16} className={loading ? "spin-animation" : ""} />
            Refresh
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="admin-btn admin-btn-primary"
          >
            <UploadCloud size={16} />
            Upload New Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleUploadFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="admin-stat-grid" style={{ marginBottom: 24 }}>
        <div className="admin-stat-card">
          <div>
            <span>Total Files</span>
            <h3>{stats.totalFiles || 0}</h3>
          </div>
          <div
            className="admin-stat-icon"
            style={{
              backgroundColor: "#fee2e2",
              color: "var(--admin-primary)",
            }}
          >
            <Layers size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Storage Used</span>
            <h3>{formatBytes(stats.totalSize || 0)}</h3>
          </div>
          <div
            className="admin-stat-icon"
            style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}
          >
            <HardDrive size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Images</span>
            <h3>{stats.imageCount || 0}</h3>
          </div>
          <div
            className="admin-stat-icon"
            style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
          >
            <ImageIcon size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Documents & PDFs</span>
            <h3>{stats.docCount || 0}</h3>
          </div>
          <div
            className="admin-stat-icon"
            style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
          >
            <FileText size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>Videos</span>
            <h3>{stats.videoCount || 0}</h3>
          </div>
          <div
            className="admin-stat-icon"
            style={{ backgroundColor: "#f3e8ff", color: "#9333ea" }}
          >
            <Film size={24} />
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{
          border: isDragging
            ? "2px dashed var(--admin-primary)"
            : "2px dashed #cbd5e1",
          backgroundColor: isDragging ? "rgba(203, 0, 0, 0.04)" : "#ffffff",
          borderRadius: 12,
          padding: "32px 20px",
          textAlign: "center",
          cursor: uploading ? "wait" : "pointer",
          transition: "all 0.2s ease",
          marginBottom: 24,
          boxShadow: isDragging
            ? "0 4px 12px rgba(203, 0, 0, 0.1)"
            : "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: isDragging ? "#fee2e2" : "#f1f5f9",
            color: isDragging ? "var(--admin-primary)" : "#64748b",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            transition: "all 0.2s ease",
          }}
        >
          {uploading ? (
            <RefreshCw
              size={26}
              className="spin-animation"
              style={{ color: "var(--admin-primary)" }}
            />
          ) : (
            <UploadCloud size={28} />
          )}
        </div>

        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#1e293b",
            margin: "0 0 6px 0",
          }}
        >
          {uploading
            ? "Uploading files to cloud storage..."
            : isDragging
              ? "Drop files here to start upload"
              : "Click to select or drag & drop files here"}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            margin: 0,
            maxWidth: 640,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Supports <strong>Images</strong> (JPG, PNG, WebP, SVG, GIF),{" "}
          <strong>Documents</strong> (PDF, DOCX, XLSX, PPTX, TXT, CSV), and{" "}
          <strong>Videos</strong> (MP4, WebM). Up to 100MB per file.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="admin-card"
        style={{
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        {/* Type Filter Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {[
            { id: "all", label: "All Files", count: stats.totalFiles },
            { id: "images", label: "Images", count: stats.imageCount },
            {
              id: "documents",
              label: "Documents & PDFs",
              count: stats.docCount,
            },
            { id: "videos", label: "Videos", count: stats.videoCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setTypeFilter(tab.id);
                setPage(1);
              }}
              style={{
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor:
                  typeFilter === tab.id ? "var(--admin-primary)" : "#f1f5f9",
                color: typeFilter === tab.id ? "#ffffff" : "#475569",
                transition: "all 0.15s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: 11,
                  padding: "1px 6px",
                  borderRadius: 10,
                  backgroundColor:
                    typeFilter === tab.id
                      ? "rgba(255,255,255,0.25)"
                      : "#e2e8f0",
                  color: typeFilter === tab.id ? "#ffffff" : "#64748b",
                }}
              >
                {tab.count || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search & View Mode Switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flex: 1,
            minWidth: 280,
            justifyContent: "flex-end",
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{ position: "relative", width: "100%", maxWidth: 320 }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Search filename..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="admin-input"
              style={{
                paddingLeft: 36,
                paddingRight: searchInput ? 32 : 12,
                paddingTop: 8,
                paddingBottom: 8,
                fontSize: 13,
                height: 38,
              }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: 2,
                }}
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* View Mode Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f1f5f9",
              borderRadius: 8,
              padding: 3,
            }}
          >
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              style={{
                border: "none",
                background: viewMode === "grid" ? "#ffffff" : "transparent",
                color: viewMode === "grid" ? "#0f172a" : "#64748b",
                borderRadius: 6,
                padding: "6px 9px",
                cursor: "pointer",
                boxShadow:
                  viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              title="List View"
              style={{
                border: "none",
                background: viewMode === "table" ? "#ffffff" : "transparent",
                color: viewMode === "table" ? "#0f172a" : "#64748b",
                borderRadius: 6,
                padding: "6px 9px",
                cursor: "pointer",
                boxShadow:
                  viewMode === "table" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Files Display */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            backgroundColor: "#ffffff",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
          }}
        >
          <RefreshCw
            size={32}
            className="spin-animation"
            style={{ color: "var(--admin-primary)", marginBottom: 12 }}
          />
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Loading media files...
          </p>
        </div>
      ) : files.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "70px 20px",
            backgroundColor: "#ffffff",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
          }}
        >
          <FolderUp size={44} style={{ color: "#cbd5e1", marginBottom: 14 }} />
          <h3
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "#1e293b",
              margin: "0 0 6px 0",
            }}
          >
            No files found
          </h3>
          <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 16px 0" }}>
            {search
              ? `No files matching "${search}" found in this category.`
              : "Upload your first file to see it here."}
          </p>
          {search ? (
            <button
              onClick={handleClearSearch}
              className="admin-btn admin-btn-secondary"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="admin-btn admin-btn-primary"
            >
              <UploadCloud size={16} /> Upload Now
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {files.map((file) => {
            const meta = getFileMeta(file.fileName, file.contentType);
            const isCopied = copiedId === file.fileName;
            const Icon = meta.icon;

            return (
              <div
                key={file.id || file.fileName}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0,0,0,0.03)";
                }}
              >
                {/* Media Preview Box */}
                <div
                  onClick={() => setPreviewFile(file)}
                  style={{
                    height: 140,
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    position: "relative",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {meta.type === "image" ? (
                    <img
                      src={file.url}
                      alt={file.originalName || file.fileName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<div style="color: #94a3b8; display:flex; flex-direction:column; align-items:center; gap:6px;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg><span style="font-size:11px">Preview unavailable</span></div>`;
                      }}
                    />
                  ) : meta.type === "video" ? (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#0f172a",
                      }}
                    >
                      <Film
                        size={36}
                        color="#ffffff"
                        style={{ opacity: 0.8 }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 6,
                          right: 8,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "#ffffff",
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontWeight: 600,
                        }}
                      >
                        VIDEO
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Icon size={40} style={{ color: meta.textColor }} />
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: meta.textColor,
                          backgroundColor: meta.badgeColor,
                          padding: "2px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>
                  )}

                  {/* Hover Quick Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(15, 23, 42, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewFile(file);
                      }}
                      style={{
                        backgroundColor: "#ffffff",
                        border: "none",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#0f172a",
                      }}
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0f172a",
                      }}
                      title="Open in new tab"
                    >
                      <ExternalLink size={15} />
                    </a>
                  </div>
                </div>

                {/* Details */}
                <div
                  style={{
                    padding: "10px 12px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    title={file.originalName || file.fileName}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1e293b",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: 4,
                    }}
                  >
                    {file.originalName || file.fileName}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 11,
                      color: "#64748b",
                      marginBottom: 10,
                    }}
                  >
                    <span>{formatBytes(file.size)}</span>
                    <span>{formatDate(file.uploadDate).split(",")[0]}</span>
                  </div>

                  {/* Actions Bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: 8,
                      borderTop: "1px solid #f1f5f9",
                      marginTop: "auto",
                      gap: 4,
                    }}
                  >
                    <button
                      onClick={() => handleCopyUrl(file)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                        padding: "6px 8px",
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: isCopied ? "#ecfdf5" : "#f8fafc",
                        color: isCopied ? "#059669" : "#334155",
                        border: `1px solid ${isCopied ? "#a7f3d0" : "#e2e8f0"}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                      title="Copy full public URL"
                    >
                      {isCopied ? (
                        <>
                          <Check size={13} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setDeleteConfirmFile(file)}
                      style={{
                        padding: "6px 8px",
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                        borderRadius: 6,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Delete file"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div
          className="admin-card"
          style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}
        >
          <div className="admin-table-wrap" style={{ border: "none" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Preview</th>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Upload Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => {
                  const meta = getFileMeta(file.fileName, file.contentType);
                  const isCopied = copiedId === file.fileName;
                  const Icon = meta.icon;

                  return (
                    <tr key={file.id || file.fileName}>
                      <td>
                        <div
                          onClick={() => setPreviewFile(file)}
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 6,
                            overflow: "hidden",
                            backgroundColor: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          {meta.type === "image" ? (
                            <img
                              src={file.url}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Icon size={20} style={{ color: meta.textColor }} />
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "#0f172a",
                              fontSize: 13.5,
                              maxWidth: 340,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {file.originalName || file.fileName}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#94a3b8",
                              fontFamily: "monospace",
                              marginTop: 2,
                            }}
                          >
                            {file.url}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            backgroundColor: meta.badgeColor,
                            color: meta.textColor,
                          }}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: "#475569" }}>
                        {formatBytes(file.size)}
                      </td>
                      <td style={{ fontSize: 12.5, color: "#64748b" }}>
                        {formatDate(file.uploadDate)}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 6,
                          }}
                        >
                          <button
                            onClick={() => handleCopyUrl(file)}
                            className="admin-btn admin-btn-sm"
                            style={{
                              backgroundColor: isCopied ? "#ecfdf5" : "#f1f5f9",
                              color: isCopied ? "#059669" : "#334155",
                              border: `1px solid ${isCopied ? "#a7f3d0" : "#e2e8f0"}`,
                            }}
                            title="Copy full URL"
                          >
                            {isCopied ? (
                              <Check size={13} />
                            ) : (
                              <Copy size={13} />
                            )}
                            {isCopied ? "Copied" : "Copy URL"}
                          </button>

                          <button
                            onClick={() => setPreviewFile(file)}
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            title="Preview file"
                          >
                            <Eye size={13} />
                          </button>

                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            title="Open link"
                          >
                            <ExternalLink size={13} />
                          </a>

                          <button
                            onClick={() => setDeleteConfirmFile(file)}
                            className="admin-btn admin-btn-sm admin-btn-danger"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
            padding: "12px 18px",
            backgroundColor: "#ffffff",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 13, color: "#64748b" }}>
            Showing page <strong>{pagination.page}</strong> of{" "}
            <strong>{pagination.totalPages}</strong> ({pagination.total} files
            total)
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={pagination.page <= 1 || loading}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{
                opacity: pagination.page <= 1 ? 0.5 : 1,
                cursor: pagination.page <= 1 ? "not-allowed" : "pointer",
              }}
            >
              <ChevronLeft size={15} /> Previous
            </button>

            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNumber = i + 1;
                if (pagination.totalPages > 5 && pagination.page > 3) {
                  pageNumber = pagination.page - 2 + i;
                  if (pageNumber > pagination.totalPages) {
                    pageNumber = pagination.totalPages - (4 - i);
                  }
                }
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className="admin-btn admin-btn-sm"
                    style={{
                      backgroundColor:
                        pagination.page === pageNumber
                          ? "var(--admin-primary)"
                          : "#f8fafc",
                      color:
                        pagination.page === pageNumber ? "#ffffff" : "#334155",
                      border: `1px solid ${pagination.page === pageNumber ? "var(--admin-primary)" : "#e2e8f0"}`,
                      minWidth: 32,
                      justifyContent: "center",
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              },
            )}

            <button
              onClick={() =>
                setPage((prev) => Math.min(pagination.totalPages, prev + 1))
              }
              disabled={pagination.page >= pagination.totalPages || loading}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{
                opacity: pagination.page >= pagination.totalPages ? 0.5 : 1,
                cursor:
                  pagination.page >= pagination.totalPages
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: 840, padding: 0, overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f8fafc",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  overflow: "hidden",
                }}
              >
                <Eye
                  size={18}
                  style={{ color: "var(--admin-primary)", flexShrink: 0 }}
                />
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    margin: 0,
                    color: "#0f172a",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {previewFile.originalName || previewFile.fileName}
                </h3>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  padding: 4,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Content Viewer */}
            <div
              style={{
                padding: 20,
                backgroundColor: "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 320,
                maxHeight: 520,
                overflow: "auto",
              }}
            >
              {(() => {
                const meta = getFileMeta(
                  previewFile.fileName,
                  previewFile.contentType,
                );
                if (meta.type === "image") {
                  return (
                    <img
                      src={previewFile.url}
                      alt={previewFile.fileName}
                      style={{
                        maxWidth: "100%",
                        maxHeight: 480,
                        objectFit: "contain",
                        borderRadius: 6,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      }}
                    />
                  );
                } else if (meta.type === "video") {
                  return (
                    <video
                      controls
                      autoPlay
                      src={previewFile.url}
                      style={{
                        maxWidth: "100%",
                        maxHeight: 480,
                        borderRadius: 6,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      }}
                    />
                  );
                } else if (meta.type === "pdf") {
                  return (
                    <iframe
                      src={previewFile.url}
                      style={{
                        width: "100%",
                        height: 480,
                        border: "none",
                        borderRadius: 6,
                        backgroundColor: "#ffffff",
                      }}
                      title="PDF Preview"
                    />
                  );
                } else {
                  return (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#f8fafc",
                        padding: 30,
                      }}
                    >
                      <FileText
                        size={56}
                        style={{ color: "#94a3b8", marginBottom: 12 }}
                      />
                      <h4 style={{ margin: "0 0 6px 0", fontSize: 16 }}>
                        Direct in-browser preview not available for this file
                        type
                      </h4>
                      <p
                        style={{
                          margin: "0 0 16px 0",
                          color: "#94a3b8",
                          fontSize: 13,
                        }}
                      >
                        You can download the file or open it in a new window.
                      </p>
                      <a
                        href={previewFile.url}
                        download
                        className="admin-btn admin-btn-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={15} /> Download File
                      </a>
                    </div>
                  );
                }
              })()}
            </div>

            {/* Modal Footer: Meta & Action buttons */}
            <div style={{ padding: "18px 20px", backgroundColor: "#ffffff" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                  marginBottom: 16,
                  fontSize: 12.5,
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  padding: "12px 14px",
                  borderRadius: 8,
                }}
              >
                <div>
                  <strong style={{ color: "#0f172a" }}>File Size:</strong>{" "}
                  {formatBytes(previewFile.size)}
                </div>
                <div>
                  <strong style={{ color: "#0f172a" }}>Uploaded:</strong>{" "}
                  {formatDate(previewFile.uploadDate)}
                </div>
                <div>
                  <strong style={{ color: "#0f172a" }}>Type:</strong>{" "}
                  {previewFile.contentType || "Unknown"}
                </div>
              </div>

              {/* URL Input with Copy Button */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: 5,
                  }}
                >
                  Public File URL:
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    readOnly
                    value={
                      typeof window !== "undefined"
                        ? window.location.origin + previewFile.url
                        : previewFile.url
                    }
                    className="admin-input"
                    style={{
                      fontFamily: "monospace",
                      fontSize: 12.5,
                      backgroundColor: "#f8fafc",
                      flex: 1,
                    }}
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    onClick={() => handleCopyUrl(previewFile)}
                    className="admin-btn admin-btn-primary"
                    style={{ flexShrink: 0 }}
                  >
                    {copiedId === previewFile.fileName ? (
                      <Check size={15} />
                    ) : (
                      <Copy size={15} />
                    )}
                    {copiedId === previewFile.fileName ? "Copied!" : "Copy URL"}
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => handleCopyRelativePath(previewFile)}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  <Copy size={13} />
                  {copiedId === previewFile.fileName + "_rel"
                    ? "Path Copied!"
                    : "Copy Relative Path"}
                </button>

                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={previewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                  >
                    <ExternalLink size={13} /> Open in New Tab
                  </a>
                  <button
                    onClick={() => {
                      setDeleteConfirmFile(previewFile);
                      setPreviewFile(null);
                    }}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                  >
                    <Trash2 size={13} /> Delete File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmFile && (
        <div
          className="admin-modal-backdrop"
          onClick={() => !deleting && setDeleteConfirmFile(null)}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: 460 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Trash2 size={22} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    margin: 0,
                    color: "#0f172a",
                  }}
                >
                  Delete File?
                </h3>
                <p
                  style={{
                    margin: "2px 0 0 0",
                    color: "#64748b",
                    fontSize: 13,
                  }}
                >
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: 13.5,
                color: "#334155",
                margin: "14px 0 20px 0",
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to permanently delete{" "}
              <strong style={{ color: "#0f172a", wordBreak: "break-all" }}>
                {deleteConfirmFile.originalName || deleteConfirmFile.fileName}
              </strong>
              ? Any pages or products referencing this URL will no longer be
              able to load it.
            </p>

            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
            >
              <button
                disabled={deleting}
                onClick={() => setDeleteConfirmFile(null)}
                className="admin-btn admin-btn-secondary"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="admin-btn admin-btn-danger"
              >
                {deleting ? (
                  <>
                    <RefreshCw size={14} className="spin-animation" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
