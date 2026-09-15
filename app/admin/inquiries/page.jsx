"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquareQuote,
  Search,
  Trash2,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  X,
  Copy,
  Check,
  Users,
} from "lucide-react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL | Inquiry | Newsletter
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [copiedEmails, setCopiedEmails] = useState(false);

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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === id || inq._id === id ? { ...inq, status: newStatus } : inq
          )
        );
        if (selectedInquiry && (selectedInquiry.id === id || selectedInquiry._id === id)) {
          setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

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

  const filtered = inquiries.filter((inq) => {
    const matchesStatus =
      statusFilter === "ALL" || inq.status === statusFilter;
    const matchesType =
      typeFilter === "ALL"
        ? true
        : typeFilter === "Newsletter"
        ? inq.type === "Newsletter"
        : inq.type !== "Newsletter";
    const matchesSearch =
      inq.name?.toLowerCase().includes(search.toLowerCase()) ||
      inq.email?.toLowerCase().includes(search.toLowerCase()) ||
      inq.phone?.includes(search) ||
      inq.subject?.toLowerCase().includes(search.toLowerCase()) ||
      inq.message?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
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
            Monitor contact form submissions, machinery quote requests, and newsletter subscriptions.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
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
                  <span>Copy Newsletter Emails ({newsletterSubscribers.length})</span>
                </>
              )}
            </button>
          )}

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
        {/* Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <div style={{ position: "relative", width: 320 }}>
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
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Status:</span>
            {["ALL", "New", "Contacted", "Resolved"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`admin-btn admin-btn-sm ${
                  statusFilter === st ? "admin-btn-primary" : "admin-btn-secondary"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            Loading entries from MongoDB...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            No inquiries match your current filter.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Contact Name</th>
                  <th>Email &amp; Phone</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => {
                  const isNewsletter = inq.type === "Newsletter";
                  return (
                    <tr key={inq.id || inq._id}>
                      <td>
                        {isNewsletter ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              backgroundColor: "#faf5ff",
                              color: "#7e22ce",
                              border: "1px solid #e9d5ff",
                              borderRadius: 12,
                              padding: "2px 8px",
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                            }}
                          >
                            <Mail size={11} />
                            Newsletter
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              backgroundColor: "#f0f9ff",
                              color: "#0369a1",
                              border: "1px solid #bae6fd",
                              borderRadius: 12,
                              padding: "2px 8px",
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                            }}
                          >
                            <MessageSquareQuote size={11} />
                            Inquiry
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: 13, color: "#64748b", whiteSpace: "nowrap" }}>
                        {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>
                          {inq.name || (isNewsletter ? "Newsletter Subscriber" : "Valued Customer")}
                        </div>
                        {inq.productTitle && (
                          <div style={{ fontSize: 11, color: "var(--admin-primary)", fontWeight: 500 }}>
                            For: {inq.productTitle}
                          </div>
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
                      <td>
                        <div
                          style={{
                            fontSize: 13,
                            maxWidth: 220,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: isNewsletter ? "#7e22ce" : "inherit",
                          }}
                        >
                          {inq.subject}
                        </div>
                      </td>
                      <td>
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id || inq._id, e.target.value)}
                          className="admin-select"
                          style={{
                            padding: "4px 8px",
                            fontSize: 12,
                            width: "auto",
                            fontWeight: 600,
                            borderRadius: 6,
                            borderColor:
                              inq.status === "New"
                                ? "#93c5fd"
                                : inq.status === "Contacted"
                                ? "#fde68a"
                                : "#86efac",
                          }}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="View Details"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleDelete(inq.id || inq._id)}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            title="Delete Entry"
                          >
                            <Trash2 size={14} />
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

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedInquiry(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#0f172a" }}>
                  {selectedInquiry.type === "Newsletter"
                    ? "Newsletter Subscriber Details"
                    : "Customer Inquiry Details"}
                </h2>
                {selectedInquiry.type === "Newsletter" ? (
                  <span
                    style={{
                      backgroundColor: "#faf5ff",
                      color: "#7e22ce",
                      border: "1px solid #e9d5ff",
                      borderRadius: 12,
                      padding: "2px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Newsletter
                  </span>
                ) : (
                  <span
                    style={{
                      backgroundColor: "#f0f9ff",
                      color: "#0369a1",
                      border: "1px solid #bae6fd",
                      borderRadius: 12,
                      padding: "2px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Direct Inquiry
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 16, backgroundColor: "#f8fafc", padding: 14, borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                  {selectedInquiry.name}
                </span>
                <span
                  className={`badge-status ${
                    selectedInquiry.status === "New"
                      ? "badge-new"
                      : selectedInquiry.status === "Contacted"
                      ? "badge-contacted"
                      : "badge-resolved"
                  }`}
                >
                  {selectedInquiry.status}
                </span>
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

            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">Subject</label>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                {selectedInquiry.subject}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="admin-label">
                {selectedInquiry.type === "Newsletter"
                  ? "Subscription Summary"
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
                {selectedInquiry.message}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 14,
                borderTop: "1px solid #e2e8f0",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Update Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id || selectedInquiry._id, e.target.value)}
                  className="admin-select"
                  style={{ width: "auto", padding: "4px 8px", fontSize: 13 }}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
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
                    className="admin-btn admin-btn-primary admin-btn-sm"
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
