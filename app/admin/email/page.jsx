"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Server,
  UserCheck,
  Bell,
  Eye,
  EyeOff,
  RefreshCw,
  Palette,
} from "lucide-react";

export default function AdminEmailSettingsPage() {
  const [activeTab, setActiveTab] = useState("smtp");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Test email state
  const [testEmailTo, setTestEmailTo] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState({ text: "", type: "" });

  const [settings, setSettings] = useState({
    smtp: {
      enabled: true,
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "donotautoreplyback@gmail.com",
        pass: "sjlrvyctlbdtdgqm",
      },
      fromName: "Anjani Industries",
      fromEmail: "info@anjaniindustries.in",
      replyTo: "info@anjaniindustries.in",
      adminNotificationEmail: "info@anjaniindustries.in",
    },
    branding: {
      logoUrl: "/assets/img/logo.png",
      companyName: "Anjani Industries",
      tagline: "Fabric Dyeing & Textile Processing Machinery",
      phone: "+91 8154 888 370",
      email: "info@anjaniindustries.in",
      website: "https://www.anjaniindustries.in",
      address:
        "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India",
    },
    userTemplate: {
      enabled: true,
      subject:
        "Thank you for contacting Anjani Industries - Fabric Dyeing Machinery",
      heading: "Inquiry Received Successfully",
      body: "Dear {userName},\n\nThank you for reaching out to Anjani Industries. We have received your inquiry regarding our textile dyeing and processing machinery. Our technical sales engineering team will review your specifications and get in touch with you shortly.",
      ctaText: "Explore Machinery Catalog",
      ctaUrl: "https://www.anjaniindustries.in/products",
      footerNote:
        "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India | Phone: +91 8154 888 370",
    },
    adminTemplate: {
      enabled: true,
      subject: "[New Inquiry Alert] {userName} - {subject}",
      heading: "New Customer Inquiry Received",
      body: "A new customer inquiry has just been submitted on the Anjani Industries website. Please find the lead details below and respond to the customer promptly.",
      footerNote:
        "Internal Sales Notification - Anjani Industries Machinery Lead Capture",
    },
    newsletterTemplate: {
      enabled: true,
      subject:
        "Welcome to Anjani Industries Newsletter - Textile Machinery Updates",
      heading: "Thank You for Subscribing!",
      body: "Dear Subscriber,\n\nThank you for subscribing to the Anjani Industries newsletter!\n\nYou are now part of our valued community. You will receive regular updates about our latest fabric dyeing machinery innovations, eco-friendly technological breakthroughs, and industry trends directly in your inbox.\n\nIf you ever need technical advice or customized machinery specifications, our engineering team is here to assist you.",
      ctaText: "Explore Machinery Range",
      ctaUrl: "https://www.anjaniindustries.in/products",
      footerNote:
        "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India | Phone: +91 8154 888 370 | info@anjaniindustries.in",
    },
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/email-settings");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setSettings((prev) => ({
              smtp: { ...prev.smtp, ...(data.smtp || {}) },
              branding: { ...prev.branding, ...(data.branding || {}) },
              userTemplate: {
                ...prev.userTemplate,
                ...(data.userTemplate || {}),
              },
              adminTemplate: {
                ...prev.adminTemplate,
                ...(data.adminTemplate || {}),
              },
              newsletterTemplate: {
                ...prev.newsletterTemplate,
                ...(data.newsletterTemplate || {}),
              },
            }));
            if (data.smtp?.adminNotificationEmail) {
              setTestEmailTo(data.smtp.adminNotificationEmail);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load email settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/email-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save email settings");

      setMessage({
        text: "Email templates & SMTP configuration saved successfully in MongoDB!",
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: err.message || "Error saving email settings",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!testEmailTo) {
      setTestResult({
        text: "Please enter a test recipient email.",
        type: "error",
      });
      return;
    }

    setSendingTest(true);
    setTestResult({ text: "", type: "" });

    try {
      const res = await fetch("/api/email-settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testEmailTo,
          smtpConfig: settings.smtp,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send test email");
      }

      setTestResult({
        text: `✓ Success! Test email was sent to ${testEmailTo}. Check your inbox/spam folder.`,
        type: "success",
      });
    } catch (err) {
      setTestResult({
        text: `Error: ${err.message}`,
        type: "error",
      });
    } finally {
      setSendingTest(false);
    }
  };

  const applyPreset = (provider) => {
    if (provider === "gmail") {
      setSettings((prev) => ({
        ...prev,
        smtp: {
          ...prev.smtp,
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
        },
      }));
    } else if (provider === "outlook") {
      setSettings((prev) => ({
        ...prev,
        smtp: {
          ...prev.smtp,
          host: "smtp.office365.com",
          port: 587,
          secure: false,
        },
      }));
    } else if (provider === "zoho") {
      setSettings((prev) => ({
        ...prev,
        smtp: {
          ...prev.smtp,
          host: "smtppro.zoho.in",
          port: 465,
          secure: true,
        },
      }));
    } else if (provider === "hostinger") {
      setSettings((prev) => ({
        ...prev,
        smtp: {
          ...prev.smtp,
          host: "smtp.hostinger.com",
          port: 465,
          secure: true,
        },
      }));
    }
  };

  const insertVariable = (templateKey, variable) => {
    setSettings((prev) => ({
      ...prev,
      [templateKey]: {
        ...prev[templateKey],
        body: (prev[templateKey]?.body || "") + ` {${variable}}`,
      },
    }));
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
        Loading email settings...
      </div>
    );
  }

  const tabs = [
    { id: "smtp", label: "SMTP Server", icon: Server },
    { id: "branding", label: "Branding & Header/Footer", icon: Palette },
    { id: "userTemplate", label: "Customer Confirmation", icon: UserCheck },
    { id: "adminTemplate", label: "Admin Lead Notification", icon: Bell },
    { id: "newsletterTemplate", label: "Newsletter Welcome", icon: Mail },
  ];

  const brandLogo = settings.branding?.logoUrl || "/assets/img/logo.png";
  const brandName = settings.branding?.companyName || "Anjani Industries";
  const brandTagline = settings.branding?.tagline || "Fabric Dyeing & Textile Processing Machinery";

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
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: "0 0 4px 0",
              color: "#0f172a",
            }}
          >
            Email &amp; SMTP Configuration
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Configure SMTP credentials, test mail delivery, customize branding, and edit dynamic email templates for inquiries and newsletter subscribers.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn-primary"
        >
          <Save size={16} />
          <span>{saving ? "Saving..." : "Save Email Settings"}</span>
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
          {message.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          flexWrap: "wrap",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: 12,
        }}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`admin-btn ${isActive ? "admin-btn-primary" : "admin-btn-secondary"}`}
              style={{ padding: "9px 16px", fontSize: 13 }}
            >
              <Icon size={15} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave}>
        {/* =========================================================================
            TAB 1: SMTP CONFIGURATION
        ========================================================================= */}
        {activeTab === "smtp" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Master Switch Card */}
            <div
              className="admin-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                borderLeft: settings.smtp.enabled
                  ? "4px solid #16a34a"
                  : "4px solid #94a3b8",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  SMTP Automated Email Dispatch
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                  When enabled, inquiries and newsletter welcomes are automatically dispatched via your authenticated SMTP mail server.
                </p>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.smtp.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, enabled: e.target.checked },
                    })
                  }
                  style={{
                    width: 20,
                    height: 20,
                    accentColor: "var(--admin-primary)",
                  }}
                />
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: settings.smtp.enabled ? "#16a34a" : "#64748b",
                  }}
                >
                  {settings.smtp.enabled ? "Enabled (Active)" : "Disabled (Off)"}
                </span>
              </label>
            </div>

            {/* Provider Quick Presets */}
            <div className="admin-card" style={{ padding: "16px 20px" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: 10,
                }}
              >
                Quick Fill Popular SMTP Providers:
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => applyPreset("gmail")}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  Gmail (smtp.gmail.com)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("outlook")}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  Outlook / Office 365
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("zoho")}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  Zoho Mail
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("hostinger")}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  Hostinger / cPanel
                </button>
              </div>
            </div>

            {/* Server Settings Card */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: 18 }}>
                Server Credentials &amp; Ports
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 16,
                }}
              >
                <div className="admin-form-group">
                  <label className="admin-label">SMTP Host</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="smtp.gmail.com"
                    value={settings.smtp.host}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, host: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">SMTP Port</label>
                  <input
                    type="number"
                    className="admin-input"
                    placeholder="587 or 465"
                    value={settings.smtp.port}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: {
                          ...settings.smtp,
                          port: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Encryption (SSL / TLS)</label>
                  <select
                    className="admin-select"
                    value={settings.smtp.secure ? "ssl" : "tls"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: {
                          ...settings.smtp,
                          secure: e.target.value === "ssl",
                        },
                      })
                    }
                  >
                    <option value="tls">
                      STARTTLS (Port 587 - Recommended for Gmail / Outlook)
                    </option>
                    <option value="ssl">SSL / TLS (Port 465)</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 16,
                  marginTop: 12,
                }}
              >
                <div className="admin-form-group">
                  <label className="admin-label">SMTP Username / Email</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="your-email@gmail.com"
                    value={settings.smtp.auth.user}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: {
                          ...settings.smtp,
                          auth: { ...settings.smtp.auth, user: e.target.value },
                        },
                      })
                    }
                  />
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    For Gmail, use your full email address.
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    SMTP Password / App Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="admin-input"
                      placeholder="••••••••••••••••"
                      value={settings.smtp.auth.pass}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          smtp: {
                            ...settings.smtp,
                            auth: {
                              ...settings.smtp.auth,
                              pass: e.target.value,
                            },
                          },
                        })
                      }
                      style={{ paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#64748b",
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    For Gmail accounts, generate a 16-character{" "}
                    <strong>App Password</strong> under Google Account &gt;
                    Security.
                  </div>
                </div>
              </div>
            </div>

            {/* Sender & Recipient Addresses Card */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: 18 }}>
                Sender Identity &amp; Notification Routing
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 16,
                }}
              >
                <div className="admin-form-group">
                  <label className="admin-label">Sender Display Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Anjani Industries"
                    value={settings.smtp.fromName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, fromName: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    Sender Email Address (From)
                  </label>
                  <input
                    type="email"
                    className="admin-input"
                    placeholder="contact@anjaniindustries.in"
                    value={settings.smtp.fromEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, fromEmail: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Reply-To Email Address</label>
                  <input
                    type="email"
                    className="admin-input"
                    placeholder="info@anjaniindustries.in"
                    value={settings.smtp.replyTo}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, replyTo: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: 12 }}>
                <label className="admin-label">
                  Admin Lead Alert Email (Where sales inquiries are delivered)
                </label>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="info@anjaniindustries.in"
                  value={settings.smtp.adminNotificationEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smtp: {
                        ...settings.smtp,
                        adminNotificationEmail: e.target.value,
                      },
                    })
                  }
                />
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  Whenever a customer submits an inquiry on the website, instant
                  notifications are dispatched to this address.
                </div>
              </div>
            </div>

            {/* Test Email Card */}
            <div className="admin-card" style={{ border: "1px solid #cbd5e1" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <Send size={18} style={{ color: "var(--admin-primary)" }} />
                <h3 className="admin-card-title" style={{ margin: 0 }}>
                  Test Your SMTP Configuration
                </h3>
              </div>
              <p
                style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px 0" }}
              >
                Send an immediate test email to verify whether your SMTP host,
                port, and authentication credentials connect successfully.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <input
                  type="email"
                  className="admin-input"
                  placeholder="Enter recipient email (e.g. your email)"
                  value={testEmailTo}
                  onChange={(e) => setTestEmailTo(e.target.value)}
                  style={{ maxWidth: 360 }}
                />
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={sendingTest}
                  className="admin-btn admin-btn-secondary"
                  style={{ gap: 6 }}
                >
                  {sendingTest ? (
                    <RefreshCw size={14} className="spin-animation" />
                  ) : (
                    <Send size={14} />
                  )}
                  <span>
                    {sendingTest ? "Sending Test Email..." : "Send Test Email"}
                  </span>
                </button>
              </div>

              {testResult.text && (
                <div
                  style={{
                    marginTop: 14,
                    padding: "10px 14px",
                    borderRadius: 6,
                    fontSize: 13,
                    backgroundColor:
                      testResult.type === "success" ? "#dcfce7" : "#fee2e2",
                    color:
                      testResult.type === "success" ? "#15803d" : "#b91c1c",
                    border: `1px solid ${testResult.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                  }}
                >
                  {testResult.text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: BRANDING & HEADER / FOOTER
        ========================================================================= */}
        {activeTab === "branding" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: 18 }}>
                Global Email Header &amp; Footer Branding
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px 0" }}>
                These brand assets appear at the top header and bottom signature of every email template sent to customers and newsletter subscribers.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                <div className="admin-form-group">
                  <label className="admin-label">Logo Path or URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.branding?.logoUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        branding: {
                          ...settings.branding,
                          logoUrl: e.target.value,
                        },
                      })
                    }
                    placeholder="/assets/img/logo.png"
                  />
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    Default: <code>/assets/img/logo.png</code> (embedded with high-res CID inline).
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Company Brand Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.branding?.companyName || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        branding: {
                          ...settings.branding,
                          companyName: e.target.value,
                        },
                      })
                    }
                    placeholder="Anjani Industries"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Sub-Header Tagline</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.branding?.tagline || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        branding: {
                          ...settings.branding,
                          tagline: e.target.value,
                        },
                      })
                    }
                    placeholder="Fabric Dyeing & Textile Processing Machinery"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Official Phone</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.branding?.phone || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        branding: {
                          ...settings.branding,
                          phone: e.target.value,
                        },
                      })
                    }
                    placeholder="+91 8154 888 370"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Official Support / Sales Email</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={settings.branding?.email || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        branding: {
                          ...settings.branding,
                          email: e.target.value,
                        },
                      })
                    }
                    placeholder="info@anjaniindustries.in"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Website URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={settings.branding?.website || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        branding: {
                          ...settings.branding,
                          website: e.target.value,
                        },
                      })
                    }
                    placeholder="https://www.anjaniindustries.in"
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: 16 }}>
                <label className="admin-label">Official Factory / Office Physical Address</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  value={settings.branding?.address || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      branding: {
                        ...settings.branding,
                        address: e.target.value,
                      },
                    })
                  }
                  placeholder="Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India"
                />
              </div>
            </div>

            {/* Header / Footer Preview */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: 14 }}>
                Branded Header &amp; Footer Preview
              </h3>
              <div
                style={{
                  backgroundColor: "#f1f5f9",
                  padding: "24px 16px",
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    maxWidth: 580,
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#0c0d14",
                      borderTop: "4px solid #cb0000",
                      padding: "20px 24px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 8,
                        padding: "8px 18px",
                        display: "inline-block",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                      }}
                    >
                      <img
                        src={brandLogo}
                        alt={brandName}
                        style={{ maxHeight: 40, height: 40, width: "auto", display: "block" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 11,
                        marginTop: 8,
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {brandTagline}
                    </div>
                  </div>

                  <div style={{ padding: "30px 24px", textAlign: "center", color: "#64748b", fontSize: 14 }}>
                    <em>[ Email body content will be placed here ]</em>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      borderTop: "1px solid #e2e8f0",
                      padding: "16px 20px",
                      textAlign: "center",
                      fontSize: 11,
                      color: "#64748b",
                      lineHeight: 1.5,
                    }}
                  >
                    <div>{settings.branding?.address}</div>
                    <div style={{ marginTop: 4 }}>
                      Phone: {settings.branding?.phone} | Email: {settings.branding?.email} | {settings.branding?.website}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: CUSTOMER CONFIRMATION TEMPLATE
        ========================================================================= */}
        {activeTab === "userTemplate" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Enable/Disable Card */}
            <div
              className="admin-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Customer Auto-Reply Email
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                  Automatically sends a branded confirmation email to the customer immediately upon submitting an inquiry.
                </p>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.userTemplate.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      userTemplate: {
                        ...settings.userTemplate,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "var(--admin-primary)",
                  }}
                />
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {settings.userTemplate.enabled ? "Active" : "Disabled"}
                </span>
              </label>
            </div>

            {/* Template Inputs Card */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: 18 }}>
                Template Content &amp; Placeholders
              </h3>

              <div className="admin-form-group">
                <label className="admin-label">Email Subject Line</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.userTemplate.subject}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      userTemplate: {
                        ...settings.userTemplate,
                        subject: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Email Heading Banner <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>(Optional - leave blank if not needed)</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Inquiry Received Successfully (Optional)"
                  value={settings.userTemplate.heading}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      userTemplate: {
                        ...settings.userTemplate,
                        heading: e.target.value,
                      },
                    })
                  }
                />
              </div>

              {/* Variable Chips */}
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#475569",
                    marginBottom: 6,
                  }}
                >
                  Click to insert placeholder tags into message body:
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    "userName",
                    "userEmail",
                    "userPhone",
                    "productName",
                    "subject",
                    "message",
                    "companyName",
                  ].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariable("userTemplate", v)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 4,
                        border: "1px solid #cbd5e1",
                        backgroundColor: "#f8fafc",
                        fontSize: 12,
                        cursor: "pointer",
                        color: "#cb0000",
                        fontWeight: 600,
                      }}
                    >
                      +{`{${v}}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Main Message Body</label>
                <textarea
                  rows={6}
                  className="admin-textarea"
                  value={settings.userTemplate.body}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      userTemplate: {
                        ...settings.userTemplate,
                        body: e.target.value,
                      },
                    })
                  }
                />
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  Use double line breaks to separate paragraphs.
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 16,
                  marginTop: 12,
                }}
              >
                <div className="admin-form-group">
                  <label className="admin-label">Call-to-Action (CTA) Button Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Explore Machinery Catalog"
                    value={settings.userTemplate.ctaText || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        userTemplate: {
                          ...settings.userTemplate,
                          ctaText: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">CTA Button Link URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://www.anjaniindustries.in/products"
                    value={settings.userTemplate.ctaUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        userTemplate: {
                          ...settings.userTemplate,
                          ctaUrl: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: 12 }}>
                <label className="admin-label">Footer Contact Note</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  value={settings.userTemplate.footerNote}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      userTemplate: {
                        ...settings.userTemplate,
                        footerNote: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Live Interactive Email Preview Card */}
            <div className="admin-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <Eye size={18} style={{ color: "var(--admin-primary)" }} />
                <h3 className="admin-card-title" style={{ margin: 0 }}>
                  Live Customer Email Preview
                </h3>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px 0" }}>
                This is a live preview showing how your customer will see this confirmation email in their inbox.
              </p>

              <div
                style={{
                  backgroundColor: "#f1f5f9",
                  padding: "24px 16px",
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    maxWidth: 580,
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Email Header */}
                  <div
                    style={{
                      backgroundColor: "#0c0d14",
                      borderTop: "4px solid #cb0000",
                      padding: "20px 24px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 8,
                        padding: "8px 18px",
                        display: "inline-block",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                      }}
                    >
                      <img
                        src={brandLogo}
                        alt={brandName}
                        style={{ maxHeight: 40, height: 40, width: "auto", display: "block" }}
                      />
                    </div>
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 11,
                        marginTop: 8,
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {brandTagline}
                    </div>
                  </div>

                  {/* Email Body */}
                  <div style={{ padding: "28px 24px" }}>
                    {settings.userTemplate.heading && settings.userTemplate.heading.trim() ? (
                      <h2
                        style={{
                          margin: "0 0 16px 0",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {settings.userTemplate.heading.trim()}
                      </h2>
                    ) : null}

                    <div
                      style={{
                        fontSize: 14,
                        color: "#334155",
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {(settings.userTemplate.body || "")
                        .replace(/\{userName\}/g, "Rahul Mehta")
                        .replace(/\{userEmail\}/g, "rahul@example.com")
                        .replace(/\{userPhone\}/g, "+91 98765 43210")
                        .replace(/\{productName\}/g, "PLC Based Eco Soft Flow Dyeing Machine")
                        .replace(/\{subject\}/g, "PLC Based Eco Soft Flow Dyeing Machine")
                        .replace(/\{companyName\}/g, brandName)}
                    </div>

                    {/* Inquiry summary box */}
                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 6,
                        padding: "14px 16px",
                        margin: "20px 0",
                        fontSize: 13,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#0f172a",
                          marginBottom: 8,
                          textTransform: "uppercase",
                          fontSize: 11,
                        }}
                      >
                        Inquiry Submission Summary
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "100px 1fr",
                          gap: 6,
                        }}
                      >
                        <span style={{ color: "#64748b" }}>Customer:</span>
                        <strong style={{ color: "#0f172a" }}>Rahul Mehta</strong>
                        <span style={{ color: "#64748b" }}>Product:</span>
                        <strong style={{ color: "#cb0000" }}>
                          PLC Based Eco Soft Flow Dyeing Machine
                        </strong>
                      </div>
                    </div>

                    {settings.userTemplate.ctaText && (
                      <div style={{ textAlign: "center", marginTop: 24 }}>
                        <a
                          href={settings.userTemplate.ctaUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            backgroundColor: "#cb0000",
                            color: "#ffffff",
                            padding: "11px 26px",
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            display: "inline-block",
                            textDecoration: "none",
                          }}
                        >
                          {settings.userTemplate.ctaText}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Email Footer */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      borderTop: "1px solid #e2e8f0",
                      padding: "16px 20px",
                      textAlign: "center",
                      fontSize: 11,
                      color: "#64748b",
                      lineHeight: 1.5,
                    }}
                  >
                    {settings.userTemplate.footerNote}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: ADMIN LEAD ALERT TEMPLATE
        ========================================================================= */}
        {activeTab === "adminTemplate" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Enable/Disable Card */}
            <div
              className="admin-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Admin Sales Lead Notification
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                  Dispatches an instant notification with full customer details to your sales team as soon as a lead is captured.
                </p>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.adminTemplate.enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      adminTemplate: {
                        ...settings.adminTemplate,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "var(--admin-primary)",
                  }}
                />
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {settings.adminTemplate.enabled ? "Active" : "Disabled"}
                </span>
              </label>
            </div>

            {/* Template Inputs Card */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: 18 }}>
                Lead Alert Configuration
              </h3>

              <div className="admin-form-group">
                <label className="admin-label">Notification Email Subject Line</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.adminTemplate.subject}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      adminTemplate: {
                        ...settings.adminTemplate,
                        subject: e.target.value,
                      },
                    })
                  }
                />
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  Supports placeholders like <code>{"{userName}"}</code>, <code>{"{subject}"}</code>, <code>{"{date}"}</code>.
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Notification Heading Banner <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>(Optional - leave blank if not needed)</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. New Customer Inquiry Received (Optional)"
                  value={settings.adminTemplate.heading}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      adminTemplate: {
                        ...settings.adminTemplate,
                        heading: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Admin Notification Introductory Message</label>
                <textarea
                  rows={3}
                  className="admin-textarea"
                  value={settings.adminTemplate.body || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      adminTemplate: {
                        ...settings.adminTemplate,
                        body: e.target.value,
                      },
                    })
                  }
                  placeholder="A new customer inquiry has just been submitted on the Anjani Industries website..."
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Notification Footer Note</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.adminTemplate.footerNote || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      adminTemplate: {
                        ...settings.adminTemplate,
                        footerNote: e.target.value,
                      },
                    })
                  }
                  placeholder="Internal Sales Notification - Anjani Industries Machinery Lead Capture"
                />
              </div>
            </div>

            {/* Live Admin Alert Preview Card */}
            <div className="admin-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <Eye size={18} style={{ color: "var(--admin-primary)" }} />
                <h3 className="admin-card-title" style={{ margin: 0 }}>
                  Live Admin Lead Notification Preview
                </h3>
              </div>

              <div
                style={{
                  backgroundColor: "#f1f5f9",
                  padding: "24px 16px",
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    maxWidth: 580,
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#0c0d14",
                      borderTop: "4px solid #cb0000",
                      padding: "20px 24px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 8,
                        padding: "8px 18px",
                        display: "inline-block",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                      }}
                    >
                      <img
                        src={brandLogo}
                        alt={brandName}
                        style={{ maxHeight: 40, height: 40, width: "auto", display: "block" }}
                      />
                    </div>
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 11,
                        marginTop: 8,
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      NEW SALES INQUIRY CAPTURED
                    </div>
                  </div>

                  <div style={{ padding: "28px 24px" }}>
                    {settings.adminTemplate.heading && settings.adminTemplate.heading.trim() ? (
                      <h2
                        style={{
                          margin: "0 0 16px 0",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {settings.adminTemplate.heading.trim()}
                      </h2>
                    ) : null}

                    <p style={{ color: "#475569", fontSize: 14, margin: "0 0 20px 0" }}>
                      {settings.adminTemplate.body || "A new customer inquiry has just been submitted on the website. Lead details are below:"}
                    </p>

                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 6,
                        padding: "16px 18px",
                        fontSize: 13,
                      }}
                    >
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: "6px 0", color: "#64748b", width: 120 }}>Name:</td>
                            <td style={{ padding: "6px 0", color: "#0f172a", fontWeight: 600 }}>Rajesh Patel</td>
                          </tr>
                          <tr>
                            <td style={{ padding: "6px 0", color: "#64748b" }}>Email:</td>
                            <td style={{ padding: "6px 0", color: "#cb0000" }}>rajesh@textilegroup.in</td>
                          </tr>
                          <tr>
                            <td style={{ padding: "6px 0", color: "#64748b" }}>Phone:</td>
                            <td style={{ padding: "6px 0", color: "#0f172a", fontWeight: 600 }}>+91 99887 76655</td>
                          </tr>
                          <tr>
                            <td style={{ padding: "6px 0", color: "#64748b" }}>Machine:</td>
                            <td style={{ padding: "6px 0", color: "#0f172a", fontWeight: 600 }}>U Type Rapid Jet Dyeing</td>
                          </tr>
                          <tr>
                            <td style={{ padding: "6px 0", color: "#64748b", verticalAlign: "top" }}>Message:</td>
                            <td style={{ padding: "6px 0", color: "#334155", background: "#fff", padding: "8px 10px", borderRadius: 4, border: "1px solid #e2e8f0" }}>
                              Please send price quotation and technical specifications for 500 KG capacity unit.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div style={{ textAlign: "center", marginTop: 24 }}>
                      <span
                        style={{
                          backgroundColor: "#cb0000",
                          color: "#ffffff",
                          padding: "10px 24px",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          display: "inline-block",
                        }}
                      >
                        Reply to Rajesh Patel
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      borderTop: "1px solid #e2e8f0",
                      padding: "14px 20px",
                      textAlign: "center",
                      fontSize: 11,
                      color: "#64748b",
                    }}
                  >
                    {settings.adminTemplate.footerNote || "Internal Sales Notification - Anjani Industries Machinery Lead Capture"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: NEWSLETTER WELCOME TEMPLATE
        ========================================================================= */}
        {activeTab === "newsletterTemplate" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Enable/Disable Card */}
            <div
              className="admin-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Newsletter Welcome Email Auto-Responder
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                  Automatically delivers a branded welcome email to subscribers immediately after they join the newsletter in the website footer.
                </p>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={settings.newsletterTemplate?.enabled ?? true}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      newsletterTemplate: {
                        ...settings.newsletterTemplate,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "var(--admin-primary)",
                  }}
                />
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {settings.newsletterTemplate?.enabled !== false ? "Active" : "Disabled"}
                </span>
              </label>
            </div>

            {/* Template Inputs Card */}
            <div className="admin-card">
              <h3 className="admin-card-title" style={{ marginBottom: 18 }}>
                Newsletter Welcome Email Template
              </h3>

              <div className="admin-form-group">
                <label className="admin-label">Welcome Email Subject Line</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.newsletterTemplate?.subject || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      newsletterTemplate: {
                        ...settings.newsletterTemplate,
                        subject: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Email Heading Banner <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>(Optional - leave blank if not needed)</span>
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Thank You for Subscribing! (Optional)"
                  value={settings.newsletterTemplate?.heading || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      newsletterTemplate: {
                        ...settings.newsletterTemplate,
                        heading: e.target.value,
                      },
                    })
                  }
                />
              </div>

              {/* Variable Chips */}
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#475569",
                    marginBottom: 6,
                  }}
                >
                  Click to insert placeholder tags into newsletter body:
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    "subscriberEmail",
                    "companyName",
                    "companyPhone",
                    "companyEmail",
                    "date",
                  ].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariable("newsletterTemplate", v)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 4,
                        border: "1px solid #cbd5e1",
                        backgroundColor: "#f8fafc",
                        fontSize: 12,
                        cursor: "pointer",
                        color: "#9333ea",
                        fontWeight: 600,
                      }}
                    >
                      +{`{${v}}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Main Message Body</label>
                <textarea
                  rows={7}
                  className="admin-textarea"
                  value={settings.newsletterTemplate?.body || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      newsletterTemplate: {
                        ...settings.newsletterTemplate,
                        body: e.target.value,
                      },
                    })
                  }
                />
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  Use double line breaks to separate paragraphs.
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 16,
                  marginTop: 12,
                }}
              >
                <div className="admin-form-group">
                  <label className="admin-label">Call-to-Action (CTA) Button Text</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Explore Machinery Range"
                    value={settings.newsletterTemplate?.ctaText || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletterTemplate: {
                          ...settings.newsletterTemplate,
                          ctaText: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">CTA Button Link URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://www.anjaniindustries.in/products"
                    value={settings.newsletterTemplate?.ctaUrl || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletterTemplate: {
                          ...settings.newsletterTemplate,
                          ctaUrl: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: 12 }}>
                <label className="admin-label">Footer Contact Note</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  value={settings.newsletterTemplate?.footerNote || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      newsletterTemplate: {
                        ...settings.newsletterTemplate,
                        footerNote: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Live Interactive Email Preview Card */}
            <div className="admin-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <Eye size={18} style={{ color: "var(--admin-primary)" }} />
                <h3 className="admin-card-title" style={{ margin: 0 }}>
                  Live Newsletter Welcome Email Preview
                </h3>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px 0" }}>
                This preview shows exactly how newly registered subscribers will view your welcome email in their inbox.
              </p>

              <div
                style={{
                  backgroundColor: "#f1f5f9",
                  padding: "24px 16px",
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    maxWidth: 580,
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Email Header */}
                  <div
                    style={{
                      backgroundColor: "#0c0d14",
                      borderTop: "4px solid #cb0000",
                      padding: "20px 24px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 8,
                        padding: "8px 18px",
                        display: "inline-block",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                      }}
                    >
                      <img
                        src={brandLogo}
                        alt={brandName}
                        style={{ maxHeight: 40, height: 40, width: "auto", display: "block" }}
                      />
                    </div>
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 11,
                        marginTop: 8,
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      Official Newsletter Subscription Confirmed
                    </div>
                  </div>

                  {/* Email Body */}
                  <div style={{ padding: "28px 24px" }}>
                    {settings.newsletterTemplate?.heading && settings.newsletterTemplate.heading.trim() ? (
                      <h2
                        style={{
                          margin: "0 0 16px 0",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {settings.newsletterTemplate.heading.trim()}
                      </h2>
                    ) : null}

                    <div
                      style={{
                        fontSize: 14,
                        color: "#334155",
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {(settings.newsletterTemplate?.body || "")
                        .replace(/\{subscriberEmail\}/g, "patel.textiles@gmail.com")
                        .replace(/\{userName\}/g, "Valued Subscriber")
                        .replace(/\{companyName\}/g, brandName)
                        .replace(/\{companyPhone\}/g, settings.branding?.phone || "+91 8154 888 370")
                        .replace(/\{companyEmail\}/g, settings.branding?.email || "info@anjaniindustries.in")
                        .replace(/\{date\}/g, new Date().toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }))}
                    </div>

                    {/* Subscriber confirmation box */}
                    <div
                      style={{
                        backgroundColor: "#faf5ff",
                        border: "1px solid #e9d5ff",
                        borderRadius: 6,
                        padding: "14px 16px",
                        margin: "20px 0",
                        fontSize: 13,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#7e22ce",
                          marginBottom: 6,
                          textTransform: "uppercase",
                          fontSize: 11,
                        }}
                      >
                        ✓ Subscription Verified
                      </div>
                      <div style={{ color: "#475569", fontSize: 13 }}>
                        Registered Email: <strong style={{ color: "#0f172a" }}>patel.textiles@gmail.com</strong>
                      </div>
                    </div>

                    {settings.newsletterTemplate?.ctaText && (
                      <div style={{ textAlign: "center", marginTop: 24 }}>
                        <a
                          href={settings.newsletterTemplate?.ctaUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            backgroundColor: "#cb0000",
                            color: "#ffffff",
                            padding: "11px 26px",
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            display: "inline-block",
                            textDecoration: "none",
                          }}
                        >
                          {settings.newsletterTemplate.ctaText}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Email Footer */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      borderTop: "1px solid #e2e8f0",
                      padding: "16px 20px",
                      textAlign: "center",
                      fontSize: 11,
                      color: "#64748b",
                      lineHeight: 1.5,
                    }}
                  >
                    {settings.newsletterTemplate?.footerNote}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginBottom: 40,
            marginTop: 24,
          }}
        >
          <button
            type="submit"
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ padding: "12px 28px" }}
          >
            <Save size={16} />
            <span>{saving ? "Saving..." : "Save Email Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
