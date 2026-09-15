"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  Globe,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password. Please try again.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0c13",
        backgroundImage: `
          radial-gradient(circle at 85% 15%, rgba(203, 0, 0, 0.15) 0%, transparent 45%),
          radial-gradient(circle at 15% 85%, rgba(30, 41, 59, 0.4) 0%, transparent 50%),
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 100% 100%, 40px 40px, 40px 40px",
        padding: "24px 16px",
        position: "relative",
      }}
    >
      {/* Top Bar: Back to Public Website Link */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 24,
          right: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#94a3b8",
            fontSize: 13,
            textDecoration: "none",
            fontWeight: 500,
            padding: "8px 14px",
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(8px)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
          }}
        >
          <ArrowLeft size={15} />
          <span>Back to Public Website</span>
        </Link>

        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#64748b",
          }}
          className="d-sm-flex"
        >
          <ShieldCheck size={14} style={{ color: "#22c55e" }} />
          <span>Protected by Anjani Enterprise Security</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          backgroundColor: "#ffffff",
          borderRadius: 20,
          padding: "38px 34px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)",
          borderTop: "4px solid #cb0000",
          position: "relative",
          margin: "40px 0 20px 0",
        }}
      >
        {/* Card Header & Brand Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 24px",
              borderRadius: 14,
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
              marginBottom: 16,
            }}
          >
            <img
              src="/assets/img/logo.png"
              alt="Anjani Industries Logo"
              style={{
                maxHeight: 52,
                width: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              color: "#0f172a",
              letterSpacing: "-0.01em",
            }}
          >
            Sign In
          </h1>
        </div>

        {/* Error Alert Message */}
        {error && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 10,
              color: "#991b1b",
              fontSize: 13,
              fontWeight: 500,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginBottom: 20,
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} noValidate>
          {/* Email Input */}
          <div className="admin-form-group" style={{ marginBottom: 18 }}>
            <label
              htmlFor="admin-email"
              className="admin-label"
              style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 6, display: "block" }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              />
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                enterKeyHint="next"
                required
                className="admin-input"
                style={{
                  paddingLeft: 42,
                  paddingRight: 14,
                  height: 44,
                  fontSize: 14,
                  backgroundColor: "#f8fafc",
                  borderColor: "#cbd5e1",
                  borderRadius: 10,
                }}
                placeholder="name@anjaniindustries.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="admin-form-group" style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <label
                htmlFor="admin-password"
                className="admin-label"
                style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: 0 }}
              >
                Password
              </label>
            </div>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              />
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                enterKeyHint="done"
                required
                className="admin-input"
                style={{
                  paddingLeft: 42,
                  paddingRight: 42,
                  height: 44,
                  fontSize: 14,
                  backgroundColor: "#f8fafc",
                  borderColor: "#cbd5e1",
                  borderRadius: 10,
                }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  padding: 4,
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 22,
              fontSize: 13,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#64748b",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: "#cb0000",
                  cursor: "pointer",
                }}
              />
              <span>Remember this device</span>
            </label>

            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              Secure Session
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "13px 20px",
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 10,
              backgroundColor: "#cb0000",
              borderColor: "#cb0000",
              boxShadow: "0 4px 12px rgba(203, 0, 0, 0.25)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Loader2 size={18} className="spin-animation" />
                <span>Signing In...</span>
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>Sign In</span>
                <ArrowRight size={17} />
              </span>
            )}
          </button>
        </form>

        {/* Card Footer Security Badge */}
        <div
          style={{
            marginTop: 26,
            paddingTop: 18,
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 12,
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          <ShieldCheck size={15} style={{ color: "#22c55e" }} />
          <span>256-bit SSL Encrypted • MongoDB Atlas Cloud Secured</span>
        </div>
      </div>

      {/* Bottom Copyright Footer */}
      <div
        style={{
          fontSize: 12,
          color: "#475569",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} Anjani Industries. Authorized Personnel Only.
      </div>
    </div>
  );
}
