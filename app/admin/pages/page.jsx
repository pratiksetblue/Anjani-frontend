"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminPagesManager() {
  const [activeTab, setActiveTab] = useState("aboutUs");
  const [pages, setPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/pages/aboutUs");
        // Also fetch general pages or individual slugs
        const [aboutRes, storyRes, valuesRes] = await Promise.all([
          fetch("/api/pages/aboutUs"),
          fetch("/api/pages/ourStory"),
          fetch("/api/pages/valuesEthics"),
        ]);

        const aboutUs = aboutRes.ok ? await aboutRes.json() : {};
        const ourStory = storyRes.ok ? await storyRes.json() : {};
        const valuesEthics = valuesRes.ok ? await valuesRes.json() : {};

        setPages({ aboutUs, ourStory, valuesEthics });
      } catch (err) {
        console.error("Error loading pages:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (slug) => {
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pages[slug]),
      });

      if (!res.ok) throw new Error("Failed to save page");

      setMessage({ text: "Page content saved successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: err.message || "Error saving page", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading static pages...</div>;
  }

  if (!pages) {
    return <div style={{ padding: 40, textAlign: "center", color: "#b91c1c" }}>Failed to load pages</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0", color: "#0f172a" }}>
          Static Pages Content
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          Manage content for About Us, Our Story, and Values & Ethics pages.
        </p>
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

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[
          { id: "aboutUs", label: "About Us (/about-us)" },
          { id: "ourStory", label: "Our Story (/our-story)" },
          { id: "valuesEthics", label: "Values & Ethics (/values-ethics)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`admin-btn ${
              activeTab === tab.id ? "admin-btn-primary" : "admin-btn-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Form for Selected Tab */}
      <div className="admin-card">
        <div className="admin-form-group">
          <label className="admin-label">Banner Title</label>
          <input
            type="text"
            className="admin-input"
            value={pages[activeTab]?.bannerTitle || ""}
            onChange={(e) =>
              setPages({
                ...pages,
                [activeTab]: { ...pages[activeTab], bannerTitle: e.target.value },
              })
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Headline / Subheading</label>
          <textarea
            rows={2}
            className="admin-textarea"
            value={pages[activeTab]?.headline || pages[activeTab]?.title || ""}
            onChange={(e) =>
              setPages({
                ...pages,
                [activeTab]: {
                  ...pages[activeTab],
                  headline: e.target.value,
                  title: e.target.value,
                },
              })
            }
          />
        </div>

        {pages[activeTab]?.description !== undefined && (
          <div className="admin-form-group">
            <label className="admin-label">Description Text</label>
            <textarea
              rows={4}
              className="admin-textarea"
              value={pages[activeTab]?.description || ""}
              onChange={(e) =>
                setPages({
                  ...pages,
                  [activeTab]: { ...pages[activeTab], description: e.target.value },
                })
              }
            />
          </div>
        )}

        {pages[activeTab]?.paragraphs && (
          <div className="admin-form-group">
            <label className="admin-label">Body Paragraphs</label>
            {pages[activeTab].paragraphs.map((p, i) => (
              <textarea
                key={i}
                rows={3}
                className="admin-textarea"
                style={{ marginBottom: 10 }}
                value={p}
                onChange={(e) => {
                  const updated = [...pages[activeTab].paragraphs];
                  updated[i] = e.target.value;
                  setPages({
                    ...pages,
                    [activeTab]: { ...pages[activeTab], paragraphs: updated },
                  });
                }}
              />
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button
            onClick={() => handleSave(activeTab)}
            disabled={saving}
            className="admin-btn admin-btn-primary"
          >
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save Page Content"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
