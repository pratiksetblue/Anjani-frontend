"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  History,
  Plus,
  Save,
  Trash2,
  CheckCircle,
  AlertCircle,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Eye,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";

export default function AdminTimelinePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' | 'preview'

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Load timeline items from API
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/timeline?all=true");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setItems(data);
          }
        } else {
          throw new Error("Failed to fetch timeline milestones");
        }
      } catch (err) {
        console.error("Timeline load error:", err);
        setMessage({ text: "Error loading timeline: " + err.message, type: "error" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFieldChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleAdd = () => {
    const nextOrder = items.length + 1;
    const newItem = {
      year: new Date().getFullYear().toString(),
      heading: "New Milestone",
      description: "Description of the milestone achieved by Anjani Industries.",
      order: nextOrder,
      isLarge: false,
      isActive: true,
      isNew: true,
    };
    setItems([...items, newItem]);
    setMessage({
      text: "New milestone added at the bottom. Fill in the details and click 'Save All Changes'.",
      type: "info",
    });
  };

  const handleDelete = async (index) => {
    const item = items[index];
    if (!confirm(`Are you sure you want to remove the milestone for year "${item.year}"?`)) {
      return;
    }

    if (item._id && !item.isNew) {
      try {
        const res = await fetch(`/api/timeline/${item._id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete item from server");
      } catch (err) {
        setMessage({ text: "Error deleting item: " + err.message, type: "error" });
        return;
      }
    }

    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    setMessage({ text: "Milestone removed successfully.", type: "success" });
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    setItems(updated);
    setMessage({
      text: `Moved milestone "${moved.year}" to position #${target + 1}. Click 'Save All Changes' to apply.`,
      type: "info",
    });
  };

  // Drag & drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...items];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);

    setItems(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setMessage({
      text: `Moved milestone "${moved.year}" to position #${index + 1}. Click 'Save All Changes' to apply.`,
      type: "info",
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      // Validate all items
      for (let i = 0; i < items.length; i++) {
        if (!items[i].year || !items[i].year.trim()) {
          throw new Error(`Milestone #${i + 1} requires a Year value.`);
        }
        if (!items[i].description || !items[i].description.trim()) {
          throw new Error(`Milestone #${i + 1} (${items[i].year}) requires a Description.`);
        }
      }

      // Save each item
      const savedItems = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const payload = {
          year: item.year.trim(),
          heading: item.heading || "",
          description: item.description.trim(),
          order: i + 1,
          isLarge: !!item.isLarge,
          isActive: item.isActive !== false,
        };

        if (item._id && !item.isNew) {
          const res = await fetch(`/api/timeline/${item._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`Failed to update milestone "${item.year}"`);
          const updated = await res.json();
          savedItems.push(updated);
        } else {
          const res = await fetch("/api/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`Failed to create milestone "${item.year}"`);
          const created = await res.json();
          savedItems.push(created);
        }
      }

      setItems(savedItems);
      setMessage({
        text: `Successfully saved all ${savedItems.length} milestones! Live website updated.`,
        type: "success",
      });
    } catch (err) {
      console.error("Save error:", err);
      setMessage({ text: err.message || "Failed to save timeline", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
        Loading timeline milestones...
      </div>
    );
  }

  return (
    <div>
      {/* Header Banner */}
      <div
        className="admin-card"
        style={{
          padding: "20px 24px",
          borderRadius: 12,
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          backgroundColor: "#ffffff",
          borderLeft: "4px solid #df0000",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: "#fee2e2",
              color: "#df0000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <History size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px 0", color: "#0f172a" }}>
              Our Story Timeline Milestones
            </h1>
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
              Manage the milestones, years, titles, and descriptions shown in "The Story of ANJANI INDUSTRIES" on /our-story.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link
            href="/our-story"
            target="_blank"
            className="admin-btn admin-btn-secondary"
            title="Open live /our-story page in new tab"
          >
            <ExternalLink size={16} />
            <span>View Live Page</span>
          </Link>
          <button
            onClick={handleAdd}
            className="admin-btn"
            style={{
              backgroundColor: "#0f172a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Plus size={16} />
            <span>Add Milestone</span>
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save All Changes"}</span>
          </button>
        </div>
      </div>

      {/* Message Banner */}
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
            backgroundColor:
              message.type === "success"
                ? "#dcfce7"
                : message.type === "info"
                ? "#e0f2fe"
                : "#fee2e2",
            color:
              message.type === "success"
                ? "#15803d"
                : message.type === "info"
                ? "#0369a1"
                : "#b91c1c",
            border: `1px solid ${
              message.type === "success"
                ? "#bbf7d0"
                : message.type === "info"
                ? "#bae6fd"
                : "#fecaca"
            }`,
          }}
        >
          {message.type === "success" ? (
            <CheckCircle size={18} />
          ) : message.type === "info" ? (
            <Info size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs / Info Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setActiveTab("editor")}
            className={`admin-btn ${activeTab === "editor" ? "admin-btn-primary" : "admin-btn-secondary"}`}
          >
            Milestone List & Editor ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`admin-btn ${activeTab === "preview" ? "admin-btn-primary" : "admin-btn-secondary"}`}
          >
            <Eye size={15} style={{ marginRight: 6 }} />
            Live Preview
          </button>
        </div>

        <div style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={15} color="#e00000" />
          <span>
            HTML supported in headings & descriptions: <code>&lt;strong&gt;</code> for bold, <code>&lt;span className="highlight"&gt;</code> for red highlight.
          </span>
        </div>
      </div>

      {/* VIEW: LIVE PREVIEW TAB */}
      {activeTab === "preview" && (
        <div
          className="admin-card"
          style={{
            padding: "30px",
            backgroundColor: "#ffffff",
            borderRadius: 12,
            marginBottom: 24,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111111", margin: "0 0 8px 0" }}>
              The Story of ANJANI INDUSTRIES
            </h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Preview of how the timeline renders on the public /our-story page.
            </p>
          </div>

          <div
            style={{
              position: "relative",
              paddingLeft: 0,
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            {/* Vertical dashed line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: 3,
                borderLeft: "3px dashed #e00000",
                zIndex: 1,
              }}
            />

            {items
              .filter((it) => it.isActive !== false)
              .map((item, idx) => (
                <div
                  key={item._id || idx}
                  style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: "180px 320px 1fr",
                    alignItems: "center",
                    minHeight: item.isLarge ? 130 : 90,
                    marginBottom: 14,
                    marginLeft: 2,
                    padding: "16px 24px 16px 0",
                    background: "#f3f3f3",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      zIndex: 3,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "max-content",
                      minWidth: 105,
                      minHeight: 35,
                      padding: "5px 16px",
                      background: "#df0000",
                      color: "#ffffff",
                      fontSize: 19,
                      fontWeight: 600,
                      marginLeft: -2,
                    }}
                  >
                    {item.year}
                  </div>

                  <div
                    style={{
                      padding: "0 20px 0 0",
                      fontSize: 17,
                      lineHeight: 1.4,
                      fontWeight: 600,
                      color: "#111111",
                    }}
                    dangerouslySetInnerHTML={{ __html: item.heading || "" }}
                  />

                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: "#333333",
                    }}
                    dangerouslySetInnerHTML={{ __html: item.description || "" }}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* VIEW: EDITOR TAB */}
      {activeTab === "editor" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((item, index) => (
            <div
              key={item._id || `new-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className="admin-card"
              style={{
                padding: "16px 20px",
                borderRadius: 10,
                backgroundColor: item.isActive === false ? "#fafafa" : "#ffffff",
                border:
                  dragOverIndex === index
                    ? "2px dashed var(--admin-primary)"
                    : item.isActive === false
                    ? "1px dashed #cbd5e1"
                    : "1px solid #e2e8f0",
                opacity: draggedIndex === index ? 0.4 : item.isActive === false ? 0.75 : 1,
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  paddingBottom: 10,
                  borderBottom: "1px solid #f1f5f9",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      cursor: "grab",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                    }}
                    title="Drag to reorder"
                  >
                    <GripVertical size={20} />
                  </div>

                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748b",
                      backgroundColor: "#f1f5f9",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    #{index + 1}
                  </span>

                  {/* Red Year Badge Preview */}
                  <div
                    style={{
                      backgroundColor: "#df0000",
                      color: "#ffffff",
                      fontSize: 14,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 2,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.year || "Year"}
                  </div>

                  {item.heading && (
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0f172a",
                        maxWidth: 350,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.heading.replace(/<[^>]+>/g, "")}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Reorder Buttons */}
                  <button
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: "4px 8px", opacity: index === 0 ? 0.3 : 1 }}
                    title="Move Up"
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    onClick={() => handleMove(index, 1)}
                    disabled={index === items.length - 1}
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: "4px 8px", opacity: index === items.length - 1 ? 0.3 : 1 }}
                    title="Move Down"
                  >
                    <ChevronDown size={15} />
                  </button>

                  {/* Active Toggle */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      cursor: "pointer",
                      marginLeft: 6,
                      color: item.isActive !== false ? "#16a34a" : "#94a3b8",
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.isActive !== false}
                      onChange={(e) => handleFieldChange(index, "isActive", e.target.checked)}
                    />
                    {item.isActive !== false ? "Visible" : "Hidden"}
                  </label>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(index)}
                    className="admin-btn"
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                    title="Delete milestone"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 1.5fr",
                  gap: 14,
                  alignItems: "start",
                }}
              >
                <div>
                  <label className="admin-label" style={{ fontSize: 12, marginBottom: 4 }}>
                    Year / Badge <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={item.year || ""}
                    placeholder="e.g. 1990, 2025"
                    onChange={(e) => handleFieldChange(index, "year", e.target.value)}
                    style={{ fontWeight: 600 }}
                  />
                  <div style={{ marginTop: 6 }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        color: "#64748b",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!item.isLarge}
                        onChange={(e) => handleFieldChange(index, "isLarge", e.target.checked)}
                      />
                      Expanded layout
                    </label>
                  </div>
                </div>

                <div>
                  <label className="admin-label" style={{ fontSize: 12, marginBottom: 4 }}>
                    Milestone Heading / Title
                  </label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={item.heading || ""}
                    placeholder="e.g. Foundation of Excellence"
                    onChange={(e) => handleFieldChange(index, "heading", e.target.value)}
                  />
                </div>

                <div>
                  <label className="admin-label" style={{ fontSize: 12, marginBottom: 4 }}>
                    Milestone Description <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    value={item.description || ""}
                    placeholder="Details about this milestone..."
                    onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div
              className="admin-card"
              style={{
                padding: 40,
                textAlign: "center",
                color: "#64748b",
                borderRadius: 10,
              }}
            >
              <History size={40} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ margin: "0 0 6px 0", color: "#0f172a" }}>No Milestones Found</h3>
              <p style={{ margin: "0 0 16px 0", fontSize: 14 }}>
                Click below to add your first milestone for the Our Story timeline.
              </p>
              <button onClick={handleAdd} className="admin-btn admin-btn-primary">
                <Plus size={16} />
                <span>Add First Milestone</span>
              </button>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div
            style={{
              position: "sticky",
              bottom: 20,
              backgroundColor: "#ffffff",
              padding: "16px 24px",
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
              border: "1px solid #e2e8f0",
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: 14, color: "#64748b" }}>
              Total Milestones: <strong style={{ color: "#0f172a" }}>{items.length}</strong> | Active:{" "}
              <strong style={{ color: "#16a34a" }}>
                {items.filter((i) => i.isActive !== false).length}
              </strong>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleAdd}
                className="admin-btn admin-btn-secondary"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={16} />
                <span>Add Milestone</span>
              </button>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="admin-btn admin-btn-primary"
                style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 160 }}
              >
                <Save size={16} />
                <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
