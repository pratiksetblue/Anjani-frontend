"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle,
  AlertCircle,
  Search,
  Globe,
  Bot,
  FileCode,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  Layers,
} from "lucide-react";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

const defaultPagesList = [
  {
    path: "/",
    pageName: "Home Page",
    metaTitle: "Textile Dyeing Machine Manufacturer & Exporter | Anjani Industries",
    metaDescription: "Anjani Industries is a leading manufacturer of advanced fabric dyeing machinery in India since 1990. Explore eco soft flow, jet dyeing, and textile processing machines.",
    metaKeywords: "fabric dyeing machine, textile machinery, jet dyeing machine, eco soft flow dyeing, surat",
  },
  {
    path: "/products",
    pageName: "Products Catalog (/products)",
    metaTitle: "Advance Fabric Dyeing & Processing Machinery Catalog | Anjani Industries",
    metaDescription: "Explore our full range of PLC-based soft flow dyeing machines, rapid jet dye units, weight reduction systems, and automatic caustic recovery plants.",
    metaKeywords: "dyeing machinery catalog, soft flow machines, rapid jet dyeing, caustic recovery plant",
  },
  {
    path: "/about-us",
    pageName: "About Us (/about-us)",
    metaTitle: "Fabric Dyeing Machinery Manufacturer in India | Anjani Industries",
    metaDescription: "Learn about Anjani Industries, delivering energy-efficient fabric dyeing machinery, scouring units, and textile processing solutions with 36+ years of expertise.",
    metaKeywords: "about anjani industries, textile machinery manufacturer surat, fabric dyeing company history",
  },
  {
    path: "/our-story",
    pageName: "Our Story (/our-story)",
    metaTitle: "Textile Machinery Innovation & Legacy | Anjani Industries",
    metaDescription: "Discover how Anjani Industries evolved from Anjani Machines Pvt. Ltd. into a pioneer of low liquor ratio fabric dyeing and automatic caustic recovery systems.",
    metaKeywords: "anjani machines history, textile machinery innovation, dyeing machine engineering legacy",
  },
  {
    path: "/values-ethics",
    pageName: "Values & Ethics (/values-ethics)",
    metaTitle: "Sustainable Textile Machinery & Quality Standards | Anjani Industries",
    metaDescription: "Committed to eco-friendly fabric dyeing technology, precision engineering, and customer satisfaction, Anjani Industries builds durable, low-energy machinery.",
    metaKeywords: "sustainable textile machinery, quality standards, iso certified dyeing machine, green manufacturing",
  },
  {
    path: "/contact-us",
    pageName: "Contact Us (/contact-us)",
    metaTitle: "Contact Textile Machinery Manufacturer | Surat, India | Anjani Industries",
    metaDescription: "Get in touch with Anjani Industries for machine quotes, custom engineering, or technical support. Visit our manufacturing facility in GIDC Sachin, Surat.",
    metaKeywords: "contact anjani industries, textile machine quote, machine manufacturer surat contact",
  },
];

