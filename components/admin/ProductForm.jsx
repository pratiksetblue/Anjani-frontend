"use client";

import React, { useState } from "react";
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

export default function ProductForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    capacity: initialData?.capacity || "From 150 Kg to 2000 Kg.",
    image: initialData?.image || "/assets/img/product/product1.jpg",
    brochureUrl: initialData?.brochureUrl || "/assets/pdf/U-TYPE-CATALOGUE.pdf",
    whatsappNumber: initialData?.whatsappNumber || "917096007670",
    order: initialData?.order || 1,
    featured: initialData?.featured !== undefined ? initialData.featured : true,
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    metaKeywords: initialData?.metaKeywords || "",
    highlights: initialData?.highlights?.length
      ? initialData.highlights
      : [
          "Low Liquor Ratio Dyeing",
          "Automatic Adjustable Nozzle",
          "PLC Controlled Process",
          "Reduced Water & Energy Consumption",
        ],
    paragraphs: initialData?.paragraphs?.length
      ? initialData.paragraphs
      : [
          "The ANJANI fabric dyeing machine delivers precision engineering, reliable performance, and optimized power and water consumption for modern textile manufacturers.",
        ],
    keyAdvantages: initialData?.keyAdvantages?.length
      ? initialData.keyAdvantages
      : [
          "SS 316L Corrosion-Resistant Construction",
          "Short Liquor Ratio Dyeing",
          "Efficient Heating & Cooling",
          "PLC-Based Process Control",
          "Smooth Fabric Transport",
        ],
    spaceModel: initialData?.spaceModel?.length
      ? initialData.spaceModel
      : [
          { model: "UT-150", capacity: "150 KG", length: "3500 MM", breadth: "1500 MM", height: "4000 MM" },
          { model: "UT-250", capacity: "250 KG", length: "4300 MM", breadth: "1650 MM", height: "4200 MM" },
        ],
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

  // Paragraphs handlers
  const handleParagraphChange = (index, value) => {
    const updated = [...formData.paragraphs];
    updated[index] = value;
    setFormData({ ...formData, paragraphs: updated });
  };
  const addParagraph = () => {
    setFormData({ ...formData, paragraphs: [...formData.paragraphs, ""] });
  };
  const removeParagraph = (index) => {
    setFormData({
      ...formData,
      paragraphs: formData.paragraphs.filter((_, i) => i !== index),
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

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

          {formData.highlights.map((h, i) => (
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
          ))}
        </div>

        {/* Description Paragraphs */}
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>
                4. Detailed Overview Paragraphs (Product Detail Page)
              </h2>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                Full textual descriptions appearing next to the machine photo on its page.
              </div>
            </div>
            <button
              type="button"
              onClick={addParagraph}
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              <Plus size={14} />
              <span>Add Paragraph</span>
            </button>
          </div>

          {formData.paragraphs.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <textarea
                rows={3}
                className="admin-textarea"
                value={p}
                placeholder="Enter description paragraph..."
                onChange={(e) => handleParagraphChange(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeParagraph(i)}
                className="admin-btn admin-btn-danger admin-btn-sm"
                style={{ alignSelf: "flex-start" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
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
