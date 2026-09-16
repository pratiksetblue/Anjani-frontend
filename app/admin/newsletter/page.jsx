"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Search,
  Trash2,
  Edit,
  RefreshCw,
  Calendar,
  X,
  Copy,
  Check,
  Globe,
  UserPlus,
  Save,
  Download,
  Users,
} from "lucide-react";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [copiedEmails, setCopiedEmails] = useState(false);

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

  useEffect(() => {
    fetchSubscribers();
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

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `anjani_newsletter_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0", color: "#0f172a" }}>
            Newsletter Leads &amp; Subscribers ({subscribers.length})
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Manage newsletter subscribers with First Name, Last Name, and Country editing.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
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
            className="admin-btn admin-btn-primary"
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
                  <span>Copy Emails ({subscribers.length})</span>
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

          <button onClick={fetchSubscribers} className="admin-btn admin-btn-secondary">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3" style={{ marginBottom: 20 }}>
        <div className="col-md-6">
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

        <div className="col-md-6">
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
            Loading subscribers from MongoDB...
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

      {/* Edit Subscriber Modal */}
      {editingSub && (
        <div className="admin-modal-backdrop" onClick={() => setEditingSub(null)}>
          <div className="admin-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
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
              <div style={{ backgroundColor: "#f8fafc", padding: "10px 14px", borderRadius: 6, marginBottom: 16, border: "1px solid #e2e8f0" }}>
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

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid #e2e8f0", paddingTop: 14 }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
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

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid #e2e8f0", paddingTop: 14 }}>
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