export default function AdminSeoPage() {
  const [activeTab, setActiveTab] = useState("pages");
  const [seo, setSeo] = useState({
    siteUrl: "https://www.anjaniindustries.in",
    metaTitle: "Anjani Industries | Fabric Dyeing Machinery Manufacturer",
    metaDescription:
      "Anjani Industries is a leading manufacturer of advanced fabric dyeing machinery in India since 1990. Explore eco soft flow, jet dyeing, and textile processing machines.",
    metaKeywords:
      "fabric dyeing machine, textile machinery, jet dyeing machine, eco soft flow dyeing, weight reduction machine, caustic recovery plant, surat textile machinery",
    ogImage: "/assets/img/logo.png",
    pagesSeo: defaultPagesList,
    googleAnalytics: {
      enabled: true,
      measurementId: "G-NW6Z613EES",
      googleSiteVerification: "gzbGX_Ws9uHs_D0iP2jcKLR7rkKrX3C4iK5sgpa0nAM",
      headCustomScripts: "",
    },
    robotsTxt: {
      enabled: true,
      content: `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://www.anjaniindustries.in/sitemap.xml`,
    },
    sitemap: {
      autoGenerateProducts: true,
      autoGeneratePages: true,
      extraUrls: [],
    },
    llmsTxt: {
      enabled: true,
      title: "Anjani Industries - Fabric Dyeing Machinery",
      summary:
        "Anjani Industries is one of India's leading manufacturers of textile dyeing and processing machinery, established in 1990 in Surat, Gujarat.",
      content: `# Anjani Industries

> Leading manufacturer of advanced fabric dyeing and textile processing machinery since 1990.

## Overview
- **Headquarters**: Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India.
- **Experience**: 36+ Years of Industry Excellence
- **Website**: https://www.anjaniindustries.in
- **Email**: anjani_ind@yahoo.com
- **WhatsApp/Phone**: +91 8154 888 370 / +91 7096 007 670

## Key Machinery Catalog
1. **PLC Based Low Liquor Ratio ECO+ Soft Flow Dyeing Machine**: Capacity 150 Kg to 2000 Kg, low liquor ratio 1:4 to 1:6, SS 316L construction.
2. **PLC Based Low Liquor Ratio Sample ECO+ Soft Flow Dyeing Machine**: Capacity 10 Kg to 100 Kg for laboratory and sampling.
3. **PLC Based U Type Rapid Jet Dyeing Machine**: Fast liquor circulation, energy efficient.
4. **PLC Based U Type Soft Flow Dyeing Machine**: Gentle fabric transport for delicate fabrics.
5. **PLC Based U Type Sample Jet Dyeing Machine**: High quality sample batches.
6. **PLC Based Long Tube Rapid Jet Dyeing Machine**: Ideal for heavy woven and knit fabrics.
7. **PLC Based Long Tube Rapid Jet Dyeing - One Autoclave Two Tubes**: Double tube continuous dyeing.
8. **PLC Based Long Tube Soft Flow Dyeing Machine**: Optimized flow dynamics.
9. **PLC Based Long Tube Rapid Jet Dyeing - Two Autoclave Two Tubes**: High-capacity industrial dyeing.
10. **PLC Based Long Tube Sample Jet Dyeing Machine**: R&D sampling unit.
11. **PLC Based Weight Reduction Machine with Caustic Recovery Unit**: For polyester fabric weight reduction and scouring.
12. **Fully Automatic Caustic Recovery Plant**: Sustainable recovery and reuse of caustic soda with up to 85% efficiency.

## Accreditations
- ISO 9001:2015 Certified
- GO GREEN Sustainable Manufacturing
- Industry Outlook Recognized Textile Machinery Manufacturer`,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [generatingLlms, setGeneratingLlms] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/seo");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setSeo((prev) => ({
              ...prev,
              ...data,
              pagesSeo:
                data.pagesSeo && data.pagesSeo.length > 0
                  ? data.pagesSeo
                  : defaultPagesList,
              googleAnalytics: { ...prev.googleAnalytics, ...(data.googleAnalytics || {}) },
              robotsTxt: { ...prev.robotsTxt, ...(data.robotsTxt || {}) },
              sitemap: { ...prev.sitemap, ...(data.sitemap || {}) },
              llmsTxt: { ...prev.llmsTxt, ...(data.llmsTxt || {}) },
            }));
          }
        }
      } catch (err) {
        console.error("SEO load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handlePageSeoChange = (index, field, value) => {
    setSeo((prev) => {
      const updated = [...(prev.pagesSeo || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, pagesSeo: updated };
    });
  };

  const handleAddPageSeo = () => {
    setSeo((prev) => ({
      ...prev,
      pagesSeo: [
        ...(prev.pagesSeo || []),
        {
          path: "",
          pageName: "Custom Page",
          metaTitle: "",
          metaDescription: "",
          metaKeywords: "",
        },
      ],
    }));
  };

  const handleDeletePageSeo = (index) => {
    if (confirm("Are you sure you want to delete SEO settings for this page?")) {
      setSeo((prev) => ({
        ...prev,
        pagesSeo: (prev.pagesSeo || []).filter((_, i) => i !== index),
      }));
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seo),
      });

      if (!res.ok) throw new Error("Failed to save SEO configuration");

      setMessage({
        text: "SEO Settings, Google Analytics & Crawler files saved successfully in MongoDB!",
        type: "success",
      });
    } catch (err) {
      setMessage({ text: err.message || "Error saving SEO settings", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddExtraUrl = () => {
    setSeo({
      ...seo,
      sitemap: {
        ...seo.sitemap,
        extraUrls: [
          ...(seo.sitemap.extraUrls || []),
          { url: "", changefreq: "weekly", priority: "0.8" },
        ],
      },
    });
  };

  const handleRemoveExtraUrl = (idx) => {
    const updated = seo.sitemap.extraUrls.filter((_, i) => i !== idx);
    setSeo({
      ...seo,
      sitemap: { ...seo.sitemap, extraUrls: updated },
    });
  };

  const handleAutoGenerateLlms = async () => {
    setGeneratingLlms(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Could not fetch products");
      const products = await res.json();

      const siteUrl = (seo.siteUrl || "https://www.anjaniindustries.in").replace(/\/+$/, "");

      const generated = `# Anjani Industries

> Leading manufacturer of advanced fabric dyeing and textile processing machinery since 1990.

## Overview
- **Headquarters**: Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India.
- **Experience**: 36+ Years of Industry Excellence
- **Website**: ${siteUrl}
- **Email**: anjani_ind@yahoo.com
- **Phone / WhatsApp**: +91 8154 888 370 / +91 7096 007 670

## Key Machinery Catalog
${products
  .map(
    (p, i) =>
      `${i + 1}. **${p.title}**
   - URL: ${siteUrl}/${p.slug}
   - Capacity: ${p.capacity || "Custom capacity available"}
   - Key Features: ${p.highlights ? p.highlights.join(", ") : "PLC controlled process"}
   - Description: ${(p.paragraphs && p.paragraphs[0]) || "Dyeing machinery engineered for high efficiency and low liquor ratio."}`
  )
  .join("\n\n")}

## Accreditations & Quality Standards
- ISO 9001:2015 Certified Quality Management System
- GO GREEN Commitment to Sustainable Manufacturing
- Decades of Proven Textile Engineering Excellence
`;

      setSeo((prev) => ({
        ...prev,
        llmsTxt: { ...prev.llmsTxt, content: generated },
      }));
      alert("llms.txt content generated successfully from live MongoDB products!");
    } catch (err) {
      alert("Error generating llms.txt: " + err.message);
    } finally {
      setGeneratingLlms(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading SEO configuration...</div>;
  }

  const tabs = [
    { id: "pages", label: "Page-Wise SEO (All Pages)", icon: Layers },
    { id: "analytics", label: "Google Analytics", icon: Search },
    { id: "sitemap", label: "Sitemap.xml", icon: Globe },
    { id: "robots", label: "Robots.txt", icon: FileCode },
    { id: "llms", label: "AI / llms.txt", icon: Bot },
    { id: "meta", label: "Global Defaults", icon: Sparkles },
  ];

  return (
    <div>
      {/* Header */}
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
            SEO &amp; Webmaster Settings
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Manage Google Analytics tracking, dynamic XML sitemap, robots.txt crawler rules, and AI discoverability (llms.txt).
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
          <Save size={16} />
          <span>{saving ? "Saving..." : "Save SEO Settings"}</span>
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

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`admin-btn ${isActive ? "admin-btn-primary" : "admin-btn-secondary"}`}
              style={{ padding: "10px 18px", fontSize: 13 }}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave}>
        {/* =========================================================================
            TAB: PAGE-WISE SEO (ALL WEBSITE PAGES)
        ========================================================================= */}
        {activeTab === "pages" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Intro Alert / Card */}
            <div
              className="admin-card"
              style={{
                borderLeft: "4px solid var(--admin-primary)",
                backgroundColor: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <h2 className="admin-card-title" style={{ margin: "0 0 6px 0" }}>
                    Page-Wise Search Engine Optimization (SEO)
                  </h2>
                  <p style={{ fontSize: 13, color: "#64748b", margin: 0, maxWidth: 700 }}>
                    Configure custom Google Meta Title, Meta Description, and Meta Keywords for every individual core page. Search engines will index each page with its customized title and description.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPageSeo}
                  className="admin-btn admin-btn-secondary"
                  style={{ gap: 6 }}
                >
                  <Plus size={16} />
                  <span>Add Custom Page Route</span>
                </button>
              </div>

              <div
                style={{
                  marginTop: 14,
                  padding: "10px 14px",
                  borderRadius: 6,
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                  color: "#475569",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Sparkles size={16} style={{ color: "var(--admin-primary)", flexShrink: 0 }} />
                <span>
                  <strong>Tip for Machinery Products:</strong> SEO meta tags for individual machines (e.g. <em>Eco Soft Flow</em>, <em>Jet Dyeing</em>) can also be customized directly within their individual product editor under <strong>Admin &gt; Machinery Products</strong>.
                </span>
              </div>
            </div>

            {/* List of Pages */}
            {(seo.pagesSeo || []).map((page, idx) => {
              const titleLength = page.metaTitle?.length || 0;
              const descLength = page.metaDescription?.length || 0;

              return (
                <div key={idx} className="admin-card" style={{ position: "relative" }}>
                  {/* Card Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #e2e8f0",
                      paddingBottom: 12,
                      marginBottom: 16,
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          backgroundColor: "var(--admin-primary)",
                          color: "#fff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                        {page.pageName || "Untitled Page"}
                      </h3>
                      <code
                        style={{
                          fontSize: 12,
                          color: "#cb0000",
                          backgroundColor: "#fef2f2",
                          padding: "2px 8px",
                          borderRadius: 4,
                          border: "1px solid #fecaca",
                        }}
                      >
                        {page.path || "/"}
                      </code>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {page.path && (
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          title="Open live page in new tab"
                        >
                          <ExternalLink size={13} />
                          <span>View Live</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeletePageSeo(idx)}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        title="Remove page"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div className="admin-form-group">
                      <label className="admin-label">Page Name</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. About Us"
                        value={page.pageName || ""}
                        onChange={(e) => handlePageSeoChange(idx, "pageName", e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">URL Path</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. /about-us"
                        value={page.path || ""}
                        onChange={(e) => handlePageSeoChange(idx, "path", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Meta Title */}
                  <div className="admin-form-group" style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label className="admin-label" style={{ margin: 0 }}>
                        Meta Title (Google Search Result Title)
                      </label>
                      <span
                        style={{
                          fontSize: 12,
                          color: titleLength > 65 ? "#b91c1c" : titleLength > 50 ? "#15803d" : "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        {titleLength} / 60 recommended characters
                      </span>
                    </div>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Title displayed in Google search results & browser tab..."
                      value={page.metaTitle || ""}
                      onChange={(e) => handlePageSeoChange(idx, "metaTitle", e.target.value)}
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="admin-form-group" style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label className="admin-label" style={{ margin: 0 }}>
                        Meta Description (Search Engine Snippet)
                      </label>
                      <span
                        style={{
                          fontSize: 12,
                          color: descLength > 165 ? "#b91c1c" : descLength > 120 ? "#15803d" : "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        {descLength} / 160 recommended characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      className="admin-textarea"
                      placeholder="Concise summary of this page for Google search snippets..."
                      value={page.metaDescription || ""}
                      onChange={(e) => handlePageSeoChange(idx, "metaDescription", e.target.value)}
                    />
                  </div>

                  {/* Meta Keywords */}
                  <div className="admin-form-group" style={{ marginBottom: 16 }}>
                    <label className="admin-label">Meta Keywords (Comma separated)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. textile machinery, fabric dyeing, surat manufacturer"
                      value={page.metaKeywords || ""}
                      onChange={(e) => handlePageSeoChange(idx, "metaKeywords", e.target.value)}
                    />
                  </div>

                  {/* Google SERP Snippet Preview */}
                  <div
                    style={{
                      marginTop: 12,
                      padding: 14,
                      backgroundColor: "#f8fafc",
                      borderRadius: 8,
                      border: "1px dashed #cbd5e1",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: 6 }}>
                      Live Google Search Snippet Preview
                    </div>
                    <div style={{ fontFamily: "Arial, sans-serif" }}>
                      <div style={{ fontSize: 12, color: "#202124", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ color: "#202124" }}>www.anjaniindustries.in</span>
                        <span style={{ color: "#5f6368" }}>
                          › {page.path ? page.path.replace(/^\//, "") || "home" : "page"}
                        </span>
                      </div>
                      <div
                        style={{
                          color: "#1a0dab",
                          fontSize: 18,
                          lineHeight: 1.3,
                          fontWeight: 400,
                          cursor: "pointer",
                          marginTop: 2,
                          marginBottom: 4,
                          textDecoration: "none",
                        }}
                      >
                        {page.metaTitle || page.pageName || "Anjani Industries"}
                      </div>
                      <div style={{ color: "#4d5156", fontSize: 13, lineHeight: 1.5 }}>
                        {page.metaDescription || "No meta description entered. Google will automatically generate a snippet from page text."}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            TAB 1: GOOGLE ANALYTICS & SEARCH CONSOLE
        ========================================================================= */}
        {activeTab === "analytics" && (
          <div className="admin-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 className="admin-card-title">Google Analytics 4 &amp; Search Console</h2>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                  Track website traffic, visitors, user journeys, and verify domain ownership.
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={seo.googleAnalytics?.enabled !== false}
                  onChange={(e) =>
                    setSeo({
                      ...seo,
                      googleAnalytics: { ...seo.googleAnalytics, enabled: e.target.checked },
                    })
                  }
                  style={{ width: 18, height: 18, accentColor: "var(--admin-primary)" }}
                />
                <span style={{ fontWeight: 600, fontSize: 13 }}>Enable GA4 Script</span>
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
              <div className="admin-form-group">
                <label className="admin-label">Google Analytics Measurement ID</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="G-NW6Z613EES"
                  value={seo.googleAnalytics?.measurementId || ""}
                  onChange={(e) =>
                    setSeo({
                      ...seo,
                      googleAnalytics: { ...seo.googleAnalytics, measurementId: e.target.value },
                    })
                  }
                />
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  Format: <code>G-XXXXXXXXXX</code> (Found in Google Analytics &gt; Admin &gt; Data Streams).
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Google Search Console Verification Token</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="gzbGX_Ws9uHs_D0iP2jcKLR7rkKrX3C4iK5sgpa0nAM"
                  value={seo.googleAnalytics?.googleSiteVerification || ""}
                  onChange={(e) =>
                    setSeo({
                      ...seo,
                      googleAnalytics: {
                        ...seo.googleAnalytics,
                        googleSiteVerification: e.target.value,
                      },
                    })
                  }
                />
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  Injected as: <code>&lt;meta name="google-site-verification" content="..." /&gt;</code>
                </div>
              </div>
            </div>

            <div className="admin-form-group" style={{ marginTop: 10 }}>
              <label className="admin-label">Custom Header Scripts (Optional)</label>
              <textarea
                rows={4}
                className="admin-textarea"
                style={{ fontFamily: "monospace", fontSize: 13 }}
                placeholder="<!-- Additional custom tags, Facebook Pixel, Microsoft Clarity, etc. -->"
                value={seo.googleAnalytics?.headCustomScripts || ""}
                onChange={(e) =>
                  setSeo({
                    ...seo,
                    googleAnalytics: {
                      ...seo.googleAnalytics,
                      headCustomScripts: e.target.value,
                    },
                  })
                }
              />
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                Raw HTML/script snippets placed automatically inside <code>&lt;head&gt;</code> on the live site.
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: SITEMAP.XML
        ========================================================================= */}
        {activeTab === "sitemap" && (
          <div className="admin-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h2 className="admin-card-title">Dynamic XML Sitemap</h2>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                  Automatically indexes all active products from MongoDB, core pages, and custom URLs for Google &amp; Bing.
                </div>
              </div>

              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                <ExternalLink size={14} />
                <span>Open Live /sitemap.xml</span>
              </a>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Canonical Production Domain URL</label>
              <input
                type="text"
                className="admin-input"
                placeholder="https://www.anjaniindustries.in"
                value={seo.siteUrl || ""}
                onChange={(e) => setSeo({ ...seo, siteUrl: e.target.value })}
              />
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                Base domain used to generate absolute URL links in the sitemap and robots.txt.
              </div>
            </div>

            <div style={{ display: "flex", gap: 24, marginBottom: 20, padding: 14, backgroundColor: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={seo.sitemap?.autoGenerateProducts !== false}
                  onChange={(e) =>
                    setSeo({
                      ...seo,
                      sitemap: { ...seo.sitemap, autoGenerateProducts: e.target.checked },
                    })
                  }
                  style={{ width: 18, height: 18, accentColor: "var(--admin-primary)" }}
                />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Auto-sync All Products from MongoDB</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={seo.sitemap?.autoGeneratePages !== false}
                  onChange={(e) =>
                    setSeo({
                      ...seo,
                      sitemap: { ...seo.sitemap, autoGeneratePages: e.target.checked },
                    })
                  }
                  style={{ width: 18, height: 18, accentColor: "var(--admin-primary)" }}
                />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Auto-include Core Website Pages</span>
              </label>
            </div>

            {/* Extra Custom URLs */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
                  Custom / Additional Sitemap Entries
                </h3>
                <button
                  type="button"
                  onClick={handleAddExtraUrl}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  <Plus size={14} />
                  <span>Add URL</span>
                </button>
              </div>

              {(!seo.sitemap?.extraUrls || seo.sitemap.extraUrls.length === 0) ? (
                <div style={{ fontSize: 13, color: "#64748b", padding: 16, backgroundColor: "#f8fafc", borderRadius: 8, textAlign: "center" }}>
                  No extra URLs added. All 12 products and core pages are automatically included in the sitemap!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {seo.sitemap.extraUrls.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="/ecard or https://..."
                        value={item.url || ""}
                        onChange={(e) => {
                          const updated = [...seo.sitemap.extraUrls];
                          updated[idx].url = e.target.value;
                          setSeo({ ...seo, sitemap: { ...seo.sitemap, extraUrls: updated } });
                        }}
                        style={{ flex: 2 }}
                      />
                      <select
                        className="admin-select"
                        value={item.changefreq || "weekly"}
                        onChange={(e) => {
                          const updated = [...seo.sitemap.extraUrls];
                          updated[idx].changefreq = e.target.value;
                          setSeo({ ...seo, sitemap: { ...seo.sitemap, extraUrls: updated } });
                        }}
                        style={{ flex: 1 }}
                      >
                        <option value="always">always</option>
                        <option value="hourly">hourly</option>
                        <option value="daily">daily</option>
                        <option value="weekly">weekly</option>
                        <option value="monthly">monthly</option>
                        <option value="yearly">yearly</option>
                      </select>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Priority (0.1 - 1.0)"
                        value={item.priority || "0.8"}
                        onChange={(e) => {
                          const updated = [...seo.sitemap.extraUrls];
                          updated[idx].priority = e.target.value;
                          setSeo({ ...seo, sitemap: { ...seo.sitemap, extraUrls: updated } });
                        }}
                        style={{ width: 100 }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExtraUrl(idx)}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: ROBOTS.TXT
        ========================================================================= */}
        {activeTab === "robots" && (
          <div className="admin-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h2 className="admin-card-title">Robots.txt Crawler Rules</h2>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                  Instructions for search engine crawlers (Googlebot, Bingbot, Baidu) on which pages can be crawled.
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  <ExternalLink size={14} />
                  <span>Open Live /robots.txt</span>
                </a>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => {
                  const site = (seo.siteUrl || "https://www.anjaniindustries.in").replace(/\/+$/, "");
                  setSeo({
                    ...seo,
                    robotsTxt: {
                      ...seo.robotsTxt,
                      content: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml`,
                    },
                  });
                }}
              >
                Reset to Recommended Preset
              </button>

              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => {
                  const site = (seo.siteUrl || "https://www.anjaniindustries.in").replace(/\/+$/, "");
                  setSeo({
                    ...seo,
                    robotsTxt: {
                      ...seo.robotsTxt,
                      content: `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml`,
                    },
                  });
                }}
              >
                Allow All Crawlers
              </button>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Robots.txt File Contents</label>
              <textarea
                rows={10}
                className="admin-textarea"
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 13,
                  backgroundColor: "#0c0d14",
                  color: "#38bdf8",
                  lineHeight: 1.6,
                }}
                value={seo.robotsTxt?.content || ""}
                onChange={(e) =>
                  setSeo({
                    ...seo,
                    robotsTxt: { ...seo.robotsTxt, content: e.target.value },
                  })
                }
              />
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                Directly served at <code>{seo.siteUrl}/robots.txt</code>. Protects admin and internal APIs from search engine indexing.
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: AI / LLMS.TXT (AI DISCOVERY)
        ========================================================================= */}
        {activeTab === "llms" && (
          <div className="admin-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h2 className="admin-card-title">AI Engine Discovery (/llms.txt)</h2>
                  <span
                    style={{
                      backgroundColor: "#f0fdf4",
                      color: "#15803d",
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    AI Standard
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                  Provides clean Markdown for modern AI search engines (ChatGPT Search, Perplexity, Gemini, Claude) to understand Anjani's products accurately.
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={handleAutoGenerateLlms}
                  disabled={generatingLlms}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  title="Auto generate from all live machines in database"
                >
                  <RefreshCw size={14} className={generatingLlms ? "spin-animation" : ""} />
                  <span>{generatingLlms ? "Generating..." : "Auto-Generate from Products"}</span>
                </button>

                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  <ExternalLink size={14} />
                  <span>Open Live /llms.txt</span>
                </a>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">AI Summary</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Short summary for AI agents..."
                value={seo.llmsTxt?.summary || ""}
                onChange={(e) =>
                  setSeo({
                    ...seo,
                    llmsTxt: { ...seo.llmsTxt, summary: e.target.value },
                  })
                }
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Markdown Content for AI Crawlers (/llms.txt)</label>
              <textarea
                rows={16}
                className="admin-textarea"
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 13,
                  backgroundColor: "#0c0d14",
                  color: "#a7f3d0",
                  lineHeight: 1.6,
                }}
                value={seo.llmsTxt?.content || ""}
                onChange={(e) =>
                  setSeo({
                    ...seo,
                    llmsTxt: { ...seo.llmsTxt, content: e.target.value },
                  })
                }
              />
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                Directly served at <code>{seo.siteUrl}/llms.txt</code> formatted in GitHub Markdown for LLM ingestion.
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: META & SOCIAL SEO
        ========================================================================= */}
        {activeTab === "meta" && (
          <div className="admin-card">
            <h2 className="admin-card-title" style={{ marginBottom: 18 }}>
              Default Meta Tags &amp; Social OpenGraph Sharing
            </h2>

            <div className="admin-form-group">
              <label className="admin-label">Default Meta Title Tag (Search Results)</label>
              <input
                type="text"
                className="admin-input"
                value={seo.metaTitle || ""}
                onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              />
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                Character count: {seo.metaTitle?.length || 0} / 60 recommended
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Default Meta Description</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={seo.metaDescription || ""}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              />
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                Character count: {seo.metaDescription?.length || 0} / 160 recommended
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Meta Keywords (Comma separated)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="textile machinery, dyeing machine, surat"
                value={seo.metaKeywords || ""}
                onChange={(e) => setSeo({ ...seo, metaKeywords: e.target.value })}
              />
            </div>

            {/* Social Share Preview Image */}
            <div style={{ marginTop: 20 }}>
              <ImageUploadPreview
                label="Social Share Image (OpenGraph / Twitter Preview)"
                value={seo.ogImage || ""}
                onChange={(url) => setSeo({ ...seo, ogImage: url })}
                helpText="Recommended: 1200x630px JPG or PNG (Shown when sharing site link on WhatsApp / LinkedIn / Facebook)"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 40, marginTop: 20 }}>
          <button
            type="submit"
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ padding: "12px 28px" }}
          >
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save SEO Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
