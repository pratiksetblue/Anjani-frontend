"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminClientLayout({ session, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!session && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [session, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!session) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
        }}
      >
        Authenticating Admin...
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} user={session} />
      <div className="admin-main">
        <AdminNavbar setMobileOpen={setMobileOpen} user={session} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
