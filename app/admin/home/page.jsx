"use client";

import React from "react";
import Link from "next/link";
import { Video, Award, BarChart3, BookOpen, ArrowRight } from "lucide-react";

const modules = [
  {
    title: "Hero & Video Banner",
    description: "Edit main headline, subtitle, action buttons, and upload desktop/mobile background videos with live preview player.",
    href: "/admin/hero",
    icon: Video,
    color: "#2563eb",
    bgColor: "#eff6ff",
  },
  {
    title: "Certifications & Achievements",
    description: "Manage ISO, GO GREEN, and industry recognition cards. Direct logo upload with instant image preview.",
    href: "/admin/certifications",
    icon: Award,
    color: "#16a34a",
    bgColor: "#f0fdf4",
  },
  {
    title: "Counter Statistics",
    description: "Configure key achievement metrics, years in business (36+), and production capacity statistics.",
    href: "/admin/counters",
    icon: BarChart3,
    color: "#d97706",
    bgColor: "#fffbeb",
  },
  {
    title: "About Our Story Section",
    description: "Manage the company introduction narrative, badges, key bullet highlights, and featured photo.",
    href: "/admin/about",
    icon: BookOpen,
    color: "#9333ea",
    bgColor: "#faf5ff",
  },
];

export default function AdminHomePageModules() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0", color: "#0f172a" }}>
          Home Page Content Modules
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          Select a dedicated module to manage each homepage section independently.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.href}
              className="admin-card"
              style={{
                margin: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 24,
                border: "1px solid #e2e8f0",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              <div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: m.bgColor,
                    color: m.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={24} />
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0", color: "#0f172a" }}>
                  {m.title}
                </h2>

                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                  {m.description}
                </p>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                <Link
                  href={m.href}
                  className="admin-btn admin-btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <span>Open {m.title}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
