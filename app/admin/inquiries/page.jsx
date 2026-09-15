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
} from "lucide-react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

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

  const filtered = inquiries.filter((inq) => {
    const matchesStatus =
      statusFilter === "ALL" || inq.status === statusFilter;
    const matchesSearch =
      inq.name?.toLowerCase().includes(search.toLowerCase()) ||
      inq.email?.toLowerCase().includes(search.toLowerCase()) ||
      inq.phone?.includes(search) ||
      inq.subject?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
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
            Customer Inquiries & Leads ({inquiries.length})
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Leads received from contact form and product technical offer requests.
          </p>
        </div>

        <button onClick={fetchInquiries} className="admin-btn admin-btn-secondary">
          <RefreshCw size={16} />
          <span>Refresh</span>
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

          <div style={{ display: "flex", gap: 8 }}>
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
            Loading inquiries from MongoDB...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            No inquiries match your filter.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Contact Info</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => (
                  <tr key={inq.id || inq._id}>
                    <td style={{ fontSize: 13, color: "#64748b", whiteSpace: "nowrap" }}>
                      {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inq.name}</div>
                      {inq.productTitle && (
                        <div style={{ fontSize: 11, color: "var(--admin-primary)", fontWeight: 500 }}>
                          For: {inq.productTitle}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>{inq.phone}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{inq.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                          title="Delete Lead"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#0f172a" }}>
                Inquiry Details
              </h2>
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
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  style={{ display: "flex", alignItems: "center", gap: 6, color: "inherit", textDecoration: "none" }}
                >
                  <Phone size={14} />
                  <span>{selectedInquiry.phone}</span>
                </a>
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
              <label className="admin-label">Message / Technical Requirement</label>
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

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #e2e8f0" }}>
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

              <a
                href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-primary admin-btn-sm"
              >
                Reply on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
