"use client";

import React from "react";
import { Menu, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminNavbar({ setMobileOpen, user }) {
  return (
    <header className="admin-navbar">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="d-lg-none"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "#334155",
          }}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Link
          href="/"
          target="_blank"
          style={{
            fontSize: 13,
            color: "#475569",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 500,
            padding: "6px 12px",
            borderRadius: 6,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <ExternalLink size={14} />
          <span>Visit Website</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#f1f5f9",
              border: "1px solid #cbd5e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--admin-primary)",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : "A"}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
            {user?.name || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
