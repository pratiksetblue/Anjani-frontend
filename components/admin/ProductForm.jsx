"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import ImageUploadPreview from "./ImageUploadPreview";
import PdfUploadPreview from "./PdfUploadPreview";
import RichTextEditor from "./RichTextEditor";

export default function ProductForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const initialDescription = useMemo(() => {
    if (initialData?.description && typeof initialData.description === "string") {
      return initialData.description;
    }
    if (Array.isArray(initialData?.paragraphs) && initialData.paragraphs.length > 0) {
      return initialData.paragraphs
        .map((p) => (p.trim().startsWith("<p>") ? p : `<p>${p}</p>`))
        .join("");
    }
    return "";
  }, [initialData]);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    capacity: initialData?.capacity || "",
    image: initialData?.image || "",
    brochureUrl: initialData?.brochureUrl || "",
    whatsappNumber: initialData?.whatsappNumber || "",
    order: initialData?.order !== undefined ? initialData.order : 1,
    featured: initialData?.featured !== undefined ? initialData.featured : true,
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    metaKeywords: initialData?.metaKeywords || "",
    highlights: Array.isArray(initialData?.highlights) ? initialData.highlights : [],
    description: initialDescription,
    paragraphs: Array.isArray(initialData?.paragraphs) ? initialData.paragraphs : [],
    keyAdvantages: Array.isArray(initialData?.keyAdvantages) ? initialData.keyAdvantages : [],
    spaceModel: Array.isArray(initialData?.spaceModel) ? initialData.spaceModel : [],
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => {
      const updates = { title };
      if (!isEdit || !prev.slug) {
        updates.slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return { ...prev, ...updates };
    });
  };

  // Highlights handlers
  const handleHighlightChange = (index, value) => {
    const updated = [...formData.highlights];
    updated[index] = value;
    setFormData({ ...formData, highlights: updated });
  };
  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ""] });
  };
  const removeHighlight = (index) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index),
    });
  };

  // Key advantages handlers
  const handleAdvantageChange = (index, value) => {
    const updated = [...formData.keyAdvantages];
    updated[index] = value;
    setFormData({ ...formData, keyAdvantages: updated });
  };
  const addAdvantage = () => {
    setFormData({
      ...formData,
      keyAdvantages: [...formData.keyAdvantages, ""],
    });
  };
  const removeAdvantage = (index) => {
    setFormData({
      ...formData,
      keyAdvantages: formData.keyAdvantages.filter((_, i) => i !== index),
    });
  };

  // Space model row handlers
  const handleRowChange = (index, field, value) => {
    const updated = [...formData.spaceModel];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, spaceModel: updated });
  };
  const addRow = () => {
    setFormData({
      ...formData,
      spaceModel: [
        ...formData.spaceModel,
        { model: "", capacity: "", length: "", breadth: "", height: "" },
      ],
    });
  };
  const removeRow = (index) => {
    setFormData({
      ...formData,
      spaceModel: formData.spaceModel.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const url = isEdit
        ? `/api/products/${initialData.id || initialData._id}`
        : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      // Clean and sanitize description HTML
      const cleanDesc = (formData.description || "").trim();
      const isDescEmpty =
        !cleanDesc ||
        cleanDesc === "<p><br></p>" ||
        cleanDesc.replace(/<[^>]*>/g, "").trim().length === 0;
      const finalDescription = isDescEmpty ? "" : cleanDesc;

      // Sync paragraphs from description HTML for backward compatibility
      let derivedParagraphs = [];
      if (finalDescription) {
        const matches = finalDescription.match(/<p>[\s\S]*?<\/p>/gi);
        if (matches && matches.length > 0) {
          derivedParagraphs = matches.filter(
            (p) => p.replace(/<[^>]*>/g, "").trim().length > 0
          );
        } else {
          derivedParagraphs = [finalDescription];
        }
      }

      const payload = {
        ...formData,
        description: finalDescription,
        highlights: formData.highlights.filter((h) => h && h.trim()),
        paragraphs: derivedParagraphs,
        keyAdvantages: formData.keyAdvantages.filter((a) => a && a.trim()),
        spaceModel: formData.spaceModel.filter((r) =>
          r && Object.values(r).some((v) => v && v.toString().trim())
        ),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to save product");

      setMessage({ text: "Product saved successfully to MongoDB!", type: "success" });
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1000);
    } catch (err) {
      setMessage({ text: err.message || "Error saving product", type: "error" });
    } finally {
      setSaving(false);
    }
  };

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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/products" className="admin-btn admin-btn-secondary admin-btn-sm">
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#0f172a" }}>
            {isEdit ? `Edit: ${initialData?.title}` : "Add New Machine / Product"}
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="admin-btn admin-btn-primary"
        >
          <Save size={16} />
          <span>{saving ? "Saving..." : "Save Product"}</span>
        </button>
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

      <form onSubmit={handleSubmit}>
        {/* Basic Details */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 18 }}>
            1. Machine Identity & Basic Specs
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <div className="admin-form-group">
              <label className="admin-label">Machine Title *</label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="e.g. PLC Based U Type Rapid Jet Dyeing Machine"
                value={formData.title}
                onChange={handleTitleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">URL Slug (e.g. /my-machine)</label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="plc-based-u-type-rapid-jet-dyeing-machine"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Capacity Text</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. CAPACITY: From 150 Kg to 500 Kg"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Display Order</label>
              <input
                type="number"
                className="admin-input"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        {/* Media & Files */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 18 }}>
            2. Featured Photo & Brochure
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            <ImageUploadPreview
              label="Featured Machine Image"
              value={formData.image}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              helpText="JPG, PNG, WebP (Machine catalog photo)"
            />

            <PdfUploadPreview
              label="Downloadable Brochure (PDF)"
              value={formData.brochureUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, brochureUrl: url }))}
              helpText="PDF catalog document for customers to download"
            />
          </div>
        </div>

        {/* Highlights */}
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>
                3. Bullet Highlights (Shown in Product Card on Catalog Page)
              </h2>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                Short bullet points describing the machine on /products
              </div>
            </div>
            <button
              type="button"
              onClick={addHighlight}
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              <Plus size={14} />
              <span>Add Bullet</span>
            </button>
          </div>

          {formData.highlights.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic", padding: "10px 0" }}>
              No bullet highlights added. Click &quot;Add Bullet&quot; to add one.
            </div>
          ) : (
            formData.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <input
                  type="text"
                  className="admin-input"
                  value={h}
                  placeholder="e.g. Automatic Adjustable Nozzle"
                  onChange={(e) => handleHighlightChange(i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(i)}
                  className="admin-btn admin-btn-danger admin-btn-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Description Rich Text Editor */}
        <div className="admin-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>
                4. Machine Description (Rich Text Editor)
              </h2>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                Detailed overview shown next to machine catalog photo on its details page.
              </div>
            </div>
            {formData.description && (
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, description: "" }))}
                className="admin-btn admin-btn-danger admin-btn-sm"
                title="Clear all description text"
              >
                <Trash2 size={14} />
                <span>Clear Description</span>
              </button>
            )}
          </div>

          <RichTextEditor
            value={formData.description}
            onChange={(content) =>
              setFormData((prev) => ({ ...prev, description: content }))
            }
            placeholder="Enter product description here..."
            minHeight={220}
          />
        </div>

        {/* Key Advantages */}
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>
                5. Key Advantages (Grid items)
              </h2>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                Advantage badges displayed in the 2-column grid.
              </div>
            </div>
            <button
              type="button"
              onClick={addAdvantage}
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              <Plus size={14} />
              <span>Add Advantage</span>
            </button>
          </div>

          {formData.keyAdvantages.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic", padding: "10px 0" }}>
              No key advantages added. Click &quot;Add Advantage&quot; to add one.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 12 }}>
              {formData.keyAdvantages.map((adv, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={adv}
                    placeholder="e.g. SS 316L Corrosion-Resistant Construction"
                    onChange={(e) => handleAdvantageChange(i, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeAdvantage(i)}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Space Requirement Model Table */}
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>
                6. Space Requirement Model (Specifications Table)
              </h2>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                Technical dimensions table shown at the bottom of the product page.
              </div>
            </div>
            <button
              type="button"
              onClick={addRow}
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              <Plus size={14} />
              <span>Add Table Row</span>
            </button>
          </div>

          {formData.spaceModel.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic", padding: "12px 0" }}>
              No specification table rows added. Click &quot;Add Table Row&quot; to add specifications.
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Capacity / Width</th>
                    <th>Length</th>
                    <th>Breadth</th>
                    <th>Height</th>
                    <th style={{ width: 50 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.spaceModel.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="UT-150"
                          value={row.model || ""}
                          onChange={(e) => handleRowChange(i, "model", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="150 KG or 1500 MM"
                          value={row.capacity || row.width || ""}
                          onChange={(e) => handleRowChange(i, "capacity", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="3500 MM"
                          value={row.length || ""}
                          onChange={(e) => handleRowChange(i, "length", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="1500 MM"
                          value={row.breadth || ""}
                          onChange={(e) => handleRowChange(i, "breadth", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="4000 MM"
                          value={row.height || ""}
                          onChange={(e) => handleRowChange(i, "height", e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeRow(i)}
                          className="admin-btn admin-btn-danger admin-btn-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Machine SEO & Meta Tags */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 18 }}>
            7. Machine SEO &amp; Google Search Meta Tags
          </h2>

          <div className="admin-form-group">
            <label className="admin-label">Meta Title (Google Search Result Title)</label>
            <input
              type="text"
              className="admin-input"
              placeholder={`${formData.title || "Machine Title"} | Anjani Industries`}
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
            />
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              Leave blank to use default: <code>{formData.title || "Machine Title"} | Anjani Industries</code>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Meta Description (Snippet in Search Results)</label>
            <textarea
              rows={3}
              className="admin-textarea"
              placeholder="Detailed description of this fabric dyeing machine for search engines..."
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            />
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              Recommended: 140 - 160 characters. Character count: {formData.metaDescription?.length || 0}
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Meta Keywords (Comma-separated)</label>
            <input
              type="text"
              className="admin-input"
              placeholder="e.g. rapid jet dyeing, U type dyeing machine, fabric dyeing machinery surat"
              value={formData.metaKeywords}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
            />
          </div>
        </div>

        {/* Bottom Save Action */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 40 }}>
          <Link href="/admin/products" className="admin-btn admin-btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ padding: "12px 24px" }}
          >
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
