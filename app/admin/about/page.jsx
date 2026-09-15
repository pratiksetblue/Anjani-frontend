"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle, AlertCircle, BookOpen } from "lucide-react";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default function AdminAboutPage() {
  const [about, setAbout] = useState({
    badge: "About Our Story",
    title: "Anjani – A Leading Manufacturer of Fabric Dyeing Machinery",
    highlight:
      "Established in 1990, Anjani Industries is one of India's leading manufacturers of textile dyeing and processing machinery, backed by over 36 years of engineering excellence.",
    productsHighlight:
      "Our comprehensive product portfolio includes Low Liquor Ratio ECO+ Soft Flow Dyeing Machines, U-Type Jet Dyeing Machines, Long Tube Rapid Jet Dyeing Machines, Weight Reduction (Scouring) Machines, Caustic Recovery Plants, and a wide range of customized textile processing machinery.",
    description:
      "Every machine is precision-engineered to optimize water, steam, and power consumption while improving productivity, reducing processing time, and ensuring consistent performance for modern textile manufacturers worldwide.",
    image: "/assets/img/home1/about-img.jpg",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/home");
        if (res.ok) {
          const data = await res.json();
          if (data.about) setAbout(data.about);
        }
      } catch (err) {
        console.error("About load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about }),
      });

      if (!res.ok) throw new Error("Failed to save about section");

      setMessage({ text: "About section content saved successfully in MongoDB!", type: "success" });
    } catch (err) {
      setMessage({ text: err.message || "Error saving content", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading about section...</div>;
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
            About Section Content
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Manage the homepage company introduction, key narrative highlights, and photo.
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
          <Save size={16} />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
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

      <form onSubmit={handleSave}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
          {/* Left: Text Content */}
          <div className="admin-card">
            <h2 className="admin-card-title" style={{ marginBottom: 18 }}>
              1. Story Narrative & Headings
            </h2>

            <div className="admin-form-group">
              <label className="admin-label">Top Badge Text</label>
              <input
                type="text"
                className="admin-input"
                placeholder="About Our Story"
                value={about.badge || ""}
                onChange={(e) => setAbout({ ...about, badge: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Main Section Heading</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Anjani – A Leading Manufacturer..."
                value={about.title || ""}
                onChange={(e) => setAbout({ ...about, title: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Red Highlight Text (Bold statement)</label>
              <textarea
                rows={3}
                className="admin-textarea"
                placeholder="Established in 1990, Anjani Industries..."
                value={about.highlight || ""}
                onChange={(e) => setAbout({ ...about, highlight: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Products Portfolio Highlight</label>
              <textarea
                rows={3}
                className="admin-textarea"
                placeholder="Our comprehensive product portfolio includes..."
                value={about.productsHighlight || ""}
                onChange={(e) => setAbout({ ...about, productsHighlight: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Detail Overview Paragraph</label>
              <textarea
                rows={4}
                className="admin-textarea"
                placeholder="Every machine is precision-engineered to optimize..."
                value={about.description || ""}
                onChange={(e) => setAbout({ ...about, description: e.target.value })}
              />
            </div>
          </div>

          {/* Right: Featured Photo */}
          <div>
            <div className="admin-card">
              <h2 className="admin-card-title" style={{ marginBottom: 18 }}>
                2. Featured Section Photo
              </h2>

              <ImageUploadPreview
                label="About Story Machine / Factory Photo"
                value={about.image}
                onChange={(url) => setAbout({ ...about, image: url })}
                maxHeight={260}
                helpText="High quality photo of machinery or manufacturing unit"
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20, marginBottom: 40 }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: "12px 28px" }}>
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save About Section"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
