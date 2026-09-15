"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle, AlertCircle, Video, PlaySquare } from "lucide-react";
import VideoUploadPreview from "@/components/admin/VideoUploadPreview";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default function AdminHeroPage() {
  const [hero, setHero] = useState({
    title: "",
    subtitle: "",
    buttonText: "Learn More",
    buttonLink: "/about-us",
    videoDesktop: "/assets/video/main.mp4",
    videoMobile: "/assets/video/mobile.mp4",
  });
  const [bannerImage, setBannerImage] = useState("/assets/img/home1/singleimg.jpg");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/home");
        if (res.ok) {
          const data = await res.json();
          if (data.hero) setHero(data.hero);
          if (data.bannerImage) setBannerImage(data.bannerImage);
        }
      } catch (err) {
        console.error("Hero load error:", err);
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
        body: JSON.stringify({ hero, bannerImage }),
      });

      if (!res.ok) throw new Error("Failed to save hero banner settings");

      setMessage({ text: "Hero banner and videos updated successfully in MongoDB!", type: "success" });
    } catch (err) {
      setMessage({ text: err.message || "Error saving hero settings", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading hero banner details...</div>;
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
            Hero Video Banner & Media
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Upload and preview homepage background videos, headlines, and call-to-action buttons.
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
        {/* Hero Headlines */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 18 }}>
            1. Main Headlines & Action Button
          </h2>

          <div className="admin-form-group">
            <label className="admin-label">Hero Main Headline *</label>
            <textarea
              rows={2}
              required
              className="admin-textarea"
              placeholder="e.g. Engineering the Future of Fabric Dyeing Machinery Since 1990"
              value={hero.title || ""}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Hero Subtitle</label>
            <textarea
              rows={2}
              className="admin-textarea"
              placeholder="e.g. Delivering advanced fabric dyeing machinery trusted by textile manufacturers worldwide for over 36 years."
              value={hero.subtitle || ""}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="admin-form-group">
              <label className="admin-label">CTA Button Text</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Learn More"
                value={hero.buttonText || ""}
                onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">CTA Button Link</label>
              <input
                type="text"
                className="admin-input"
                placeholder="/about-us or /products"
                value={hero.buttonLink || ""}
                onChange={(e) => setHero({ ...hero, buttonLink: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Video Uploads with Live Preview */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 18 }}>
            2. Video Background (Direct Upload & Live Player)
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
            <div>
              <VideoUploadPreview
                label="Desktop Background Video"
                value={hero.videoDesktop}
                onChange={(url) => setHero({ ...hero, videoDesktop: url })}
                helpText="MP4, WebM (Full HD 1080p recommended)"
              />
            </div>

            <div>
              <VideoUploadPreview
                label="Mobile Background Video"
                value={hero.videoMobile}
                onChange={(url) => setHero({ ...hero, videoMobile: url })}
                helpText="MP4, WebM (Vertical / Mobile ratio recommended)"
              />
            </div>
          </div>
        </div>

        {/* Middle Banner Image */}
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 18 }}>
            3. Wide Section Divider Banner Image
          </h2>

          <div style={{ maxWidth: 600 }}>
            <ImageUploadPreview
              label="Divider Banner Image (Appears below stats)"
              value={bannerImage}
              onChange={(url) => setBannerImage(url)}
              helpText="Wide photo of workshop / machinery (e.g. 1920x600px)"
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 40 }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: "12px 24px" }}>
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
