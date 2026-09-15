"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle,
  AlertCircle,
  Award,
  Plus,
  Trash2,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState([
    {
      image: "/assets/img/Certifications/gogreen.png",
      title: "GO GREEN",
      description: "Sustainable Manufacturing Commitment",
    },
    {
      image: "/assets/img/Certifications/iso.png",
      title: "ISO Certified",
      description: "Commitment to Quality & Excellence",
    },
    {
      image: "/assets/img/Certifications/year.png",
      title: "36 Years",
      description: "Decades of Manufacturing Excellence",
    },
    {
      image: "/assets/img/Certifications/outlook.png",
      title: "Industry Outlook",
      description: "Recognized Textile Machinery Manufacturer",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/home");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.certifications) && data.certifications.length > 0) {
            setCertifications(data.certifications);
          }
        }
      } catch (err) {
        console.error("Certifications load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFieldChange = (index, field, value) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const handleAdd = () => {
    setCertifications([
      ...certifications,
      {
        image: "",
        title: "New Certification",
        description: "Accreditation Details",
      },
    ]);
  };

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to remove this certification?")) {
      setCertifications(certifications.filter((_, i) => i !== index));
    }
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= certifications.length) return;
    const updated = [...certifications];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setCertifications(updated);
    setMessage({
      text: `Moved "${moved.title || 'Certification'}" to position #${target + 1}. Click "Save Changes" to apply.`,
      type: "info",
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e, index) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...certifications];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, moved);
    setCertifications(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);

    setMessage({
      text: `Reordered "${moved.title || 'Certification'}" to position #${dropIndex + 1}. Remember to click "Save Changes"!`,
      type: "info",
    });
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certifications }),
      });

      if (!res.ok) throw new Error("Failed to save certifications");

      setMessage({ text: "Certifications & Achievements updated successfully in MongoDB!", type: "success" });
    } catch (err) {
      setMessage({ text: err.message || "Error saving certifications", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading certifications...</div>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0", color: "#0f172a" }}>
            Certifications &amp; Achievements
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Manage quality standards, ISO certificates, and industry recognition badges shown on the homepage.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={handleAdd}
            className="admin-btn admin-btn-secondary"
          >
            <Plus size={16} />
            <span>Add Certification</span>
          </button>

          <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {message.text && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            backgroundColor: message.type === "success" ? "#dcfce7" : "#fee2e2",
            color: message.type === "success" ? "#15803d" : "#b91c1c",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
          }}
        >
          {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Reorder Hint */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: "#64748b",
          backgroundColor: "#f8fafc",
          padding: "8px 16px",
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          marginBottom: 20,
          width: "fit-content",
        }}
      >
        <ArrowUpDown size={14} />
        <span>💡 Drag cards using the ⠿ grip handle or click &larr; / &rarr; to change position order.</span>
      </div>

      {/* Certification Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        {certifications.map((item, idx) => {
          const isDragged = draggedIndex === idx;
          const isDragOver = dragOverIndex === idx;

          return (
            <div
              key={idx}
              className="admin-card"
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={(e) => handleDragLeave(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              style={{
                margin: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: isDragOver ? "2px solid #cb0000" : "1px solid #e2e8f0",
                backgroundColor: isDragOver ? "#fff1f2" : "#ffffff",
                opacity: isDragged ? 0.4 : 1,
                boxShadow: isDragOver
                  ? "0 4px 12px rgba(203, 0, 0, 0.15)"
                  : "0 2px 8px rgba(0,0,0,0.04)",
                position: "relative",
                transition: "all 0.15s ease",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    paddingBottom: 10,
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      title="Drag to reposition card"
                      style={{
                        cursor: "grab",
                        color: "#94a3b8",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      <GripVertical size={16} />
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#0f172a",
                        backgroundColor: "#f1f5f9",
                        borderRadius: 6,
                        padding: "2px 8px",
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <div style={{ display: "flex", gap: 2 }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, -1)}
                        title="Move left/previous"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 2,
                          cursor: idx === 0 ? "not-allowed" : "pointer",
                          color: idx === 0 ? "#cbd5e1" : "#64748b",
                        }}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === certifications.length - 1}
                        onClick={() => handleMove(idx, 1)}
                        title="Move right/next"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 2,
                          cursor: idx === certifications.length - 1 ? "not-allowed" : "pointer",
                          color: idx === certifications.length - 1 ? "#cbd5e1" : "#64748b",
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    title="Delete this certification"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>

              {/* Logo Upload with Instant Preview - ZERO Path input! */}
              <div style={{ marginBottom: 16 }}>
                <ImageUploadPreview
                  label="Badge Logo / Icon"
                  value={item.image}
                  onChange={(url) => handleFieldChange(idx, "image", url)}
                  maxHeight={110}
                  helpText="PNG with transparent background recommended"
                />
              </div>

              {/* Title / Tag */}
              <div className="admin-form-group">
                <label className="admin-label">Certification Title / Tag</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. ISO Certified"
                  value={item.title || ""}
                  onChange={(e) => handleFieldChange(idx, "title", e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="admin-form-group">
                <label className="admin-label">Subtitle / Description</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Commitment to Quality & Excellence"
                  value={item.description || ""}
                  onChange={(e) => handleFieldChange(idx, "description", e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <button
          type="button"
          onClick={handleAdd}
          className="admin-btn admin-btn-secondary"
        >
          <Plus size={16} />
          <span>Add Another Certification</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn-primary"
          style={{ padding: "12px 28px" }}
        >
          <Save size={16} />
          <span>{saving ? "Saving..." : "Save All Certifications"}</span>
        </button>
      </div>
    </div>
  );
}
