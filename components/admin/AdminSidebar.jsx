"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  MessageSquareQuote,
  Video,
  Award,
  BarChart3,
  BookOpen,
  FileText,
  Settings,
  Globe,
  Mail,
  LogOut,
  ExternalLink,
  Users,
  History,
  X,
  Newspaper,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products Catalog", href: "/admin/products", icon: Boxes },
  { label: "Hero & Videos", href: "/admin/hero", icon: Video },
  { label: "Certifications", href: "/admin/certifications", icon: Award },
  { label: "Counter Statistics", href: "/admin/counters", icon: BarChart3 },
  { label: "About Section", href: "/admin/about", icon: BookOpen },
  { label: "Story Timeline", href: "/admin/timeline", icon: History },
  { label: "Inquiries (Leads)", href: "/admin/inquiries", icon: MessageSquareQuote },
  { label: "Newsletter Leads", href: "/admin/newsletter", icon: Newspaper },
  { label: "Pages & Sections", href: "/admin/pages", icon: FileText },
  { label: "SEO & Analytics", href: "/admin/seo", icon: Globe },
  { label: "Email & SMTP", href: "/admin/email", icon: Mail },
  { label: "Admin Users", href: "/admin/users", icon: Users },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ mobileOpen, setMobileOpen, user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 45,
          }}
        />
      )}

      <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="admin-sidebar-brand" style={{ padding: "12px 14px", borderBottom: "1px solid var(--admin-sidebar-border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: "none",
                display: "block",
                flex: 1,
              }}
            >
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: 6,
                  padding: "6px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                <img
                  src="/assets/img/logo.png"
                  alt="Anjani Industries"
                  style={{
                    maxHeight: 34,
                    width: "auto",
                    maxWidth: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "6px",
              }}
              className="d-lg-none"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : "A"}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#f8fafc",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.name || "Anjani Admin"}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Super Admin</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <Link
                href="/"
                target="_blank"
                title="View Live Site"
                style={{
                  color: "#94a3b8",
                  padding: "6px",
                  borderRadius: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <ExternalLink size={15} />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#f87171",
                  borderRadius: 6,
                  padding: "6px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
