"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle,
  AlertCircle,
  Shield,
  Building,
  Globe,
  Lock,
  Image as ImageIcon,
  Share2,
  Users,
  ArrowRight,
  Plus,
  Trash2,
  MapPin,
} from "lucide-react";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState({ text: "", type: "" });

  // Security Form
  const [profile, setProfile] = useState({
    name: "Anjani Admin",
    email: "admin@anjaniindustries.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [securityMsg, setSecurityMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    async function load() {
      try {
        const [setRes, meRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/auth/me"),
        ]);

        if (setRes.ok) {
          const data = await setRes.json();
          setSettings(data);
        }

        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user) {
            setProfile((prev) => ({
              ...prev,
              name: meData.user.name || "",
              email: meData.user.email || "",
            }));
          }
        }
      } catch (err) {
        console.error("Settings load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setSettingsMsg({ text: "Company settings saved successfully!", type: "success" });
    } catch (err) {
      setSettingsMsg({ text: err.message || "Error saving settings", type: "error" });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    setSecurityMsg({ text: "", type: "" });

    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      setSecurityMsg({ text: "New passwords do not match", type: "error" });
      return;
    }

    setSavingSecurity(true);

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          currentPassword: profile.currentPassword,
          newPassword: profile.newPassword,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to update profile");

      setSecurityMsg({ text: "Profile and password updated successfully!", type: "success" });
      setProfile((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (err) {
      setSecurityMsg({ text: err.message || "Error updating credentials", type: "error" });
    } finally {
      setSavingSecurity(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Loading settings...</div>;
  }

  if (!settings) {
    return <div style={{ padding: 40, textAlign: "center", color: "#b91c1c" }}>Failed to load settings</div>;
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0", color: "#0f172a" }}>
            Site & Branding Settings
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Manage header logo, prompt text, company contacts, social links, and admin credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={savingSettings}
          className="admin-btn admin-btn-primary"
          style={{ padding: "10px 20px" }}
        >
          <Save size={16} />
          <span>{savingSettings ? "Saving Settings..." : "Save All Settings"}</span>
        </button>
      </div>

      {settingsMsg.text && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            backgroundColor: settingsMsg.type === "success" ? "#dcfce7" : "#fee2e2",
            color: settingsMsg.type === "success" ? "#15803d" : "#b91c1c",
            border: settingsMsg.type === "success" ? "1px solid #bbf7d0" : "1px solid #fecaca",
          }}
        >
          {settingsMsg.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontWeight: 500 }}>{settingsMsg.text}</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 24 }}>
        {/* Left Column: Branding & Company */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Header & Branding Settings Card */}
          <div className="admin-card">
            <h2 className="admin-card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ImageIcon size={18} />
              <span>Header & Branding Settings</span>
            </h2>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: -4, marginBottom: 16 }}>
              These values dynamically reflect in the website navbar, mobile drawer, and top contact prompts.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Header Logo Upload */}
              <ImageUploadPreview
                label="Website / Header Logo"
                value={settings.logo || "/assets/img/logo.png"}
                onChange={(url) => setSettings({ ...settings, logo: url })}
                aspectRatio="auto"
                maxHeight={90}
                helpText="Click upload or drag & drop. Automatically updates desktop and mobile header logos."
              />

              {/* Header Call Label */}
              <div className="admin-form-group">
                <label className="admin-label">
                  Header Call Label / Prompt
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Any Question"
                  value={settings.headerCallText ?? "Any Question"}
                  onChange={(e) => setSettings({ ...settings, headerCallText: e.target.value })}
                />
                <span style={{ fontSize: 12, color: "#64748b", marginTop: 4, display: "block" }}>
                  The text displayed above the phone number in the top header.
                </span>
              </div>

              {/* Phone & WhatsApp */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Primary Phone (Header / Footer)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.phone || ""}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">WhatsApp Number (Header Icon)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.whatsapp || ""}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="admin-btn admin-btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
              >
                <Save size={16} />
                <span>{savingSettings ? "Saving..." : "Save Header & Branding"}</span>
              </button>
            </div>
          </div>

          {/* Company & Headquarters Details */}
          <div className="admin-card">
            <h2 className="admin-card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Building size={18} />
              <span>Contact & Headquarters Details</span>
            </h2>

            <form onSubmit={handleSaveSettings}>
              <div className="admin-form-group">
                <label className="admin-label">Company Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.companyName || ""}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Official Email</label>
                <input
                  type="email"
                  className="admin-input"
                  value={settings.email || ""}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Headquarters Address</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  value={settings.headquarters?.address || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      headquarters: { ...settings.headquarters, address: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Google Maps Link</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.headquarters?.mapUrl || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      headquarters: { ...settings.headquarters, mapUrl: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Google Maps Embed URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.headquarters?.mapEmbed || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      headquarters: { ...settings.headquarters, mapEmbed: e.target.value },
                    })
                  }
                />
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 20, marginBottom: 10 }}>
                Social Media Links
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Facebook URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.socialLinks?.facebook || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">LinkedIn URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.socialLinks?.linkedin || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">YouTube URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.socialLinks?.youtube || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Pinterest URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.socialLinks?.pinterest || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, pinterest: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="admin-btn admin-btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
              >
                <Save size={16} />
                <span>{savingSettings ? "Saving Settings..." : "Save Company Settings"}</span>
              </button>
            </form>
          </div>

          {/* Sales & Service Offices Card */}
          <div className="admin-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div>
                <h2
                  className="admin-card-title"
                  style={{ display: "flex", alignItems: "center", gap: 8, margin: 0 }}
                >
                  <MapPin size={18} />
                  <span>Sales &amp; Service Offices</span>
                </h2>
                <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0 0" }}>
                  Manage national and global offices displayed on the Contact Us page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = settings.salesOffices || [];
                  setSettings({
                    ...settings,
                    salesOffices: [...current, { country: "", cities: "" }],
                  });
                }}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={14} />
                <span>Add Office</span>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(settings.salesOffices || []).map((office, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "14px",
                    backgroundColor: "#f8fafc",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#475569",
                        textTransform: "uppercase",
                      }}
                    >
                      Office #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (settings.salesOffices || []).filter(
                          (_, i) => i !== idx
                        );
                        setSettings({ ...settings, salesOffices: updated });
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "2px 6px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label" style={{ fontSize: 12 }}>
                      Country / Title
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. India or Global Presence"
                      value={office.country || ""}
                      onChange={(e) => {
                        const updated = [...(settings.salesOffices || [])];
                        updated[idx] = { ...updated[idx], country: e.target.value };
                        setSettings({ ...settings, salesOffices: updated });
                      }}
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label" style={{ fontSize: 12 }}>
                      Cities / Locations
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Surat, Ahmedabad, Mumbai, Ludhiana, Amritsar & Bhilwara"
                      value={office.cities || ""}
                      onChange={(e) => {
                        const updated = [...(settings.salesOffices || [])];
                        updated[idx] = { ...updated[idx], cities: e.target.value };
                        setSettings({ ...settings, salesOffices: updated });
                      }}
                    />
                  </div>
                </div>
              ))}

              {(!settings.salesOffices || settings.salesOffices.length === 0) && (
                <div
                  style={{
                    padding: 20,
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: 13,
                    border: "1px dashed #cbd5e1",
                    borderRadius: 8,
                  }}
                >
                  No sales offices configured. Click "Add Office" above to add one.
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="admin-btn admin-btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
              >
                <Save size={16} />
                <span>{savingSettings ? "Saving..." : "Save Sales & Service Offices"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Security & Footer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Admin Profile & Security */}
          <div className="admin-card">
            <h2 className="admin-card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Lock size={18} />
              <span>Admin Profile & Security</span>
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                backgroundColor: "#f8fafc",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Users size={18} style={{ color: "var(--admin-primary)" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                    Team & Admin User Management
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    Create & manage login access for other administrators
                  </div>
                </div>
              </div>
              <Link
                href="/admin/users"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{ flexShrink: 0 }}
              >
                <span>Manage Users</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {securityMsg.text && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  backgroundColor: securityMsg.type === "success" ? "#dcfce7" : "#fee2e2",
                  color: securityMsg.type === "success" ? "#15803d" : "#b91c1c",
                }}
              >
                {securityMsg.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <span>{securityMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveSecurity}>
              <div className="admin-form-group">
                <label className="admin-label">Admin Name</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Admin Email Address</label>
                <input
                  type="email"
                  required
                  className="admin-input"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 12 }}>
                  Change Password (Leave blank to keep current)
                </h3>

                <div className="admin-form-group">
                  <label className="admin-label">Current Password</label>
                  <input
                    type="password"
                    className="admin-input"
                    placeholder="Required only if changing password"
                    value={profile.currentPassword}
                    onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">New Password</label>
                  <input
                    type="password"
                    className="admin-input"
                    placeholder="Min. 6 characters"
                    value={profile.newPassword}
                    onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="admin-input"
                    placeholder="Re-type new password"
                    value={profile.confirmPassword}
                    onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingSecurity}
                className="admin-btn admin-btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
              >
                <Shield size={16} />
                <span>{savingSecurity ? "Updating..." : "Update Admin Profile"}</span>
              </button>
            </form>
          </div>

          {/* Website Footer & Copyright */}
          <div className="admin-card">
            <h2 className="admin-card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Globe size={18} />
              <span>Footer & Copyright Settings</span>
            </h2>

            <div className="admin-form-group">
              <label className="admin-label">Copyright Notice</label>
              <input
                type="text"
                className="admin-input"
                value={settings.copyright || ""}
                onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="admin-form-group">
                <label className="admin-label">Developer Credit Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.developerName || ""}
                  onChange={(e) => setSettings({ ...settings, developerName: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Developer Credit URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.developerLink || ""}
                  onChange={(e) => setSettings({ ...settings, developerLink: e.target.value })}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="admin-btn admin-btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
            >
              <Save size={16} />
              <span>{savingSettings ? "Saving..." : "Save Footer Settings"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
