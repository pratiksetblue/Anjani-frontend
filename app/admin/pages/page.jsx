"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle,
  AlertCircle,
  History,
  ArrowRight,
  ExternalLink,
  Plus,
  Trash2,
  Image as ImageIcon,
  Settings,
  Sparkles,
} from "lucide-react";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default function AdminPagesManager() {
  const [activeTab, setActiveTab] = useState("aboutUs");
  const [pages, setPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function load() {
      try {
        const [aboutRes, storyRes, valuesRes, productsRes, contactRes, ecardRes] = await Promise.all([
          fetch("/api/pages/aboutUs"),
          fetch("/api/pages/ourStory"),
          fetch("/api/pages/valuesEthics"),
          fetch("/api/pages/productsPage"),
          fetch("/api/pages/contactUs"),
          fetch("/api/pages/ecard"),
        ]);

        const aboutUs = aboutRes.ok ? await aboutRes.json() : {};
        const ourStory = storyRes.ok ? await storyRes.json() : {};
        const valuesEthics = valuesRes.ok ? await valuesRes.json() : {};
        const productsPage = productsRes.ok ? await productsRes.json() : {};
        const contactUs = contactRes.ok ? await contactRes.json() : {};
        const ecard = ecardRes.ok ? await ecardRes.json() : {};

        setPages({ aboutUs, ourStory, valuesEthics, productsPage, contactUs, ecard });
      } catch (err) {
        console.error("Error loading pages:", err);
        setMessage({ text: "Failed to load pages data: " + err.message, type: "error" });
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

      setMessage({ text: "All section changes saved successfully! Live website updated.", type: "success" });
    } catch (err) {
      setMessage({ text: err.message || "Error saving page", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const updateNested = (slug, path, value) => {
    const pageCopy = { ...pages[slug] };
    const parts = path.split(".");
    let current = pageCopy;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setPages({ ...pages, [slug]: pageCopy });
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
        Loading static pages content...
      </div>
    );
  }

  if (!pages) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#b91c1c" }}>
        Failed to load pages
      </div>
    );
  }

  const liveLinks = {
    aboutUs: "/about-us",
    ourStory: "/our-story",
    valuesEthics: "/values-ethics",
    productsPage: "/products",
    contactUs: "/contact-us",
    ecard: "/ecard",
  };

  return (
    <div>
      {/* Header Banner */}
      <div
        className="admin-card"
        style={{
          padding: "20px 24px",
          borderRadius: 12,
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          backgroundColor: "#ffffff",
          borderLeft: "4px solid var(--admin-primary)",
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px 0", color: "#0f172a" }}>
            Static Pages Section Manager
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Manage all content sections, banners, images, leadership quotes, and pillars across the entire website.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href={liveLinks[activeTab] || "/"}
            target="_blank"
            className="admin-btn admin-btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <ExternalLink size={16} />
            <span>View Live Page</span>
          </Link>
          <button
            onClick={() => handleSave(activeTab)}
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <Save size={16} />
            <span>{saving ? "Saving Changes..." : "Save Page Content"}</span>
          </button>
        </div>
      </div>

      {/* Notification Message */}
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

      {/* Page Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { id: "aboutUs", label: "About Us (/about-us)" },
          { id: "ourStory", label: "Our Story (/our-story)" },
          { id: "valuesEthics", label: "Values & Ethics (/values-ethics)" },
          { id: "productsPage", label: "Products Page (/products)" },
          { id: "contactUs", label: "Contact Us (/contact-us)" },
          { id: "ecard", label: "Digital E-Card (/ecard)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setMessage({ text: "", type: "" });
            }}
            className={`admin-btn ${activeTab === tab.id ? "admin-btn-primary" : "admin-btn-secondary"}`}
            style={{ fontWeight: 600, padding: "10px 18px" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: OUR STORY
      ========================================================================= */}
      {activeTab === "ourStory" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 1</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Breadcrumb & Banner</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="admin-label">Banner Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.ourStory?.bannerTitle || ""}
                  onChange={(e) => updateNested("ourStory", "bannerTitle", e.target.value)}
                />
              </div>
              <div>
                <ImageUploadPreview
                  label="Banner Background Image"
                  value={pages.ourStory?.bannerImage || "/assets/img/our-story-banner.jpg"}
                  onChange={(val) => updateNested("ourStory", "bannerImage", val)}
                />
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 2</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Red Box Journey Quote</h3>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Main Heading (HTML / &lt;br /&gt; supported)</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={pages.ourStory?.redBoxTitle || ""}
                onChange={(e) => updateNested("ourStory", "redBoxTitle", e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Vision Subtitle</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={pages.ourStory?.redBoxSubtitle || ""}
                onChange={(e) => updateNested("ourStory", "redBoxSubtitle", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 3</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Milestone Timeline</h3>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Section Title</label>
              <input
                type="text"
                className="admin-input"
                value={pages.ourStory?.timelineTitle || "The Story of ANJANI INDUSTRIES"}
                onChange={(e) => updateNested("ourStory", "timelineTitle", e.target.value)}
              />
            </div>
            <div
              style={{
                padding: "16px 20px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <History size={22} color="#df0000" />
                <div>
                  <strong style={{ color: "#991b1b", fontSize: 14 }}>Manage Milestones (1990 to Present)</strong>
                  <p style={{ margin: "2px 0 0 0", color: "#7f1d1d", fontSize: 13 }}>
                    Milestone years, headings, descriptions, and reordering are managed in the dedicated Timeline module.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/timeline"
                className="admin-btn admin-btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <span>Open Timeline Manager</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ABOUT US
      ========================================================================= */}
      {activeTab === "aboutUs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 1</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Breadcrumb & Banner</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="admin-label">Banner Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.aboutUs?.bannerTitle || ""}
                  onChange={(e) => updateNested("aboutUs", "bannerTitle", e.target.value)}
                />
              </div>
              <div>
                <ImageUploadPreview
                  label="Banner Background Image"
                  value={pages.aboutUs?.bannerImage || "/assets/img/about-banner.jpg"}
                  onChange={(val) => updateNested("aboutUs", "bannerImage", val)}
                />
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 2</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Company Overview (Red Box & Intro)</h3>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Red Box Headline</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={pages.aboutUs?.redBoxTitle || ""}
                onChange={(e) => updateNested("aboutUs", "redBoxTitle", e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Red Box Subheading</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={pages.aboutUs?.redBoxSubtitle || ""}
                onChange={(e) => updateNested("aboutUs", "redBoxSubtitle", e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Intro Body Paragraphs</span>
                <button
                  type="button"
                  onClick={() => {
                    const pars = [...(pages.aboutUs?.introParagraphs || [])];
                    pars.push("New paragraph text...");
                    updateNested("aboutUs", "introParagraphs", pars);
                  }}
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: "2px 8px", fontSize: 12 }}
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </label>
              {(pages.aboutUs?.introParagraphs || []).map((p, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    value={p}
                    onChange={(e) => {
                      const pars = [...(pages.aboutUs?.introParagraphs || [])];
                      pars[idx] = e.target.value;
                      updateNested("aboutUs", "introParagraphs", pars);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const pars = pages.aboutUs.introParagraphs.filter((_, i) => i !== idx);
                      updateNested("aboutUs", "introParagraphs", pars);
                    }}
                    style={{ background: "#fee2e2", border: "none", color: "#dc2626", borderRadius: 6, padding: "0 10px", cursor: "pointer" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 3</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Our Products Portfolio</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="admin-label">Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.aboutUs?.products?.title || "Our Products"}
                  onChange={(e) => updateNested("aboutUs", "products.title", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Subtitle</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.aboutUs?.products?.subtitle || "Our comprehensive product portfolio includes:"}
                  onChange={(e) => updateNested("aboutUs", "products.subtitle", e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label className="admin-label" style={{ margin: 0 }}>Product Items List</label>
                <button
                  type="button"
                  onClick={() => {
                    const items = [...(pages.aboutUs?.products?.items || [])];
                    items.push("New Product Name");
                    updateNested("aboutUs", "products.items", items);
                  }}
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: "2px 8px", fontSize: 12 }}
                >
                  <Plus size={14} /> Add Product Item
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {(pages.aboutUs?.products?.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 6 }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={item}
                      onChange={(e) => {
                        const items = [...(pages.aboutUs?.products?.items || [])];
                        items[idx] = e.target.value;
                        updateNested("aboutUs", "products.items", items);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const items = pages.aboutUs.products.items.filter((_, i) => i !== idx);
                        updateNested("aboutUs", "products.items", items);
                      }}
                      style={{ background: "#fee2e2", border: "none", color: "#dc2626", borderRadius: 6, padding: "0 8px", cursor: "pointer" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="admin-label">Footer Description</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={pages.aboutUs?.products?.footerText || ""}
                onChange={(e) => updateNested("aboutUs", "products.footerText", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 4</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Manufacturing Excellence</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
              <div>
                <div className="admin-form-group">
                  <label className="admin-label">Section Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={pages.aboutUs?.manufacturing?.title || ""}
                    onChange={(e) => updateNested("aboutUs", "manufacturing.title", e.target.value)}
                  />
                </div>
                {(pages.aboutUs?.manufacturing?.paragraphs || []).map((p, idx) => (
                  <div key={idx} className="admin-form-group">
                    <label className="admin-label">Paragraph #{idx + 1}</label>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const pars = [...(pages.aboutUs?.manufacturing?.paragraphs || [])];
                        pars[idx] = e.target.value;
                        updateNested("aboutUs", "manufacturing.paragraphs", pars);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <ImageUploadPreview
                  label="Manufacturing Photo"
                  value={pages.aboutUs?.manufacturing?.image || "/assets/img/Manufacturing.jpg"}
                  onChange={(val) => updateNested("aboutUs", "manufacturing.image", val)}
                />
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 5</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Innovation Driven by Experience</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
              <div>
                <div className="admin-form-group">
                  <label className="admin-label">Section Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={pages.aboutUs?.innovation?.title || ""}
                    onChange={(e) => updateNested("aboutUs", "innovation.title", e.target.value)}
                  />
                </div>
                {(pages.aboutUs?.innovation?.paragraphs || []).map((p, idx) => (
                  <div key={idx} className="admin-form-group">
                    <label className="admin-label">Paragraph #{idx + 1}</label>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      value={p}
                      onChange={(e) => {
                        const pars = [...(pages.aboutUs?.innovation?.paragraphs || [])];
                        pars[idx] = e.target.value;
                        updateNested("aboutUs", "innovation.paragraphs", pars);
                      }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <ImageUploadPreview
                  label="Experience Photo"
                  value={pages.aboutUs?.innovation?.image || "/assets/img/Experience.jpg"}
                  onChange={(val) => updateNested("aboutUs", "innovation.image", val)}
                />
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 6</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Quality Assurance & Leadership Message</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="admin-label">Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.aboutUs?.quality?.title || ""}
                  onChange={(e) => updateNested("aboutUs", "quality.title", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Subtitle (ISO tag)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.aboutUs?.quality?.subtitle || ""}
                  onChange={(e) => updateNested("aboutUs", "quality.subtitle", e.target.value)}
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Description</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={pages.aboutUs?.quality?.description || ""}
                onChange={(e) => updateNested("aboutUs", "quality.description", e.target.value)}
              />
            </div>

            <h4 style={{ margin: "20px 0 12px 0", fontSize: 15, color: "#0f172a" }}>Leadership Box</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20 }}>
              <div>
                <ImageUploadPreview
                  label="Owner / Leader Photo"
                  value={pages.aboutUs?.quality?.leadershipImage || "/assets/img/dhruv-patel.jpg"}
                  onChange={(val) => updateNested("aboutUs", "quality.leadershipImage", val)}
                />
              </div>
              <div>
                <div className="admin-form-group">
                  <label className="admin-label">Box Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={pages.aboutUs?.quality?.leadershipTitle || "Leadership Message"}
                    onChange={(e) => updateNested("aboutUs", "quality.leadershipTitle", e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Quote Content</label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    value={pages.aboutUs?.quality?.leadershipQuote || ""}
                    onChange={(e) => updateNested("aboutUs", "quality.leadershipQuote", e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Author / Designation</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={pages.aboutUs?.quality?.leadershipAuthor || "- Dhruv Patel, Owner"}
                    onChange={(e) => updateNested("aboutUs", "quality.leadershipAuthor", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 7</span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Why Trust Anjani Industries (8 Pillars)</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const reasons = [...(pages.aboutUs?.whyTrust?.reasons || [])];
                  reasons.push({ title: "New Feature Title", desc: "Feature explanation..." });
                  updateNested("aboutUs", "whyTrust.reasons", reasons);
                }}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: 13 }}
              >
                <Plus size={15} /> Add Pillar Card
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {(pages.aboutUs?.whyTrust?.reasons || []).map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 14,
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    backgroundColor: "#f8fafc",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>CARD #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const reasons = pages.aboutUs.whyTrust.reasons.filter((_, i) => i !== idx);
                        updateNested("aboutUs", "whyTrust.reasons", reasons);
                      }}
                      style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ marginBottom: 6, fontWeight: 600 }}
                    value={r.title}
                    onChange={(e) => {
                      const reasons = [...pages.aboutUs.whyTrust.reasons];
                      reasons[idx] = { ...reasons[idx], title: e.target.value };
                      updateNested("aboutUs", "whyTrust.reasons", reasons);
                    }}
                  />
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={r.desc}
                    onChange={(e) => {
                      const reasons = [...pages.aboutUs.whyTrust.reasons];
                      reasons[idx] = { ...reasons[idx], desc: e.target.value };
                      updateNested("aboutUs", "whyTrust.reasons", reasons);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 8</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Health, Safety & Environment</h3>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Section Title</label>
              <input
                type="text"
                className="admin-input"
                value={pages.aboutUs?.hse?.title || "Health, Safety & Environment"}
                onChange={(e) => updateNested("aboutUs", "hse.title", e.target.value)}
              />
            </div>
            {(pages.aboutUs?.hse?.paragraphs || []).map((p, idx) => (
              <div key={idx} className="admin-form-group">
                <label className="admin-label">Paragraph #{idx + 1}</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  value={p}
                  onChange={(e) => {
                    const pars = [...(pages.aboutUs?.hse?.paragraphs || [])];
                    pars[idx] = e.target.value;
                    updateNested("aboutUs", "hse.paragraphs", pars);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 9</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Our Commitment</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              <div>
                <label className="admin-label">Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.aboutUs?.commitment?.title || "Our Commitment"}
                  onChange={(e) => updateNested("aboutUs", "commitment.title", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Subtitle (4 Pillars)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.aboutUs?.commitment?.subtitle || "Quality • Technology • Metrology • Service"}
                  onChange={(e) => updateNested("aboutUs", "commitment.subtitle", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Commitment Description</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={pages.aboutUs?.commitment?.description || ""}
                onChange={(e) => updateNested("aboutUs", "commitment.description", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: VALUES & ETHICS
      ========================================================================= */}
      {activeTab === "valuesEthics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 1</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Breadcrumb & Banner</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="admin-label">Banner Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.valuesEthics?.bannerTitle || ""}
                  onChange={(e) => updateNested("valuesEthics", "bannerTitle", e.target.value)}
                />
              </div>
              <div>
                <ImageUploadPreview
                  label="Banner Background Image"
                  value={pages.valuesEthics?.bannerImage || "/assets/img/values-banner.jpg"}
                  onChange={(val) => updateNested("valuesEthics", "bannerImage", val)}
                />
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 2</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Entrepreneurial Spirit (Red Box)</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 }}>
              <div>
                <label className="admin-label">Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.valuesEthics?.entrepreneurial?.title || "Entrepreneurial Spirit"}
                  onChange={(e) => updateNested("valuesEthics", "entrepreneurial.title", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Subtitle</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.valuesEthics?.entrepreneurial?.subtitle || "Thinking Beyond Boundaries"}
                  onChange={(e) => updateNested("valuesEthics", "entrepreneurial.subtitle", e.target.value)}
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Description</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={pages.valuesEthics?.entrepreneurial?.description || ""}
                onChange={(e) => updateNested("valuesEthics", "entrepreneurial.description", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 3</span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>One Anjani Family (Core Values)</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const values = [...(pages.valuesEthics?.family?.values || [])];
                  values.push({
                    icon: "/assets/img/icon/core_value/core_value1.png",
                    title: "New Core Value",
                    desc: "Value explanation...",
                  });
                  updateNested("valuesEthics", "family.values", values);
                }}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: 13 }}
              >
                <Plus size={15} /> Add Value Card
              </button>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Section Title</label>
              <input
                type="text"
                className="admin-input"
                value={pages.valuesEthics?.family?.title || "One Anjani Family"}
                onChange={(e) => updateNested("valuesEthics", "family.title", e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {(pages.valuesEthics?.family?.values || []).map((val, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>VALUE #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const values = pages.valuesEthics.family.values.filter((_, i) => i !== idx);
                        updateNested("valuesEthics", "family.values", values);
                      }}
                      style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ marginBottom: 8, fontWeight: 600 }}
                    value={val.title}
                    onChange={(e) => {
                      const values = [...pages.valuesEthics.family.values];
                      values[idx] = { ...values[idx], title: e.target.value };
                      updateNested("valuesEthics", "family.values", values);
                    }}
                  />
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    style={{ marginBottom: 8 }}
                    value={val.desc}
                    onChange={(e) => {
                      const values = [...pages.valuesEthics.family.values];
                      values[idx] = { ...values[idx], desc: e.target.value };
                      updateNested("valuesEthics", "family.values", values);
                    }}
                  />
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Icon Path"
                    value={val.icon || ""}
                    onChange={(e) => {
                      const values = [...pages.valuesEthics.family.values];
                      values[idx] = { ...values[idx], icon: e.target.value };
                      updateNested("valuesEthics", "family.values", values);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 4</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Quality & Integrity</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
              <div>
                <div className="admin-form-group">
                  <label className="admin-label">Quality Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={pages.valuesEthics?.qualityIntegrity?.qualityTitle || "Quality"}
                    onChange={(e) => updateNested("valuesEthics", "qualityIntegrity.qualityTitle", e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Quality Description</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={pages.valuesEthics?.qualityIntegrity?.qualityDesc || ""}
                    onChange={(e) => updateNested("valuesEthics", "qualityIntegrity.qualityDesc", e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Integrity Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={pages.valuesEthics?.qualityIntegrity?.integrityTitle || "Integrity"}
                    onChange={(e) => updateNested("valuesEthics", "qualityIntegrity.integrityTitle", e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Integrity Description</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={pages.valuesEthics?.qualityIntegrity?.integrityDesc || ""}
                    onChange={(e) => updateNested("valuesEthics", "qualityIntegrity.integrityDesc", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <ImageUploadPreview
                  label="Quality & Integrity Photo"
                  value={pages.valuesEthics?.qualityIntegrity?.image || "/assets/img/quality.jpg"}
                  onChange={(val) => updateNested("valuesEthics", "qualityIntegrity.image", val)}
                />
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 5</span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Customer Commitment & Ethics Grid</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const ethics = [...(pages.valuesEthics?.customerCommitment?.ethics || [])];
                  ethics.push({ title: "New Ethics Principle", desc: "Principle explanation..." });
                  updateNested("valuesEthics", "customerCommitment.ethics", ethics);
                }}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: 13 }}
              >
                <Plus size={15} /> Add Ethics Card
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="admin-label">Section Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.valuesEthics?.customerCommitment?.title || "Customer Commitment"}
                  onChange={(e) => updateNested("valuesEthics", "customerCommitment.title", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Section Subtitle</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.valuesEthics?.customerCommitment?.subtitle || ""}
                  onChange={(e) => updateNested("valuesEthics", "customerCommitment.subtitle", e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {(pages.valuesEthics?.customerCommitment?.ethics || []).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 12,
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>ETHICS #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const ethics = pages.valuesEthics.customerCommitment.ethics.filter((_, i) => i !== idx);
                        updateNested("valuesEthics", "customerCommitment.ethics", ethics);
                      }}
                      style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ marginBottom: 6, fontWeight: 600, fontSize: 13 }}
                    value={item.title}
                    onChange={(e) => {
                      const ethics = [...pages.valuesEthics.customerCommitment.ethics];
                      ethics[idx] = { ...ethics[idx], title: e.target.value };
                      updateNested("valuesEthics", "customerCommitment.ethics", ethics);
                    }}
                  />
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    style={{ fontSize: 12 }}
                    value={item.desc}
                    onChange={(e) => {
                      const ethics = [...pages.valuesEthics.customerCommitment.ethics];
                      ethics[idx] = { ...ethics[idx], desc: e.target.value };
                      updateNested("valuesEthics", "customerCommitment.ethics", ethics);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: PRODUCTS PAGE (/products)
      ========================================================================= */}
      {activeTab === "productsPage" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 1</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Products Page Banner</h3>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Banner Title (HTML / &lt;br /&gt; supported)</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={pages.productsPage?.bannerTitle || ""}
                onChange={(e) => updateNested("productsPage", "bannerTitle", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 3</span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Why Choose ANJANI? Feature Cards</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const cards = [...(pages.productsPage?.whyChoose?.cards || [])];
                  cards.push({
                    icon: "/assets/img/icon/icon1.png",
                    title: "New Feature Title",
                    desc: "Feature explanation...",
                  });
                  updateNested("productsPage", "whyChoose.cards", cards);
                }}
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: 13 }}
              >
                <Plus size={15} /> Add Feature Card
              </button>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={pages.productsPage?.whyChoose?.title || "Why Choose ANJANI?"}
                onChange={(e) => updateNested("productsPage", "whyChoose.title", e.target.value)}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {(pages.productsPage?.whyChoose?.cards || []).map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>CARD #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const cards = pages.productsPage.whyChoose.cards.filter((_, i) => i !== idx);
                        updateNested("productsPage", "whyChoose.cards", cards);
                      }}
                      style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ marginBottom: 8, fontWeight: 600 }}
                    value={card.title}
                    placeholder="Card Title"
                    onChange={(e) => {
                      const cards = [...pages.productsPage.whyChoose.cards];
                      cards[idx] = { ...cards[idx], title: e.target.value };
                      updateNested("productsPage", "whyChoose.cards", cards);
                    }}
                  />
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    style={{ marginBottom: 8, fontSize: 13 }}
                    value={card.desc}
                    placeholder="Description..."
                    onChange={(e) => {
                      const cards = [...pages.productsPage.whyChoose.cards];
                      cards[idx] = { ...cards[idx], desc: e.target.value };
                      updateNested("productsPage", "whyChoose.cards", cards);
                    }}
                  />
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Icon Path"
                    value={card.icon || ""}
                    onChange={(e) => {
                      const cards = [...pages.productsPage.whyChoose.cards];
                      cards[idx] = { ...cards[idx], icon: e.target.value };
                      updateNested("productsPage", "whyChoose.cards", cards);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: CONTACT US (/contact-us)
      ========================================================================= */}
      {activeTab === "contactUs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Section 1</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Contact Page Banner</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="admin-label">Banner Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.contactUs?.bannerTitle || ""}
                  onChange={(e) => updateNested("contactUs", "bannerTitle", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Banner Subtitle</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.contactUs?.bannerSubtitle || ""}
                  onChange={(e) => updateNested("contactUs", "bannerSubtitle", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div
            className="admin-card"
            style={{
              padding: 24,
              backgroundColor: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Settings size={24} color="#ea580c" />
              <div>
                <h4 style={{ margin: "0 0 4px 0", color: "#9a3412" }}>Manage Headquarters, Google Map & Global Offices</h4>
                <p style={{ margin: 0, color: "#c2410c", fontSize: 13 }}>
                  Headquarters address, interactive map embed, phone, WhatsApp, email, and Sales & Service offices are configured in Site Settings.
                </p>
              </div>
            </div>
            <Link
              href="/admin/settings"
              className="admin-btn admin-btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "#ea580c", borderColor: "#ea580c" }}
            >
              <span>Open Site Settings</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: DIGITAL ECARD (/ecard)
      ========================================================================= */}
      {activeTab === "ecard" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Visual Card</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>Visiting Card Front & Back Images</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <ImageUploadPreview
                  label="Card Front Image"
                  value={pages.ecard?.frontImage || "/assets/img/front.png"}
                  onChange={(val) => updateNested("ecard", "frontImage", val)}
                />
              </div>
              <div>
                <ImageUploadPreview
                  label="Card Back Image"
                  value={pages.ecard?.backImage || "/assets/img/back.png"}
                  onChange={(val) => updateNested("ecard", "backImage", val)}
                />
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#df0000", textTransform: "uppercase" }}>Contact Details</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: 18, color: "#0f172a" }}>vCard & Quick Action Details</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="admin-label">Full Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.ecard?.name || ""}
                  onChange={(e) => updateNested("ecard", "name", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Title / Designation</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.ecard?.title || ""}
                  onChange={(e) => updateNested("ecard", "title", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Organization Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.ecard?.organization || ""}
                  onChange={(e) => updateNested("ecard", "organization", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Company Tagline</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.ecard?.tagline || ""}
                  onChange={(e) => updateNested("ecard", "tagline", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Mobile Phone (Direct)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.ecard?.phoneMobile || ""}
                  onChange={(e) => updateNested("ecard", "phoneMobile", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Office Phone</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.ecard?.phoneOffice || ""}
                  onChange={(e) => updateNested("ecard", "phoneOffice", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Direct Email</label>
                <input
                  type="email"
                  className="admin-input"
                  value={pages.ecard?.emailDirect || ""}
                  onChange={(e) => updateNested("ecard", "emailDirect", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">General Email</label>
                <input
                  type="email"
                  className="admin-input"
                  value={pages.ecard?.emailGeneral || ""}
                  onChange={(e) => updateNested("ecard", "emailGeneral", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Website URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.ecard?.website || ""}
                  onChange={(e) => updateNested("ecard", "website", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Google Maps Link</label>
                <input
                  type="text"
                  className="admin-input"
                  value={pages.ecard?.mapUrl || ""}
                  onChange={(e) => updateNested("ecard", "mapUrl", e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Full Physical Address</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={pages.ecard?.address || ""}
                onChange={(e) => updateNested("ecard", "address", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Save Bar */}
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
          marginTop: 20,
          border: "1px solid #e2e8f0",
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: 14, color: "#64748b" }}>
          Active Tab: <strong style={{ color: "#0f172a" }}>{activeTab}</strong>. Click Save to publish all section changes.
        </div>
        <button
          onClick={() => handleSave(activeTab)}
          disabled={saving}
          className="admin-btn admin-btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 170 }}
        >
          <Save size={16} />
          <span>{saving ? "Saving Changes..." : "Save Page Content"}</span>
        </button>
      </div>
    </div>
  );
}
