"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquareQuote,
  Search,
  Trash2,
  Eye,
  Edit,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  X,
  Copy,
  Check,
  Users,
  Globe,
  UserPlus,
  Save,
  Download,
} from "lucide-react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL | Inquiry | Newsletter
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Edit State
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [isAddingSubscriber, setIsAddingSubscriber] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    country: "",
    email: "",
    phone: "",
    message: "",
    type: "Newsletter",
  });
  const [newSubForm, setNewSubForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    email: "",
    phone: "",
    message: "",
  });

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Fetch inquiries error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id && inq._id !== id));
        if (selectedInquiry && (selectedInquiry.id === id || selectedInquiry._id === id)) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const openEditModal = (inq) => {
    let fn = inq.firstName || "";
    let ln = inq.lastName || "";
    if (!fn && !ln && inq.name && inq.name !== "Newsletter Subscriber" && inq.name !== "Valued Customer") {
      const parts = inq.name.trim().split(" ");
      fn = parts[0] || "";
      ln = parts.slice(1).join(" ") || "";
    }

    setEditForm({
      id: inq.id || inq._id,
      firstName: fn,
      lastName: ln,
      country: inq.country || "",
      email: inq.email || "",
      phone: inq.phone || "",
      message: inq.message || "",
      type: inq.type || "Inquiry",
    });
    setEditingInquiry(inq);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.email || !editForm.email.trim()) {
      alert("Email is required");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/inquiries/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editForm.firstName.trim(),
          lastName: editForm.lastName.trim(),
          country: editForm.country.trim(),
          email: editForm.email.trim(),
          phone: editForm.phone.trim(),
          message: editForm.message.trim(),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === editForm.id || item._id === editForm.id
              ? { ...item, ...updated }
              : item
          )
        );
        if (selectedInquiry && (selectedInquiry.id === editForm.id || selectedInquiry._id === editForm.id)) {
          setSelectedInquiry((prev) => ({ ...prev, ...updated }));
        }
        setEditingInquiry(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update record");
      }
    } catch (err) {
      console.error("Save edit error:", err);
      alert("Failed to save changes.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    if (!newSubForm.email || !newSubForm.email.trim()) {
      alert("Email is required");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newSubForm.firstName.trim(),
          lastName: newSubForm.lastName.trim(),
          country: newSubForm.country.trim(),
          email: newSubForm.email.trim(),
          phone: newSubForm.phone.trim(),
          message: newSubForm.message.trim() || "Manually added by Admin",
          type: "Newsletter",
          subject: "Newsletter Subscription",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.inquiry) {
          setInquiries((prev) => [data.inquiry, ...prev]);
        } else {
          fetchInquiries();
        }
        setIsAddingSubscriber(false);
        setNewSubForm({
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
      console.error("Add subscriber error:", err);
      alert("Failed to add subscriber");
    } finally {
      setSavingEdit(false);
    }
  };

  const newsletterSubscribers = inquiries.filter(
    (inq) => inq.type === "Newsletter"
  );
  const directInquiries = inquiries.filter((inq) => inq.type !== "Newsletter");

  const handleCopyNewsletterEmails = () => {
    const emails = Array.from(
      new Set(newsletterSubscribers.map((inq) => inq.email).filter(Boolean))
    );
    if (emails.length === 0) return;
    navigator.clipboard.writeText(emails.join(", "));
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2500);
  };

  const handleExportCSV = () => {
    const list = typeFilter === "Newsletter" ? newsletterSubscribers : filtered;
    if (list.length === 0) {
      alert("No records to export.");
      return;
    }

    const headers = ["Date", "First Name", "Last Name", "Country", "Email", "Phone", "Notes / Message"];
    const rows = list.map((item) => [
      new Date(item.createdAt).toLocaleDateString("en-IN"),
      item.firstName || "",
      item.lastName || "",
      item.country || "",
      item.email || "",
      item.phone || "",
      (item.message || "").replace(/\n/g, " "),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `anjani_${typeFilter.toLowerCase()}_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = inquiries.filter((inq) => {
    const matchesType =
      typeFilter === "ALL"
        ? true
        : typeFilter === "Newsletter"
        ? inq.type === "Newsletter"
        : inq.type !== "Newsletter";
    const matchesSearch =
      inq.name?.toLowerCase().includes(search.toLowerCase()) ||
      inq.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      inq.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      inq.country?.toLowerCase().includes(search.toLowerCase()) ||
      inq.email?.toLowerCase().includes(search.toLowerCase()) ||
      inq.phone?.includes(search) ||
      inq.message?.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div>
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
            Customer Inquiries &amp; Newsletter Leads ({inquiries.length})
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Monitor and manage contact inquiries and newsletter subscribers with First Name, Last Name, and Country editing.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setIsAddingSubscriber(true)}
            className="admin-btn admin-btn-primary"
            title="Manually add a new newsletter subscriber"
            style={{ gap: 6 }}
          >
            <UserPlus size={16} />
            <span>+ Add Subscriber</span>
          </button>

          {newsletterSubscribers.length > 0 && (
            <button
              onClick={handleCopyNewsletterEmails}
              className="admin-btn admin-btn-secondary"
              title="Copy all subscriber emails formatted for email marketing"
              style={{ gap: 6, borderColor: "#cbd5e1" }}
            >
              {copiedEmails ? (
                <>
                  <Check size={16} style={{ color: "#16a34a" }} />
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>
                    Copied {newsletterSubscribers.length} Emails!
                  </span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Emails ({newsletterSubscribers.length})</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="admin-btn admin-btn-secondary"
            title="Export filtered records to CSV"
            style={{ gap: 6, borderColor: "#cbd5e1" }}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button onClick={fetchInquiries} className="admin-btn admin-btn-secondary">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Top Type Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => setTypeFilter("ALL")}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            border: typeFilter === "ALL" ? "2px solid #cb0000" : "1px solid #e2e8f0",
            backgroundColor: typeFilter === "ALL" ? "#fef2f2" : "#ffffff",
            color: typeFilter === "ALL" ? "#cb0000" : "#475569",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Users size={16} />
          <span>All Leads ({inquiries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTypeFilter("Inquiry")}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            border: typeFilter === "Inquiry" ? "2px solid #0284c7" : "1px solid #e2e8f0",
            backgroundColor: typeFilter === "Inquiry" ? "#f0f9ff" : "#ffffff",
            color: typeFilter === "Inquiry" ? "#0284c7" : "#475569",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <MessageSquareQuote size={16} />
          <span>Direct Inquiries ({directInquiries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTypeFilter("Newsletter")}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            border: typeFilter === "Newsletter" ? "2px solid #9333ea" : "1px solid #e2e8f0",
            backgroundColor: typeFilter === "Newsletter" ? "#faf5ff" : "#ffffff",
            color: typeFilter === "Newsletter" ? "#9333ea" : "#475569",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Mail size={16} />
          <span>Newsletter Subscribers ({newsletterSubscribers.length})</span>
        </button>
      </div>

      <div className="admin-card">
        {/* Search Bar */}
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
          <div style={{ position: "relative", width: 360, maxWidth: "100%" }}>
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
              placeholder="Search by name, country, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
            Showing <strong>{filtered.length}</strong> records
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            Loading entries from MongoDB...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            No entries match your search.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subscriber / Contact Name</th>
                  <th>Country</th>
                  <th>Email &amp; Phone</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => {
                  const isNewsletter = inq.type === "Newsletter";
                  const displayName = [inq.firstName, inq.lastName].filter(Boolean).join(" ") || inq.name || (isNewsletter ? "Newsletter Subscriber" : "Valued Customer");
                  return (
                    <tr key={inq.id || inq._id}>
                      <td style={{ fontSize: 13, color: "#64748b", whiteSpace: "nowrap" }}>
                        {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>
                          {displayName}
                        </div>
                        {inq.productTitle && (
                          <div style={{ fontSize: 11, color: "var(--admin-primary)", fontWeight: 500 }}>
                            For: {inq.productTitle}
                          </div>
                        )}
                      </td>
                      <td>
                        {inq.country ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              backgroundColor: "#f8fafc",
                              border: "1px solid #e2e8f0",
                              padding: "2px 8px",
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#1e293b",
                            }}
                          >
                            <Globe size={12} style={{ color: "#64748b" }} />
                            {inq.country}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: 12 }}>— Not set</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>
                          {inq.email}
                        </div>
                        {inq.phone ? (
                          <div style={{ fontSize: 12, color: "#64748b" }}>{inq.phone}</div>
                        ) : (
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>—</div>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            onClick={() => openEditModal(inq)}
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            title="Edit Subscriber (First Name, Last Name, Country, etc.)"
                            style={{ gap: 4 }}
                          >
                            <Edit size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="View Details"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(inq.id || inq._id)}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            title="Delete Entry"
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

      {/* Edit Subscriber / Inquiry Modal */}
      {editingInquiry && (
        <div className="admin-modal-backdrop" onClick={() => setEditingInquiry(null)}>
          <div className="admin-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Edit size={18} style={{ color: "var(--admin-primary)" }} />
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#0f172a" }}>
                  {editingInquiry.type === "Newsletter" ? "Edit Newsletter Subscriber" : "Edit Customer Lead"}
                </h2>
              </div>
              <button
                onClick={() => setEditingInquiry(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ backgroundColor: "#f8fafc", padding: "10px 14px", borderRadius: 6, marginBottom: 16, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  💡 <strong>Admin Edit Controls:</strong> Update First Name, Last Name, Country, and contact details below.
                </div>
              </div>

              <div className="row g-3" style={{ marginBottom: 14 }}>
                <div className="col-md-6">
                  <label className="admin-label">First Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Rajesh"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Last Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Patel"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, lastName: e.target.value }))}
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
                    value={editForm.email}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Country</label>
                  <input
                    type="text"
                    list="country-suggestions"
                    className="admin-input"
                    placeholder="e.g. India, USA, Turkey..."
                    value={editForm.country}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, country: e.target.value }))}
                  />
                  <datalist id="country-suggestions">
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
                  value={editForm.phone}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="admin-label">Internal Notes / Message</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="Notes about this subscriber or lead..."
                  value={editForm.message}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid #e2e8f0", paddingTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setEditingInquiry(null)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="admin-btn admin-btn-primary"
                  style={{ gap: 6 }}
                >
                  <Save size={16} />
                  <span>{savingEdit ? "Saving..." : "Save Details"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Subscriber Modal */}
      {isAddingSubscriber && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddingSubscriber(false)}>
          <div className="admin-modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <UserPlus size={18} style={{ color: "var(--admin-primary)" }} />
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#0f172a" }}>
                  Add New Newsletter Subscriber
                </h2>
              </div>
              <button
                onClick={() => setIsAddingSubscriber(false)}
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
                    placeholder="e.g. Ramesh"
                    value={newSubForm.firstName}
                    onChange={(e) => setNewSubForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Last Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Shah"
                    value={newSubForm.lastName}
                    onChange={(e) => setNewSubForm((prev) => ({ ...prev, lastName: e.target.value }))}
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
                    value={newSubForm.email}
                    onChange={(e) => setNewSubForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="admin-label">Country</label>
                  <input
                    type="text"
                    list="country-suggestions"
                    className="admin-input"
                    placeholder="e.g. India"
                    value={newSubForm.country}
                    onChange={(e) => setNewSubForm((prev) => ({ ...prev, country: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="admin-label">Phone / WhatsApp</label>
                <input
                  type="tel"
                  className="admin-input"
                  placeholder="+91 98765 43210"
                  value={newSubForm.phone}
                  onChange={(e) => setNewSubForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="admin-label">Internal Notes</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  placeholder="Notes about subscriber source, company name, etc."
                  value={newSubForm.message}
                  onChange={(e) => setNewSubForm((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid #e2e8f0", paddingTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setIsAddingSubscriber(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="admin-btn admin-btn-primary"
                  style={{ gap: 6 }}
                >
                  <UserPlus size={16} />
                  <span>{savingEdit ? "Adding..." : "Add Subscriber"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedInquiry(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#0f172a" }}>
                {selectedInquiry.type === "Newsletter"
                  ? "Newsletter Subscriber Details"
                  : "Customer Inquiry Details"}
              </h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 16, backgroundColor: "#f8fafc", padding: 14, borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                    {[selectedInquiry.firstName, selectedInquiry.lastName].filter(Boolean).join(" ") || selectedInquiry.name}
                  </span>
                  {selectedInquiry.country && (
                    <span style={{ marginLeft: 8, fontSize: 12, backgroundColor: "#e2e8f0", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>
                      🌍 {selectedInquiry.country}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 13, color: "#475569" }}>
                {selectedInquiry.phone && (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    style={{ display: "flex", alignItems: "center", gap: 6, color: "inherit", textDecoration: "none" }}
                  >
                    <Phone size={14} />
                    <span>{selectedInquiry.phone}</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  style={{ display: "flex", alignItems: "center", gap: 6, color: "inherit", textDecoration: "none" }}
                >
                  <Mail size={14} />
                  <span>{selectedInquiry.email}</span>
                </a>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={14} />
                  <span>{new Date(selectedInquiry.createdAt).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="admin-label">
                {selectedInquiry.type === "Newsletter"
                  ? "Subscription Summary / Notes"
                  : "Message / Technical Requirement"}
              </label>
              <div
                style={{
                  padding: 14,
                  backgroundColor: "#f1f5f9",
                  borderRadius: 8,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#1e293b",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedInquiry.message || "—"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingTop: 14,
                borderTop: "1px solid #e2e8f0",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    const inq = selectedInquiry;
                    setSelectedInquiry(null);
                    openEditModal(inq);
                  }}
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  style={{ gap: 4 }}
                >
                  <Edit size={14} />
                  <span>Edit Details</span>
                </button>

                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                >
                  <Mail size={14} />
                  <span>Send Email</span>
                </a>

                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                  >
                    Reply on WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
