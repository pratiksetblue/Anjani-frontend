"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [reorderMsg, setReorderMsg] = useState({ text: "", type: "" });

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        // Sort by order ascending
        const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProducts(sorted);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const saveReorderedProducts = async (newProductsList, actionDescription = "") => {
    setReordering(true);
    setReorderMsg({ text: "Saving new order...", type: "info" });

    const items = newProductsList.map((p, index) => ({
      id: p.id || p._id,
      order: index + 1,
    }));

    try {
      const res = await fetch("/api/products/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) throw new Error("Failed to save reorder");

      setReorderMsg({
        text: actionDescription || "Order updated successfully! Position changes live on site.",
        type: "success",
      });

      setTimeout(() => {
        setReorderMsg((prev) => (prev.type === "success" ? { text: "", type: "" } : prev));
      }, 4000);
    } catch (err) {
      console.error("Save reorder error:", err);
      setReorderMsg({ text: "Failed to save order to database.", type: "error" });
    } finally {
      setReordering(false);
    }
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

    const updated = [...products];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, moved);

    const reordered = updated.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProducts(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);

    saveReorderedProducts(
      reordered,
      `Moved "${moved.title}" to position #${dropIndex + 1}!`
    );
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const updated = [...products];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    const reordered = updated.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProducts(reordered);

    saveReorderedProducts(
      reordered,
      `Moved "${moved.title}" ${direction === -1 ? "up" : "down"} to position #${targetIndex + 1}!`
    );
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting product");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0", color: "#0f172a" }}>
            Machinery & Products ({products.length})
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Manage the full catalog of textile dyeing & processing machinery.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={fetchProducts}
            className="admin-btn admin-btn-secondary"
            title="Refresh List"
          >
            <RefreshCw size={16} />
            <span className="d-none d-sm-inline">Refresh</span>
          </button>
          <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
            <Plus size={16} />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Reorder Status Message */}
      {reorderMsg.text && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            fontWeight: 500,
            backgroundColor:
              reorderMsg.type === "success"
                ? "#ecfdf5"
                : reorderMsg.type === "error"
                ? "#fef2f2"
                : "#eff6ff",
            color:
              reorderMsg.type === "success"
                ? "#065f46"
                : reorderMsg.type === "error"
                ? "#991b1b"
                : "#1e40af",
            border: `1px solid ${
              reorderMsg.type === "success"
                ? "#a7f3d0"
                : reorderMsg.type === "error"
                ? "#fecaca"
                : "#bfdbfe"
            }`,
          }}
        >
          {reorderMsg.type === "success" ? (
            <CheckCircle size={18} />
          ) : reorderMsg.type === "error" ? (
            <AlertCircle size={18} />
          ) : (
            <RefreshCw size={18} className="spin-animation" />
          )}
          <span>{reorderMsg.text}</span>
        </div>
      )}

      <div className="admin-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ position: "relative", maxWidth: 360, width: "100%" }}>
            <Search
              size={18}
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
              className="admin-input"
              style={{ paddingLeft: 40 }}
              placeholder="Search machines by name or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: search ? "#b45309" : "#64748b",
              backgroundColor: search ? "#fef3c7" : "#f8fafc",
              padding: "6px 14px",
              borderRadius: 20,
              border: `1px solid ${search ? "#fde68a" : "#e2e8f0"}`,
            }}
          >
            <ArrowUpDown size={14} />
            <span>
              {search
                ? "Reordering paused during search filter (clear search to reorder)"
                : "💡 Drag ⠿ grip handle or click ↑ / ↓ to reorder position"}
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            Loading products from MongoDB...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            No products match your search.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 130 }}>Position</th>
                  <th>Machine Name</th>
                  <th>Capacity</th>
                  <th>Brochure</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => {
                  const isDragged = draggedIndex === idx;
                  const isDragOver = dragOverIndex === idx;
                  const canDrag = !search && !reordering;

                  return (
                    <tr
                      key={p.id || p._id}
                      draggable={canDrag}
                      onDragStart={(e) => canDrag && handleDragStart(e, idx)}
                      onDragOver={(e) => canDrag && handleDragOver(e, idx)}
                      onDragLeave={(e) => canDrag && handleDragLeave(e, idx)}
                      onDrop={(e) => canDrag && handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      style={{
                        opacity: isDragged ? 0.4 : 1,
                        backgroundColor: isDragOver
                          ? "#fff1f2"
                          : isDragged
                          ? "#f8fafc"
                          : undefined,
                        borderTop: isDragOver ? "3px solid #cb0000" : undefined,
                        transition: "background-color 0.15s, border 0.15s, opacity 0.15s",
                      }}
                    >
                      {/* Position & Drag/Move Controls */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span
                            title={canDrag ? "Click and drag to reposition" : ""}
                            style={{
                              cursor: canDrag ? "grab" : "default",
                              color: canDrag ? "#64748b" : "#cbd5e1",
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "4px 2px",
                              borderRadius: 4,
                            }}
                          >
                            <GripVertical size={16} />
                          </span>

                          <span
                            style={{
                              display: "inline-block",
                              minWidth: 32,
                              textAlign: "center",
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#0f172a",
                              backgroundColor: "#f1f5f9",
                              borderRadius: 6,
                              padding: "3px 6px",
                            }}
                          >
                            #{idx + 1}
                          </span>

                          {!search && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <button
                                type="button"
                                disabled={idx === 0 || reordering}
                                onClick={() => handleMove(idx, -1)}
                                title="Move up"
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 1,
                                  cursor: idx === 0 || reordering ? "not-allowed" : "pointer",
                                  color: idx === 0 || reordering ? "#cbd5e1" : "#64748b",
                                  lineHeight: 1,
                                  display: "flex",
                                }}
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === products.length - 1 || reordering}
                                onClick={() => handleMove(idx, 1)}
                                title="Move down"
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: 1,
                                  cursor:
                                    idx === products.length - 1 || reordering
                                      ? "not-allowed"
                                      : "pointer",
                                  color:
                                    idx === products.length - 1 || reordering
                                      ? "#cbd5e1"
                                      : "#64748b",
                                  lineHeight: 1,
                                  display: "flex",
                                }}
                              >
                                <ChevronDown size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Machine Title & Image */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img
                            src={p.image}
                            alt=""
                            style={{
                              width: 44,
                              height: 44,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "1px solid #e2e8f0",
                              pointerEvents: "none",
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: "#0f172a" }}>{p.title}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>/{p.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ fontSize: 13 }}>{p.capacity}</td>

                      <td>
                        {p.brochureUrl ? (
                          <a
                            href={p.brochureUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontSize: 12,
                              color: "var(--admin-primary)",
                              textDecoration: "none",
                              fontWeight: 600,
                            }}
                          >
                            PDF Available
                          </a>
                        ) : (
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>None</span>
                        )}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <Link
                            href={`/${p.slug}`}
                            target="_blank"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="View Live Page"
                          >
                            <ExternalLink size={13} />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id || p._id}`}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="Edit Machine"
                          >
                            <Edit2 size={13} />
                            <span className="d-none d-sm-inline">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id || p._id, p.title)}
                            disabled={deletingId === (p.id || p._id)}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            title="Delete Product"
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
        )}
      </div>
    </div>
  );
}
