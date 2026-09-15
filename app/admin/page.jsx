"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Boxes,
  MessageSquareQuote,
  TrendingUp,
  Database,
  ArrowRight,
  Plus,
  Eye,
  Settings,
  Mail,
  Phone,
  Video,
  Award,
  BarChart3,
  BookOpen,
  FileText,
  Globe,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInquiries: 0,
    newInquiries: 0,
    loading: true,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, inqRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/inquiries"),
        ]);

        const products = prodRes.ok ? await prodRes.json() : [];
        const inquiries = inqRes.ok ? await inqRes.json() : [];

        const newCount = inquiries.filter((i) => i.status === "New").length;

        setStats({
          totalProducts: products.length,
          totalInquiries: inquiries.length,
          newInquiries: newCount,
          loading: false,
        });

        setRecentProducts(products.slice(0, 5));
        setRecentInquiries(inquiries.slice(0, 5));
      } catch (err) {
        console.error("Dashboard data error:", err);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }

    loadData();
  }, []);

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="admin-card"
        style={{
          padding: "24px 28px",
          borderRadius: 12,
          marginBottom: 28,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          borderLeft: "4px solid var(--admin-primary)",
          backgroundColor: "#ffffff",
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px 0", color: "#0f172a" }}>
            Welcome to Anjani Industries Admin
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
            Control machinery products, manage website inquiries, update content and company contacts in real-time.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
          <Link href="/" target="_blank" className="admin-btn admin-btn-secondary">
            <Eye size={16} />
            <span>View Site</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div>
            <span>TOTAL PRODUCTS</span>
            <h3>{stats.loading ? "..." : stats.totalProducts}</h3>
            <div style={{ fontSize: 12, color: "#16a34a", marginTop: 4, fontWeight: 500 }}>
              ✓ All pre-seeded & dynamic
            </div>
          </div>
          <div className="admin-stat-icon">
            <Boxes size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>NEW INQUIRIES</span>
            <h3 style={{ color: "var(--admin-primary)" }}>
              {stats.loading ? "..." : stats.newInquiries}
            </h3>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              Total received: {stats.totalInquiries}
            </div>
          </div>
          <div className="admin-stat-icon" style={{ backgroundColor: "#e0f2fe", color: "#0284c7" }}>
            <MessageSquareQuote size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>DATABASE</span>
            <h3 style={{ fontSize: 22, color: "#16a34a" }}>MongoDB</h3>
            <div style={{ fontSize: 12, color: "#16a34a", marginTop: 4, fontWeight: 500 }}>
              ● Connected & Active
            </div>
          </div>
          <div className="admin-stat-icon" style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}>
            <Database size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <span>GLOBAL OFFICES</span>
            <h3>7+</h3>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              India & International
            </div>
          </div>
          <div className="admin-stat-icon" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Module Navigation Grid */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 14px 0", color: "#0f172a" }}>
          Content Management Modules
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            {
              title: "Products Catalog",
              subtitle: "12 Machines configured",
              href: "/admin/products",
              icon: Boxes,
              color: "#dc2626",
              bgColor: "#fee2e2",
            },
            {
              title: "Hero & Videos",
              subtitle: "Video preview & upload",
              href: "/admin/hero",
              icon: Video,
              color: "#2563eb",
              bgColor: "#eff6ff",
            },
            {
              title: "Certifications",
              subtitle: "Logos & achievement tags",
              href: "/admin/certifications",
              icon: Award,
              color: "#16a34a",
              bgColor: "#f0fdf4",
            },
            {
              title: "Counter Stats",
              subtitle: "36+ Years, Capacity",
              href: "/admin/counters",
              icon: BarChart3,
              color: "#d97706",
              bgColor: "#fffbeb",
            },
            {
              title: "About Our Story",
              subtitle: "Narrative & photo",
              href: "/admin/about",
              icon: BookOpen,
              color: "#9333ea",
              bgColor: "#faf5ff",
            },
            {
              title: "Leads & Inquiries",
              subtitle: `${stats.newInquiries} New inquiries`,
              href: "/admin/inquiries",
              icon: MessageSquareQuote,
              color: "#0284c7",
              bgColor: "#e0f2fe",
            },
            {
              title: "Static Pages",
              subtitle: "About, Story, Values",
              href: "/admin/pages",
              icon: FileText,
              color: "#475569",
              bgColor: "#f1f5f9",
            },
            {
              title: "SEO & Analytics",
              subtitle: "GA4, Sitemap, Robots, llms.txt",
              href: "/admin/seo",
              icon: Globe,
              color: "#059669",
              bgColor: "#ecfdf5",
            },
            {
              title: "Email & SMTP",
              subtitle: "SMTP & Email Templates",
              href: "/admin/email",
              icon: Mail,
              color: "#dc2626",
              bgColor: "#fee2e2",
            },
            {
              title: "Site Settings",
              subtitle: "Contacts, WhatsApp, Address",
              href: "/admin/settings",
              icon: Settings,
              color: "#ea580c",
              bgColor: "#ffedd5",
            },
          ].map((mod) => {
            const ModIcon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="admin-card"
                style={{
                  margin: 0,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 18px",
                  border: "1px solid #e2e8f0",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: mod.bgColor,
                    color: mod.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ModIcon size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                    {mod.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {mod.subtitle}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Inquiries & Quick Management */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
        {/* Recent Inquiries */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Inquiries / Leads</h2>
            <Link
              href="/admin/inquiries"
              style={{
                fontSize: 13,
                color: "var(--admin-primary)",
                textDecoration: "none",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "#64748b", fontSize: 14 }}>
              No inquiries yet.
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Subject</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inq) => (
                    <tr key={inq.id || inq._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{inq.name}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{inq.phone}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13 }}>{inq.subject}</div>
                      </td>
                      <td>
                        <span
                          className={`badge-status ${
                            inq.status === "New"
                              ? "badge-new"
                              : inq.status === "Contacted"
                              ? "badge-contacted"
                              : "badge-resolved"
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Products Quick View */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Product Catalog Preview</h2>
            <Link
              href="/admin/products"
              style={{
                fontSize: 13,
                color: "var(--admin-primary)",
                textDecoration: "none",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>Manage Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Machine</th>
                  <th>Capacity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => (
                  <tr key={p.id || p._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img
                          src={p.image}
                          alt=""
                          style={{
                            width: 36,
                            height: 36,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: "1px solid #e2e8f0",
                          }}
                        />
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{p.title}</div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: "#64748b" }}>{p.capacity}</td>
                    <td>
                      <Link
                        href={`/admin/products/${p.id || p._id}`}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
