"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Plus,
  Trash2,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

export default function AdminCountersPage() {
  const [counters, setCounters] = useState([
    { number: "36", suffix: "+", label: "Years of Industry Excellence" },
    { number: "45", suffix: "K", label: "Sq Ft Production Facility" },
    { number: "270", suffix: "", label: "Pcs Annual Production Capacity" },
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
          if (Array.isArray(data.counters) && data.counters.length > 0) {
            setCounters(data.counters);
          }
        }
      } catch (err) {
        console.error("Counters load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFieldChange = (index, field, value) => {
    const updated = [...counters];
    updated[index] = { ...updated[index], [field]: value };
    setCounters(updated);
  };

  const handleAdd = () => {
    setCounters([
      ...counters,
      { number: "100", suffix: "+", label: "New Metric" },
    ]);
  };

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to remove this counter metric?")) {
      setCounters(counters.filter((_, i) => i !== index));
    }
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= counters.length) return;
    const updated = [...counters];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setCounters(updated);
    setMessage({
      text: `Moved metric to position #${target + 1}. Click "Save Changes" to save.`,
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

    const updated = [...counters];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, moved);
    setCounters(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);

    setMessage({
      text: `Reordered metric to position #${dropIndex + 1}. Click "Save Changes" to apply.`,
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
        body: JSON.stringify({ counters }),
      });

      if (!res.ok) throw new Error("Failed to save counters");

      setMessage({ text: "Counter statistics updated successfully in MongoDB!", type: "success" });
    } catch (err) {
      setMessage({ text: err.message || "Error saving counters", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading counter statistics...</div>;
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
            Counter Statistics
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Manage the highlight statistics numbers shown across the homepage.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={handleAdd}
            className="admin-btn admin-btn-secondary"
          >
            <Plus size={16} />
            <span>Add Counter</span>
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
        <span>💡 Drag counter cards using the ⠿ grip handle or click &larr; / &rarr; to reorder position.</span>
      </div>

      {/* Counters Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        {counters.map((item, idx) => {
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
                        disabled={idx === counters.length - 1}
                        onClick={() => handleMove(idx, 1)}
                        title="Move right/next"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 2,
                          cursor: idx === counters.length - 1 ? "not-allowed" : "pointer",
                          color: idx === counters.length - 1 ? "#cbd5e1" : "#64748b",
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {counters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    title="Delete counter"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                )}
              </div>

              {/* Number and Suffix inputs side-by-side */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 14 }}>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Number *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. 36 or 1200"
                    value={item.number || ""}
                    onChange={(e) => handleFieldChange(idx, "number", e.target.value)}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Suffix</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. + or K"
                    value={item.suffix || ""}
                    onChange={(e) => handleFieldChange(idx, "suffix", e.target.value)}
                  />
                </div>
              </div>

              {/* Counter Label */}
              <div className="admin-form-group">
                <label className="admin-label">Metric Label / Description *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. Years of Industry Excellence"
                  value={item.label || ""}
                  onChange={(e) => handleFieldChange(idx, "label", e.target.value)}
                />
              </div>

              {/* Live Preview badge */}
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 16px",
                  borderRadius: 8,
                  backgroundColor: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--admin-primary)" }}>
                  {item.number || "0"}
                  <span>{item.suffix || ""}</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", fontWeight: 600, marginTop: 2 }}>
                  {item.label || "Preview Label"}
                </div>
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
          <span>Add Another Stat</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn-primary"
          style={{ padding: "12px 28px" }}
        >
          <Save size={16} />
          <span>{saving ? "Saving..." : "Save Counter Statistics"}</span>
        </button>
      </div>
    </div>
  );
}
