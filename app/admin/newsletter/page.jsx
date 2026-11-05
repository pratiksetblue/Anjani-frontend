"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  Search,
  Trash2,
  Edit,
  RefreshCw,
  X,
  Copy,
  Check,
  Globe,
  UserPlus,
  Save,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Users,
  SendHorizontal,
  Settings,
} from "lucide-react";
import ExhibitorEmailPreview from "@/components/admin/ExhibitorEmailPreview";

const TEMPLATES = [
  {
    name: "🌟 Exhibitor Machinery Catalog Template",
    subject: "Official Communication & Textile Machinery Solutions from Anjani Industries",
    heading: "",
    message:
      "Dear {subscriberName},\n\nWe are pleased to connect with you regarding our advanced textile dyeing and processing machinery solutions. Anjani Industries is one of India's leading manufacturers of textile dyeing and processing machinery, backed by over 36 years of engineering excellence.\n\nShould you need any technical documentation, capacity specifications, or customized machinery quotation, our engineering team is here to assist you.",
    ctaText: "REQUEST A QUOTE",
    ctaUrl: "https://www.anjaniindustries.in/contact-us",
  },
];

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [copiedEmails, setCopiedEmails] = useState(false);

  // SMTP status
  const [smtpStatus, setSmtpStatus] = useState({
    loaded: false,
    enabled: false,
    configured: false,
    host: "",
    fromEmail: "",
    adminNotificationEmail: "",
  });

  // Edit / Add state
  const [editingSub, setEditingSub] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    country: "",
    email: "",
    phone: "",
    message: "",
  });

  // Send Newsletter Modal State
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sendRecipientMode, setSendRecipientMode] = useState("all"); // 'all' | 'filtered' | 'single' | 'test'
  const [singleRecipient, setSingleRecipient] = useState(null);
  const [modalTab, setModalTab] = useState("compose"); // 'compose' | 'preview'
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const [emailForm, setEmailForm] = useState({
    subject: TEMPLATES[0].subject,
    heading: TEMPLATES[0].heading,
    message: TEMPLATES[0].message,
    ctaText: TEMPLATES[0].ctaText,
    ctaUrl: TEMPLATES[0].ctaUrl,
    testEmail: "",
  });

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        const news = data.filter((item) => item.type === "Newsletter");
        setSubscribers(news);
      }
    } catch (err) {
      console.error("Fetch newsletter error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSmtpStatus = async () => {
    try {
      const res = await fetch("/api/newsletter/send");
      if (res.ok) {
        const data = await res.json();
        setSmtpStatus({
          loaded: true,
          enabled: Boolean(data.smtpEnabled),
          configured: Boolean(data.smtpConfigured),
          host: data.host || "",
          fromEmail: data.fromEmail || "",
          adminNotificationEmail: data.adminNotificationEmail || "",
        });
        if (data.adminNotificationEmail || data.fromEmail) {
          setEmailForm((prev) => ({
            ...prev,
            testEmail: prev.testEmail || data.adminNotificationEmail || data.fromEmail,
          }));
        }
      }
    } catch (err) {
      console.warn("SMTP check error:", err);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchSmtpStatus();

    async function loadExhibitorTemplateDefaults() {
      try {
        const res = await fetch("/api/email-settings");
        if (res.ok) {
          const data = await res.json();
          const ext = data?.exhibitorTemplate;
          if (ext) {
            setEmailForm((prev) => ({
              ...prev,
              subject: ext.subject || prev.subject,
              heading: ext.heading !== undefined ? ext.heading : prev.heading,
              message: ext.body || prev.message,
              ctaText: ext.ctaText || prev.ctaText,
              ctaUrl: ext.ctaUrl || prev.ctaUrl,
            }));
          }
        }
      } catch (err) {
        console.warn("Could not load exhibitor template defaults", err);
      }
    }
    loadExhibitorTemplateDefaults();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id && s._id !== id));
      }
    } catch (err) {
      console.error("Delete subscriber error:", err);
    }
  };

  const openEditModal = (sub) => {
    let fn = sub.firstName || "";
    let ln = sub.lastName || "";
    if (!fn && !ln && sub.name && sub.name !== "Newsletter Subscriber") {
      const parts = sub.name.trim().split(" ");
      fn = parts[0] || "";
      ln = parts.slice(1).join(" ") || "";
    }
    setForm({
      id: sub.id || sub._id,
      firstName: fn,
      lastName: ln,
      country: sub.country || "",
      email: sub.email || "",
      phone: sub.phone || "",
      message: sub.message || "",
    });
    setEditingSub(sub);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.email.trim()) {
      alert("Email is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/inquiries/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          country: form.country.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSubscribers((prev) =>
          prev.map((s) => (s.id === form.id || s._id === form.id ? { ...s, ...updated } : s))
        );
        setEditingSub(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update subscriber");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    if (!form.email || !form.email.trim()) {
      alert("Email is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          country: form.country.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim() || "Manually added by Admin",
          type: "Newsletter",
          subject: "Newsletter Subscription",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.inquiry) {
          setSubscribers((prev) => [data.inquiry, ...prev]);
        } else {
          fetchSubscribers();
        }
        setIsAdding(false);
        setForm({
          id: "",
          firstName: "",
          lastName: "",
          country: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add subscriber");
      }
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add subscriber.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyEmails = () => {
    const emails = Array.from(new Set(subscribers.map((s) => s.email).filter(Boolean)));
    if (emails.length === 0) return;
    navigator.clipboard.writeText(emails.join(", "));
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2500);
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert("No subscribers to export.");
      return;
    }
    const headers = ["Date Subscribed", "First Name", "Last Name", "Country", "Email", "Phone", "Notes"];
    const rows = filtered.map((s) => [
      new Date(s.createdAt).toLocaleDateString("en-IN"),
      s.firstName || "",
      s.lastName || "",
      s.country || "",
      s.email || "",
      s.phone || "",
      (s.message || "").replace(/\n/g, " "),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `anjani_newsletter_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Send Modal for all or single subscriber
  const openSendModal = (recipient = null) => {
    setSendResult(null);
    setModalTab("compose");
    if (recipient) {
      setSingleRecipient(recipient);
      setSendRecipientMode("single");
    } else {
      setSingleRecipient(null);
      setSendRecipientMode(countryFilter !== "ALL" || search ? "filtered" : "all");
    }
    setSendModalOpen(true);
  };

  const applyTemplate = (tpl) => {
    setEmailForm((prev) => ({
      ...prev,
      subject: tpl.subject,
      heading: tpl.heading,
      message: tpl.message,
      ctaText: tpl.ctaText,
      ctaUrl: tpl.ctaUrl,
    }));
  };

  // Send Email API Call
  const handleSendEmail = async (isTestOnly = false) => {
    let recipientsList = [];

    if (isTestOnly) {
      if (!emailForm.testEmail || !emailForm.testEmail.trim()) {
        alert("Please enter a valid test recipient email address.");
        return;
      }
      recipientsList = [emailForm.testEmail.trim()];
    } else if (sendRecipientMode === "all") {
      recipientsList = subscribers.map((s) => ({
        email: s.email,
        firstName: s.firstName || s.name || "",
        lastName: s.lastName || "",
      }));
    } else if (sendRecipientMode === "filtered") {
      recipientsList = filtered.map((s) => ({
        email: s.email,
        firstName: s.firstName || s.name || "",
        lastName: s.lastName || "",
      }));
    } else if (sendRecipientMode === "single") {
      if (!singleRecipient?.email) {
        alert("No subscriber selected.");
        return;
      }
      recipientsList = [singleRecipient];
    } else if (sendRecipientMode === "test") {
      if (!emailForm.testEmail || !emailForm.testEmail.trim()) {
        alert("Please enter a test email address.");
        return;
      }
      recipientsList = [emailForm.testEmail.trim()];
    }

    if (recipientsList.length === 0) {
      alert("No recipients to send to.");
      return;
    }

    if (!isTestOnly && recipientsList.length > 1) {
      const confirmed = confirm(
        `Are you sure you want to broadcast this newsletter email to ${recipientsList.length} subscriber(s)?`
      );
      if (!confirmed) return;
    }

    setSendingEmail(true);
    setSendResult(null);

    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: recipientsList,
          subject: emailForm.subject,
          heading: emailForm.heading,
          message: emailForm.message,
          ctaText: emailForm.ctaText,
          ctaUrl: emailForm.ctaUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSendResult({
          type: "success",
          message: data.message || `Successfully sent to ${data.results?.sent || 0} subscriber(s)!`,
          details: data.results,
        });
      } else {
        setSendResult({
          type: "error",
          message: data.error || "Failed to send newsletter email.",
        });
      }
    } catch (err) {
      console.error("Send error:", err);
      setSendResult({
        type: "error",
        message: err.message || "Network error while sending email.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const uniqueCountries = Array.from(
    new Set(subscribers.map((s) => s.country?.trim()).filter(Boolean))
  ).sort();

  const filtered = subscribers.filter((s) => {
    const matchesCountry =
      countryFilter === "ALL" || (s.country?.trim() || "Unspecified") === countryFilter;
    const matchesSearch =
      s.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      s.country?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search) ||
      s.message?.toLowerCase().includes(search.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0", color: "#0f172a" }}>
            Newsletter Leads &amp; Subscribers ({subscribers.length})
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            ન્યૂઝલેટર લીડ્સ અને ઈમેઈલ મોકલવાનું મેનેજર — Send branded newsletters directly to subscribers with 1 click.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {/* Main Action: Send Newsletter Email */}
          <button
            onClick={() => openSendModal(null)}
            className="admin-btn admin-btn-primary"
            style={{
              gap: 8,
              boxShadow: "0 2px 10px rgba(203, 0, 0, 0.3)",
              fontSize: 14,
            }}
          >
            <Send size={16} />
            <span>Send Mail to Subscribers</span>
          </button>

          <button
            onClick={() => {
              setForm({
                id: "",
                firstName: "",
                lastName: "",
                country: "",
                email: "",
                phone: "",
                message: "",
              });
              setIsAdding(true);
            }}
            className="admin-btn admin-btn-secondary"
            style={{ gap: 6 }}
          >
            <UserPlus size={16} />
            <span>+ Add Subscriber</span>
          </button>

          {subscribers.length > 0 && (
            <button
              onClick={handleCopyEmails}
              className="admin-btn admin-btn-secondary"
              title="Copy all subscriber emails formatted for newsletters"
              style={{ gap: 6, borderColor: "#cbd5e1" }}
            >
              {copiedEmails ? (
                <>
                  <Check size={16} style={{ color: "#16a34a" }} />
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>
                    Copied {subscribers.length} Emails!
                  </span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Emails</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="admin-btn admin-btn-secondary"
            title="Export to CSV"
            style={{ gap: 6, borderColor: "#cbd5e1" }}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button onClick={fetchSubscribers} className="admin-btn admin-btn-secondary" title="Refresh">
            <RefreshCw size={16} className={loading ? "spin-animation" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* SMTP Status Notification Banner */}
      {smtpStatus.loaded && !smtpStatus.enabled && (
        <div
          style={{
            backgroundColor: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 10,
            padding: "14px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AlertCircle size={22} style={{ color: "#d97706", flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: "#92400e", fontSize: 14 }}>
                SMTP Server is Currently Disabled
              </div>
              <div style={{ fontSize: 13, color: "#b45309", marginTop: 2 }}>
                Emails cannot be delivered until SMTP credentials are enabled in Email &amp; SMTP settings.
              </div>
            </div>
          </div>
          <Link
            href="/admin/email"
            className="admin-btn admin-btn-sm"
            style={{
              backgroundColor: "#d97706",
              color: "#ffffff",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Settings size={14} /> Configure SMTP Now
          </Link>
        </div>
      )}

      {smtpStatus.loaded && smtpStatus.enabled && (
        <div
          style={{
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: 8,
            padding: "10px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 13,
            color: "#065f46",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={16} style={{ color: "#059669" }} />
            <span>
              <strong>SMTP Connected:</strong> Ready to deliver emails via{" "}
              <code style={{ background: "#d1fae5", padding: "1px 6px", borderRadius: 4 }}>
                {smtpStatus.host}
              </code>{" "}
              as <strong>{smtpStatus.fromEmail || "Anjani Industries"}</strong>
            </span>
          </div>
          <Link
            href="/admin/email"
            style={{ color: "#047857", textDecoration: "underline", fontSize: 12, fontWeight: 600 }}
          >
            Manage SMTP Settings
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-3" style={{ marginBottom: 20 }}>
        <div className="col-md-4">
          <div className="admin-card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                backgroundColor: "#f5f3ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7c3aed",
              }}
            >
              <Mail size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                Total Subscribers
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
                {subscribers.length}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="admin-card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                backgroundColor: "#f0f9ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0284c7",
              }}
            >
              <Globe size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                Countries Represented
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>
                {uniqueCountries.length}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="admin-card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                backgroundColor: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--admin-primary)",
              }}
            >
              <SendHorizontal size={22} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                Email Broadcast Ready
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: smtpStatus.enabled ? "#15803d" : "#b91c1c" }}>
                {smtpStatus.enabled ? "Active & Configured" : "SMTP Disabled"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="admin-card">
        {/* Filters Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1 }}>
            <div style={{ position: "relative", minWidth: 260, maxWidth: 360 }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                className="admin-input"
                style={{ paddingLeft: 40 }}
                placeholder="Search by name, country, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {uniqueCountries.length > 0 && (
              <select
                className="admin-select"
                style={{ width: "auto", minWidth: 160 }}
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <option value="ALL">All Countries ({uniqueCountries.length})</option>
                {uniqueCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
            Showing <strong>{filtered.length}</strong> subscribers
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            <RefreshCw size={24} className="spin-animation" style={{ color: "var(--admin-primary)", marginBottom: 8 }} />
            <div>Loading subscribers from MongoDB...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            No subscribers match your search.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Subscriber Name</th>
                  <th>Country</th>
                  <th>Email Address</th>
                  <th>Phone / WhatsApp</th>
                  <th>Subscribed Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => {
                  const fullName = [sub.firstName, sub.lastName].filter(Boolean).join(" ");
                  const initial = fullName ? fullName[0].toUpperCase() : sub.email ? sub.email[0].toUpperCase() : "N";

                  return (
                    <tr key={sub.id || sub._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              backgroundColor: "#e0e7ff",
                              color: "#4338ca",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 13,
                              flexShrink: 0,
                            }}
                          >
                            {initial}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#0f172a" }}>
                              {fullName || "Newsletter Subscriber"}
                            </div>
                            {sub.firstName || sub.lastName ? (
                              <div style={{ fontSize: 11, color: "#64748b" }}>
                                {sub.firstName && <span>First: {sub.firstName} </span>}
                                {sub.lastName && <span>Last: {sub.lastName}</span>}
                              </div>
                            ) : (
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                (Name not set yet - click Edit)
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        {sub.country ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              backgroundColor: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              padding: "3px 8px",
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#1e293b",
                            }}
                          >
                            <Globe size={13} style={{ color: "#64748b" }} />
                            {sub.country}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: 12 }}>— Not specified</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>
                          {sub.email}
                        </div>
                      </td>
                      <td>
                        {sub.phone ? (
                          <div style={{ fontSize: 13, color: "#475569" }}>{sub.phone}</div>
                        ) : (
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>—</div>
                        )}
                      </td>
                      <td style={{ fontSize: 13, color: "#64748b", whiteSpace: "nowrap" }}>
                        {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          {/* Direct Send Mail to this Subscriber */}
                          <button
                            onClick={() => openSendModal(sub)}
                            className="admin-btn admin-btn-sm"
                            style={{
                              backgroundColor: "#ecfdf5",
                              color: "#059669",
                              border: "1px solid #a7f3d0",
                              gap: 4,
                            }}
                            title={`Send direct email to ${sub.email}`}
                          >
                            <Send size={13} />
                            <span>Mail</span>
                          </button>

                          <button
                            onClick={() => openEditModal(sub)}
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            title="Edit Subscriber (First Name, Last Name, Country, etc.)"
                            style={{ gap: 4 }}
                          >
                            <Edit size={13} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDelete(sub.id || sub._id)}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            title="Delete Subscriber"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          SEND NEWSLETTER EMAIL MODAL
      ========================================================================= */}
      {sendModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => !sendingEmail && setSendModalOpen(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: 780, padding: 0, overflow: "hidden" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 22px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    backgroundColor: "#fee2e2",
                    color: "var(--admin-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Send size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#0f172a" }}>
                    Send Newsletter / Broadcast Email
                  </h3>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    Compose and dispatch branded emails directly to subscribers
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Tabs */}
                <div style={{ display: "flex", backgroundColor: "#e2e8f0", borderRadius: 6, padding: 2 }}>
                  <button
                    onClick={() => setModalTab("compose")}
                    style={{
                      border: "none",
                      backgroundColor: modalTab === "compose" ? "#ffffff" : "transparent",
                      color: modalTab === "compose" ? "#0f172a" : "#64748b",
                      padding: "5px 12px",
                      borderRadius: 5,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Compose
                  </button>
                  <button
                    onClick={() => setModalTab("preview")}
                    style={{
                      border: "none",
                      backgroundColor: modalTab === "preview" ? "#ffffff" : "transparent",
                      color: modalTab === "preview" ? "#0f172a" : "#64748b",
                      padding: "5px 12px",
                      borderRadius: 5,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Eye size={13} />
                    Live Preview
                  </button>
                </div>

                <button
                  onClick={() => !sendingEmail && setSendModalOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4 }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Notification / Alert in Modal */}
            {sendResult && (
              <div
                style={{
                  padding: "12px 20px",
                  backgroundColor: sendResult.type === "success" ? "#ecfdf5" : "#fef2f2",
                  borderBottom: `1px solid ${sendResult.type === "success" ? "#a7f3d0" : "#fecaca"}`,
                  color: sendResult.type === "success" ? "#065f46" : "#991b1b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {sendResult.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{sendResult.message}</span>
                </div>
                <button
                  onClick={() => setSendResult(null)}
                  style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 2 }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Modal Body */}
            <div style={{ padding: 22, maxHeight: "calc(88vh - 140px)", overflowY: "auto" }}>
              {modalTab === "compose" ? (
                <div>
                  {/* Recipient Audience Selection */}
                  <div style={{ marginBottom: 18 }}>
                    <label className="admin-label" style={{ marginBottom: 8 }}>
                      Recipient Audience:
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {singleRecipient ? (
                        <div
                          style={{
                            padding: "8px 14px",
                            backgroundColor: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            borderRadius: 8,
                            color: "#1d4ed8",
                            fontSize: 13,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Mail size={15} />
                          <span>
                            Selected Subscriber: <strong>{singleRecipient.email}</strong>{" "}
                            {singleRecipient.firstName ? `(${singleRecipient.firstName})` : ""}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSingleRecipient(null);
                              setSendRecipientMode("all");
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#1d4ed8",
                              cursor: "pointer",
                              padding: 0,
                              marginLeft: 6,
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <label
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "8px 14px",
                              borderRadius: 8,
                              border: `1px solid ${sendRecipientMode === "all" ? "var(--admin-primary)" : "#cbd5e1"}`,
                              backgroundColor: sendRecipientMode === "all" ? "#fef2f2" : "#ffffff",
                              color: sendRecipientMode === "all" ? "var(--admin-primary)" : "#334155",
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="radio"
                              name="recipientMode"
                              checked={sendRecipientMode === "all"}
                              onChange={() => setSendRecipientMode("all")}
                              style={{ display: "none" }}
                            />
                            <Users size={14} />
                            All Subscribers ({subscribers.length})
                          </label>

                          {(countryFilter !== "ALL" || search) && (
                            <label
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "8px 14px",
                                borderRadius: 8,
                                border: `1px solid ${sendRecipientMode === "filtered" ? "var(--admin-primary)" : "#cbd5e1"}`,
                                backgroundColor: sendRecipientMode === "filtered" ? "#fef2f2" : "#ffffff",
                                color: sendRecipientMode === "filtered" ? "var(--admin-primary)" : "#334155",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="radio"
                                name="recipientMode"
                                checked={sendRecipientMode === "filtered"}
                                onChange={() => setSendRecipientMode("filtered")}
                                style={{ display: "none" }}
                              />
                              <Globe size={14} />
                              Filtered View ({filtered.length})
                            </label>
                          )}

                          <label
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "8px 14px",
                              borderRadius: 8,
                              border: `1px solid ${sendRecipientMode === "test" ? "var(--admin-primary)" : "#cbd5e1"}`,
                              backgroundColor: sendRecipientMode === "test" ? "#fef2f2" : "#ffffff",
                              color: sendRecipientMode === "test" ? "var(--admin-primary)" : "#334155",
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="radio"
                              name="recipientMode"
                              checked={sendRecipientMode === "test"}
                              onChange={() => setSendRecipientMode("test")}
                              style={{ display: "none" }}
                            />
                            <Mail size={14} />
                            Send Test Email Only
                          </label>
                        </>
                      )}
                    </div>

                    {/* Test email input */}
                    {sendRecipientMode === "test" && (
                      <div style={{ marginTop: 10 }}>
                        <input
                          type="email"
                          className="admin-input"
                          placeholder="Enter your personal or test email (e.g. you@example.com)"
                          value={emailForm.testEmail}
                          onChange={(e) => setEmailForm((prev) => ({ ...prev, testEmail: e.target.value }))}
                          style={{ maxWidth: 420 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Pre-made Templates Dropdown / Buttons */}
                  <div style={{ marginBottom: 18, backgroundColor: "#f8fafc", padding: "12px 14px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}>
                      <Sparkles size={14} style={{ color: "var(--admin-primary)" }} />
                      <span>Quick Load Email Template:</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {TEMPLATES.map((tpl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => applyTemplate(tpl)}
                          className="admin-btn admin-btn-sm admin-btn-secondary"
                          style={{ fontSize: 12, backgroundColor: "#ffffff" }}
                        >
                          {tpl.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email Subject Line */}
                  <div style={{ marginBottom: 14 }}>
                    <label className="admin-label">Subject Line *</label>
                    <input
                      type="text"
                      required
                      className="admin-input"
                      placeholder="e.g. Discover Anjani Industries' Latest Dyeing Machine Innovations"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm((prev) => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>

                  {/* Email Banner Heading */}
                  <div style={{ marginBottom: 14 }}>
                    <label className="admin-label">
                      Email Banner Heading (Inside Email) <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>(Optional - leave blank if not needed)</span>
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Engineering the Future of Textile Processing"
                      value={emailForm.heading}
                      onChange={(e) => setEmailForm((prev) => ({ ...prev, heading: e.target.value }))}
                    />
                  </div>

                  {/* Message Body */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label className="admin-label" style={{ margin: 0 }}>
                        Message Body *
                      </label>
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        Variables: <code>{"{subscriberName}"}</code>, <code>{"{companyName}"}</code>, <code>{"{date}"}</code>
                      </span>
                    </div>
                    <textarea
                      required
                      rows={6}
                      className="admin-textarea"
                      placeholder="Type your newsletter message here... Use blank lines to create paragraphs."
                      value={emailForm.message}
                      onChange={(e) => setEmailForm((prev) => ({ ...prev, message: e.target.value }))}
                      style={{ fontFamily: "inherit", fontSize: 13.5, lineHeight: 1.6 }}
                    />
                  </div>

                  {/* Call to Action Button */}
                  <div className="row g-3" style={{ marginBottom: 10 }}>
                    <div className="col-md-5">
                      <label className="admin-label">CTA Button Label</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Explore Machinery Catalog"
                        value={emailForm.ctaText}
                        onChange={(e) => setEmailForm((prev) => ({ ...prev, ctaText: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-7">
                      <label className="admin-label">CTA Target URL</label>
                      <input
                        type="url"
                        className="admin-input"
                        placeholder="https://www.anjaniindustries.in/products"
                        value={emailForm.ctaUrl}
                        onChange={(e) => setEmailForm((prev) => ({ ...prev, ctaUrl: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* LIVE EMAIL PREVIEW TAB */
                <div>
                  <div
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 10,
                      overflow: "hidden",
                      backgroundColor: "#f1f5f9",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    }}
                  >
                    {/* Fake Email Client Header */}
                    <div style={{ backgroundColor: "#ffffff", padding: "12px 18px", borderBottom: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                        {emailForm.subject || "(No subject)"}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        <strong>From:</strong> &quot;{smtpStatus.fromEmail ? "Anjani Industries" : "Anjani Industries"}&quot; &lt;{smtpStatus.fromEmail || "contact@anjaniindustries.in"}&gt;
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        <strong>To:</strong>{" "}
                        {sendRecipientMode === "single" && singleRecipient
                          ? singleRecipient.email
                          : sendRecipientMode === "test"
                          ? emailForm.testEmail || "test@example.com"
                          : `Newsletter Subscribers (${subscribers.length} recipients)`}
                      </div>
                    </div>

                    {/* Rich Exhibitor Machinery Catalog Template Preview */}
                    <div style={{ maxHeight: 680, overflowY: "auto" }}>
                      <ExhibitorEmailPreview
                        heading={emailForm.heading}
                        body={emailForm.message}
                        ctaText={emailForm.ctaText}
                        ctaUrl={emailForm.ctaUrl}
                        recipient={
                          singleRecipient
                            ? {
                                firstName: singleRecipient.firstName || (singleRecipient.name ? singleRecipient.name.split(" ")[0] : "Valued"),
                                lastName: singleRecipient.lastName || (singleRecipient.name ? singleRecipient.name.split(" ").slice(1).join(" ") : "Subscriber"),
                                email: singleRecipient.email,
                                country: singleRecipient.country || "India",
                              }
                            : null
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "14px 22px",
                borderTop: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {modalTab === "compose" && (
                  <button
                    type="button"
                    onClick={() => handleSendEmail(true)}
                    disabled={sendingEmail}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    title="Send a sample email to verify before broadcasting"
                  >
                    <Mail size={13} />
                    <span>Send Test Email</span>
                  </button>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setSendModalOpen(false)}
                  disabled={sendingEmail}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleSendEmail(false)}
                  disabled={sendingEmail}
                  className="admin-btn admin-btn-primary"
                  style={{ gap: 8 }}
                >
                  {sendingEmail ? (
                    <>
                      <RefreshCw size={15} className="spin-animation" />
                      <span>Dispatching Newsletter...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>
                        {sendRecipientMode === "single"
                          ? `Send to ${singleRecipient?.email}`
                          : sendRecipientMode === "test"
                          ? "Send Test Mail"
                          : sendRecipientMode === "filtered"
                          ? `Broadcast to ${filtered.length} Filtered`
                          : `Broadcast to All (${subscribers.length})`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subscriber Modal */}
      {editingSub && (
        <div className="admin-modal-backdrop" onClick={() => setEditingSub(null)}>
          <div className="admin-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Edit size={18} style={{ color: "var(--admin-primary)" }} />
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#0f172a" }}>
                  Edit Newsletter Subscriber
                </h2>
              </div>
              <button
                onClick={() => setEditingSub(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "10px 14px",
                  borderRadius: 6,
                  marginBottom: 16,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: 12, color: "#475569" }}>
                  ✨ <strong>Admin Exclusive Fields:</strong> Update the subscriber’s First Name, Last Name, and Country below.
                </div>
              </div>

              <div className="row g-3" style={{ marginBottom: 14 }}>
                <div className="col-md-6">
                  <label className="admin-label">First Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Ramesh"
                    value={form.firstName}
                    onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Last Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Patel"
                    value={form.lastName}
                    onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="row g-3" style={{ marginBottom: 14 }}>
                <div className="col-md-6">
                  <label className="admin-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="admin-input"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Country</label>
                  <input
                    type="text"
                    list="country-list"
                    className="admin-input"
                    placeholder="e.g. India, USA, Turkey..."
                    value={form.country}
                    onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                  />
                  <datalist id="country-list">
                    <option value="India" />
                    <option value="United States" />
                    <option value="United Kingdom" />
                    <option value="Bangladesh" />
                    <option value="United Arab Emirates" />
                    <option value="Turkey" />
                    <option value="Germany" />
                    <option value="Italy" />
                    <option value="China" />
                    <option value="Vietnam" />
                    <option value="Indonesia" />
                    <option value="Egypt" />
                    <option value="Brazil" />
                    <option value="Saudi Arabia" />
                  </datalist>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="admin-label">Phone / WhatsApp</label>
                <input
                  type="tel"
                  className="admin-input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="admin-label">Admin Notes</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  placeholder="Internal notes about this subscriber..."
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: 14,
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn-primary"
                  style={{ gap: 6 }}
                >
                  <Save size={16} />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {isAdding && (
        <div className="admin-modal-backdrop" onClick={() => setIsAdding(false)}>
          <div className="admin-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <UserPlus size={18} style={{ color: "var(--admin-primary)" }} />
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#0f172a" }}>
                  Add Newsletter Subscriber
                </h2>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber}>
              <div className="row g-3" style={{ marginBottom: 14 }}>
                <div className="col-md-6">
                  <label className="admin-label">First Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Anand"
                    value={form.firstName}
                    onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Last Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Mehta"
                    value={form.lastName}
                    onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="row g-3" style={{ marginBottom: 14 }}>
                <div className="col-md-6">
                  <label className="admin-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="admin-input"
                    placeholder="subscriber@example.com"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Country</label>
                  <input
                    type="text"
                    list="country-list"
                    className="admin-input"
                    placeholder="e.g. India"
                    value={form.country}
                    onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="admin-label">Phone / WhatsApp</label>
                <input
                  type="tel"
                  className="admin-input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="admin-label">Admin Notes</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  placeholder="Notes about subscriber..."
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: 14,
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn-primary"
                  style={{ gap: 6 }}
                >
                  <UserPlus size={16} />
                  <span>{saving ? "Adding..." : "Add Subscriber"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
