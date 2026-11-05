"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Plus,
  Send,
  Edit2,
  Trash2,
  Mail,
  Phone,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Check,
  CheckSquare,
  Square,
} from "lucide-react";
import ExhibitorEmailPreview from "@/components/admin/ExhibitorEmailPreview";

export default function AdminExhibitorsPage() {
  const [exhibitors, setExhibitors] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [alert, setAlert] = useState({ text: "", type: "" });

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExhibitor, setEditingExhibitor] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form for Add/Edit (firstName, lastName, companyName, country, email, phone)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    email: "",
    phone: "",
  });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Send Email Modal state
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [emailTargetMode, setEmailTargetMode] = useState("single"); // 'single' | 'selected' | 'all'
  const [singleRecipient, setSingleRecipient] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [modalTab, setModalTab] = useState("compose"); // 'compose' | 'preview'
  const [emailForm, setEmailForm] = useState({
    subject: "Official Communication & Textile Machinery Solutions from Anjani Industries",
    heading: "",
    body: "Dear {fullName},\n\nWe are pleased to connect with you regarding our advanced textile dyeing and processing machinery solutions. Anjani Industries is one of India's leading manufacturers of textile dyeing and processing machinery, backed by over 36 years of engineering excellence.\n\nShould you need any technical documentation, capacity specifications, or customized machinery quotation, our engineering team is here to assist you.",
    ctaText: "REQUEST A QUOTE",
    ctaUrl: "https://www.anjaniindustries.in/contact-us",
    stat1Value: "36+",
    stat1Label: "Years of Industry Excellence",
    stat2Value: "45K",
    stat2Label: "Sq Ft Production Facility",
    stat3Value: "270",
    stat3Label: "Pcs Annual Production Capacity",
    showStats: true,
    showProducts: true,
  });

  // Fetch exhibitors from API
  const fetchExhibitors = useCallback(
    async (pageToLoad = pagination.page, limitToLoad = pagination.limit, query = search) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(pageToLoad),
          limit: String(limitToLoad),
        });
        if (query && query.trim()) {
          params.append("search", query.trim());
        }

        const res = await fetch(`/api/exhibitors?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load exhibitors");
        const data = await res.json();

        setExhibitors(data.exhibitors || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error("Fetch exhibitors error:", err);
        setAlert({ text: err.message || "Failed to load exhibitors", type: "error" });
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit, search]
  );

  useEffect(() => {
    fetchExhibitors(pagination.page, pagination.limit, search);
  }, [fetchExhibitors, pagination.page, pagination.limit, search]);

  // Load exhibitor email template and branding info from email settings
  useEffect(() => {
    async function loadTemplateSettings() {
      try {
        const res = await fetch("/api/email-settings");
        if (res.ok) {
          const data = await res.json();
          const ext = data?.exhibitorTemplate || {};
          setEmailForm((prev) => ({
            ...prev,
            subject: ext.subject || prev.subject,
            heading: ext.heading !== undefined ? ext.heading : prev.heading,
            body: ext.body || prev.body,
            ctaText: ext.ctaText || prev.ctaText,
            ctaUrl: ext.ctaUrl || prev.ctaUrl,
            stat1Value: ext.stat1Value || prev.stat1Value,
            stat1Label: ext.stat1Label || prev.stat1Label,
            stat2Value: ext.stat2Value || prev.stat2Value,
            stat2Label: ext.stat2Label || prev.stat2Label,
            stat3Value: ext.stat3Value || prev.stat3Value,
            stat3Label: ext.stat3Label || prev.stat3Label,
            showStats: ext.showStats !== undefined ? ext.showStats : prev.showStats,
            showProducts: ext.showProducts !== undefined ? ext.showProducts : prev.showProducts,
          }));
        }
      } catch (e) {
        console.warn("Could not load email settings", e);
      }
    }
    loadTemplateSettings();
  }, []);

  // Handle live search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setForm({
      firstName: "",
      lastName: "",
      companyName: "",
      country: "",
      email: "",
      phone: "",
    });
    setEditingExhibitor(null);
    setIsAddOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingExhibitor(item);
    setForm({
      firstName: item.firstName || "",
      lastName: item.lastName || "",
      companyName: item.companyName || "",
      country: item.country || "",
      email: item.email || "",
      phone: item.phone || "",
    });
    setIsAddOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
      setAlert({ text: "Please fill in all fields (First Name, Last Name, Email, Phone).", type: "error" });
      return;
    }

    setSaving(true);
    setAlert({ text: "", type: "" });

    try {
      const isEdit = Boolean(editingExhibitor);
      const url = isEdit
        ? `/api/exhibitors/${editingExhibitor.id || editingExhibitor._id}`
        : "/api/exhibitors";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save exhibitor");

      let successMsg = "Exhibitor updated successfully!";
      if (!isEdit) {
        if (data.mailStatus?.sent > 0) {
          successMsg = `✓ Exhibitor added successfully & welcome email sent to ${form.email}!`;
        } else if (data.mailStatus?.errors?.length > 0) {
          successMsg = `✓ Exhibitor added successfully. (Email note: ${data.mailStatus.errors[0]})`;
        } else {
          successMsg = `✓ Exhibitor added successfully and welcome email sent!`;
        }
      }

      setAlert({
        text: successMsg,
        type: "success",
      });
      setIsAddOpen(false);
      setEditingExhibitor(null);
      fetchExhibitors(pagination.page, pagination.limit, search);
    } catch (err) {
      setAlert({ text: err.message || "Error saving exhibitor", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/exhibitors/${deleteTarget.id || deleteTarget._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete exhibitor");

      setAlert({ text: "Exhibitor deleted successfully.", type: "success" });
      setDeleteTarget(null);
      setSelectedIds((prev) => prev.filter((id) => id !== (deleteTarget.id || deleteTarget._id)));
      fetchExhibitors(pagination.page, pagination.limit, search);
    } catch (err) {
      setAlert({ text: err.message || "Error deleting exhibitor", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  // Checkbox selection
  const handleToggleSelectAll = () => {
    const currentPageIds = exhibitors.map((e) => e.id || e._id);
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open Send Email Modal for a single exhibitor
  const handleOpenSingleEmail = (exhibitor) => {
    setSingleRecipient(exhibitor);
    setEmailTargetMode("single");
    setModalTab("compose");
    setSendModalOpen(true);
  };

  // Open Send Email Modal for selected exhibitors
  const handleOpenSelectedEmail = () => {
    setEmailTargetMode("selected");
    setSingleRecipient(null);
    setModalTab("compose");
    setSendModalOpen(true);
  };

  // Send Email Action
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSendingEmail(true);

    try {
      let recipients = [];
      if (emailTargetMode === "single" && singleRecipient) {
        recipients = [singleRecipient];
      } else if (emailTargetMode === "selected") {
        recipients = exhibitors.filter((e) => selectedIds.includes(e.id || e._id));
      }

      if (recipients.length === 0) {
        throw new Error("No recipients selected to receive email.");
      }

      const res = await fetch("/api/exhibitors/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          customSubject: emailForm.subject,
          customHeading: emailForm.heading,
          customBody: emailForm.body,
          customCtaText: emailForm.ctaText,
          customCtaUrl: emailForm.ctaUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch email");
      }

      setAlert({
        text: `✓ Success! Sent ${data.sent} email(s) successfully (${data.failed} failed).`,
        type: "success",
      });
      setSendModalOpen(false);
    } catch (err) {
      setAlert({ text: err.message || "Failed to send email", type: "error" });
    } finally {
      setSendingEmail(false);
    }
  };

  // Insert variable into email body
  const insertVariable = (varName) => {
    setEmailForm((prev) => ({
      ...prev,
      body: (prev.body || "") + ` {${varName}}`,
    }));
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!exhibitors || exhibitors.length === 0) return;
    const headers = ["First Name", "Last Name", "Company Name", "Country", "Email", "Phone", "Date Added"];
    const rows = exhibitors.map((e) => [
      `"${e.firstName || ""}"`,
      `"${e.lastName || ""}"`,
      `"${e.companyName || ""}"`,
      `"${e.country || ""}"`,
      `"${e.email || ""}"`,
      `"${e.phone || ""}"`,
      `"${new Date(e.createdAt || Date.now()).toLocaleDateString("en-IN")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `exhibitors-page-${pagination.page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentPageIds = exhibitors.map((e) => e.id || e._id);
  const isCurrentPageAllSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: "0 0 4px 0",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Users size={26} style={{ color: "var(--admin-primary)" }} />
            <span>Exhibitors</span>
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Manage exhibitors directory (First Name, Last Name, Company, Country, Email, Phone). A welcome email is automatically sent when adding a new exhibitor.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {selectedIds.length > 0 && (
            <button
              onClick={handleOpenSelectedEmail}
              className="admin-btn admin-btn-secondary"
              style={{ gap: 6, borderColor: "#3b82f6", color: "#1d4ed8", backgroundColor: "#eff6ff" }}
            >
              <Send size={15} />
              <span>Email Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="admin-btn admin-btn-primary"
            style={{ gap: 6 }}
          >
            <Plus size={16} />
            <span>Add Exhibitor</span>
          </button>
        </div>
      </div>

      {/* Global Alert Notification */}
      {alert.text && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 14,
            backgroundColor: alert.type === "success" ? "#dcfce7" : "#fee2e2",
            color: alert.type === "success" ? "#15803d" : "#b91c1c",
            border: `1px solid ${alert.type === "success" ? "#bbf7d0" : "#fecaca"}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {alert.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{alert.text}</span>
          </div>
          <button
            onClick={() => setAlert({ text: "", type: "" })}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div
        className="admin-card"
        style={{
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 320px", maxWidth: 500 }}
        >
          <div style={{ position: "relative", width: "100%" }}>
            <Search
              size={16}
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
              placeholder="Search by name, company, country, email, phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="admin-input"
              style={{ paddingLeft: 36, paddingRight: search ? 36 : 12 }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <button type="submit" className="admin-btn admin-btn-secondary">
            Search
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b" }}>
            <span>Rows per page:</span>
            <select
              value={pagination.limit}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
              }}
              className="admin-select"
              style={{ width: 80, padding: "6px 10px" }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={exhibitors.length === 0}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ gap: 6 }}
            title="Export current page to CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => fetchExhibitors(pagination.page, pagination.limit, search)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ gap: 6 }}
            title="Refresh list"
          >
            <RefreshCw size={14} className={loading ? "spin-animation" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table" style={{ width: "100%", margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: 44, textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}
                    title={isCurrentPageAllSelected ? "Deselect all" : "Select all on page"}
                  >
                    {isCurrentPageAllSelected ? (
                      <CheckSquare size={17} style={{ color: "var(--admin-primary)" }} />
                    ) : (
                      <Square size={17} style={{ color: "#94a3b8" }} />
                    )}
                  </button>
                </th>
                <th style={{ width: 50, textAlign: "center" }}>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Company Name</th>
                <th>Country</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Date Added</th>
                <th style={{ width: 170, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <RefreshCw size={18} className="spin-animation" />
                      <span>Loading exhibitors...</span>
                    </div>
                  </td>
                </tr>
              ) : exhibitors.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: 48, textAlign: "center" }}>
                    <Users size={36} style={{ color: "#cbd5e1", margin: "0 auto 12px auto" }} />
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#334155" }}>
                      No exhibitors found
                    </div>
                    <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 16px 0" }}>
                      {search ? `No exhibitors matching "${search}"` : "Click 'Add Exhibitor' above to add your first contact."}
                    </p>
                    {search ? (
                      <button onClick={handleClearSearch} className="admin-btn admin-btn-secondary admin-btn-sm">
                        Clear Search
                      </button>
                    ) : (
                      <button onClick={handleOpenAdd} className="admin-btn admin-btn-primary admin-btn-sm">
                        <Plus size={14} />
                        <span>Add Exhibitor</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                exhibitors.map((item, idx) => {
                  const itemId = item.id || item._id;
                  const isSelected = selectedIds.includes(itemId);
                  const rowIndex = (pagination.page - 1) * pagination.limit + idx + 1;

                  return (
                    <tr
                      key={itemId || idx}
                      style={{
                        backgroundColor: isSelected ? "#f8fafc" : "transparent",
                        transition: "background-color 0.15s ease",
                      }}
                    >
                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(itemId)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          {isSelected ? (
                            <CheckSquare size={17} style={{ color: "var(--admin-primary)" }} />
                          ) : (
                            <Square size={17} style={{ color: "#cbd5e1" }} />
                          )}
                        </button>
                      </td>
                      <td style={{ textAlign: "center", color: "#64748b", fontSize: 13 }}>
                        {rowIndex}
                      </td>
                      <td>
                        <strong style={{ color: "#0f172a", fontSize: 14 }}>
                          {item.firstName}
                        </strong>
                      </td>
                      <td>
                        <strong style={{ color: "#0f172a", fontSize: 14 }}>
                          {item.lastName}
                        </strong>
                      </td>
                      <td>
                        <span style={{ color: item.companyName ? "#1e293b" : "#94a3b8", fontSize: 13, fontWeight: item.companyName ? 500 : 400 }}>
                          {item.companyName || "—"}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: item.country ? "#1e293b" : "#94a3b8", fontSize: 13 }}>
                          {item.country || "—"}
                        </span>
                      </td>
                      <td>
                        <a
                          href={`mailto:${item.email}`}
                          style={{
                            color: "var(--admin-primary)",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                          }}
                        >
                          <Mail size={13} style={{ color: "#94a3b8" }} />
                          <span>{item.email}</span>
                        </a>
                      </td>
                      <td>
                        <a
                          href={`tel:${item.phone}`}
                          style={{
                            color: "#0f172a",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                          }}
                        >
                          <Phone size={13} style={{ color: "#16a34a" }} />
                          <span>{item.phone}</span>
                        </a>
                      </td>
                      <td style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>
                        {new Date(item.createdAt || Date.now()).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleOpenSingleEmail(item)}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            style={{ padding: "5px 10px", gap: 4, color: "#2563eb", borderColor: "#bfdbfe" }}
                            title="Send email to this exhibitor"
                          >
                            <Send size={13} />
                            <span>Mail</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            style={{ padding: "5px 8px" }}
                            title="Edit exhibitor"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            style={{ padding: "5px 8px" }}
                            title="Delete exhibitor"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ fontSize: 13, color: "#64748b" }}>
            Showing{" "}
            <strong>
              {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{" "}
            of <strong>{pagination.total}</strong> exhibitors
          </div>

          {/* Page Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ padding: "6px 12px", gap: 4 }}
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                return (
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - pagination.page) <= 1
                );
              })
              .map((p, index, filteredArr) => {
                const prevP = filteredArr[index - 1];
                const showEllipsis = prevP && p - prevP > 1;
                const isActive = p === pagination.page;

                return (
                  <React.Fragment key={p}>
                    {showEllipsis && (
                      <span style={{ padding: "0 4px", color: "#94a3b8", fontSize: 13 }}>
                        ...
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPagination((prev) => ({ ...prev, page: p }))}
                      className={`admin-btn ${isActive ? "admin-btn-primary" : "admin-btn-secondary"} admin-btn-sm`}
                      style={{
                        minWidth: 32,
                        padding: "6px 10px",
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ padding: "6px 12px", gap: 4 }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: ADD / EDIT EXHIBITOR (ONLY 4 FIELDS)
      ========================================================================= */}
      {isAddOpen && (
        <div className="admin-modal-backdrop" onClick={() => !saving && setIsAddOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingExhibitor ? "Edit Exhibitor" : "Add New Exhibitor"}
              </h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="admin-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  Enter the exhibitor details below. Fields marked with <span style={{ color: "#cb0000" }}>*</span> are required.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">
                      First Name <span style={{ color: "#cb0000" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Rahul"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">
                      Last Name <span style={{ color: "#cb0000" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Patel"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. TexFab Industries"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">
                      Country
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. India"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">
                      Email Address <span style={{ color: "#cb0000" }}>*</span>
                    </label>
                    <input
                      type="email"
                      className="admin-input"
                      placeholder="e.g. rahul.patel@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">
                      Phone Number <span style={{ color: "#cb0000" }}>*</span>
                    </label>
                    <input
                      type="tel"
                      className="admin-input"
                      placeholder="e.g. +91 98251 23456"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {!editingExhibitor && (
                  <div
                    style={{
                      padding: "10px 14px",
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Mail size={16} style={{ color: "#16a34a", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#166534", lineHeight: 1.4 }}>
                      <strong>Automatic Email:</strong> A welcome email will be automatically sent to this email address upon adding.
                    </span>
                  </div>
                )}
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="admin-btn admin-btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={saving}
                  style={{ gap: 6 }}
                >
                  {saving ? (
                    <RefreshCw size={14} className="spin-animation" />
                  ) : (
                    <Check size={14} />
                  )}
                  <span>{saving ? "Saving..." : editingExhibitor ? "Update Exhibitor" : "Add Exhibitor"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: DELETE CONFIRMATION
      ========================================================================= */}
      {deleteTarget && (
        <div className="admin-modal-backdrop" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title" style={{ color: "#b91c1c" }}>
                Confirm Deletion
              </h2>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="admin-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p style={{ margin: "0 0 10px 0", fontSize: 14, color: "#334155" }}>
                Are you sure you want to delete exhibitor:
              </p>
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  padding: "10px 14px",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#991b1b",
                }}
              >
                {deleteTarget.firstName} {deleteTarget.lastName} ({deleteTarget.email})
              </div>
              <p style={{ margin: "10px 0 0 0", fontSize: 12, color: "#64748b" }}>
                This action cannot be undone.
              </p>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="admin-btn admin-btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="admin-btn admin-btn-danger"
                disabled={deleting}
                style={{ gap: 6 }}
              >
                {deleting ? (
                  <RefreshCw size={14} className="spin-animation" />
                ) : (
                  <Trash2 size={14} />
                )}
                <span>{deleting ? "Deleting..." : "Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: SEND EMAIL MODAL (WITH LIVE PREVIEW)
      ========================================================================= */}
      {sendModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => !sendingEmail && setSendModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h2 className="admin-modal-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Send size={18} style={{ color: "var(--admin-primary)" }} />
                  <span>Send Email to Exhibitor</span>
                </h2>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {emailTargetMode === "single" && singleRecipient ? (
                    <span>
                      Target: <strong>{singleRecipient.firstName} {singleRecipient.lastName}</strong> &lt;{singleRecipient.email}&gt;
                    </span>
                  ) : (
                    <span>
                      Target: <strong>{selectedIds.length} Selected Exhibitor(s)</strong>
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSendModalOpen(false)}
                className="admin-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sub-tabs: Compose vs Preview */}
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: "12px 24px",
                borderBottom: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
              }}
            >
              <button
                type="button"
                onClick={() => setModalTab("compose")}
                className={`admin-btn ${modalTab === "compose" ? "admin-btn-primary" : "admin-btn-secondary"} admin-btn-sm`}
                style={{ gap: 6 }}
              >
                <Edit2 size={13} />
                <span>Compose Message</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("preview")}
                className={`admin-btn ${modalTab === "preview" ? "admin-btn-primary" : "admin-btn-secondary"} admin-btn-sm`}
                style={{ gap: 6 }}
              >
                <Eye size={13} />
                <span>Live Email Preview</span>
              </button>
            </div>

            <form onSubmit={handleSendEmail}>
              <div className="admin-modal-body" style={{ maxHeight: "65vh", overflowY: "auto" }}>
                {modalTab === "compose" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="admin-form-group">
                      <label className="admin-label">Email Subject Line</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={emailForm.subject}
                        onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">
                        Email Heading Banner <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>(Optional - leave empty if not needed)</span>
                      </label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Special Invitation / Product Updates (Optional)"
                        value={emailForm.heading}
                        onChange={(e) => setEmailForm({ ...emailForm, heading: e.target.value })}
                      />
                    </div>

                    {/* Variable Chips */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                        Click to insert placeholder tags into message:
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {["firstName", "lastName", "fullName", "companyName", "country", "email", "phone"].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => insertVariable(v)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 4,
                              border: "1px solid #cbd5e1",
                              backgroundColor: "#f8fafc",
                              fontSize: 12,
                              cursor: "pointer",
                              color: "#2563eb",
                              fontWeight: 600,
                            }}
                          >
                            +{`{${v}}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Message Body</label>
                      <textarea
                        rows={7}
                        className="admin-textarea"
                        value={emailForm.body}
                        onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                        required
                      />
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                        Use double line breaks to separate paragraphs.
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div className="admin-form-group">
                        <label className="admin-label">Call-to-Action (CTA) Button Text</label>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="Explore Machinery Catalog"
                          value={emailForm.ctaText}
                          onChange={(e) => setEmailForm({ ...emailForm, ctaText: e.target.value })}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">CTA Button Link URL</label>
                        <input
                          type="url"
                          className="admin-input"
                          placeholder="https://www.anjaniindustries.in/products"
                          value={emailForm.ctaUrl}
                          onChange={(e) => setEmailForm({ ...emailForm, ctaUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Live Preview Tab */
                  <div
                    style={{
                      maxHeight: 640,
                      overflowY: "auto",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                    }}
                  >
                    <ExhibitorEmailPreview
                      heading={emailForm.heading}
                      body={emailForm.body}
                      ctaText={emailForm.ctaText}
                      ctaUrl={emailForm.ctaUrl}
                      recipient={singleRecipient}
                      stat1Value={emailForm.stat1Value}
                      stat1Label={emailForm.stat1Label}
                      stat2Value={emailForm.stat2Value}
                      stat2Label={emailForm.stat2Label}
                      stat3Value={emailForm.stat3Value}
                      stat3Label={emailForm.stat3Label}
                      showStats={emailForm.showStats}
                      showProducts={emailForm.showProducts}
                    />
                  </div>
                )}
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setSendModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                  disabled={sendingEmail}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={sendingEmail}
                  style={{ gap: 6 }}
                >
                  {sendingEmail ? (
                    <RefreshCw size={14} className="spin-animation" />
                  ) : (
                    <Send size={14} />
                  )}
                  <span>
                    {sendingEmail
                      ? "Sending Email..."
                      : emailTargetMode === "single"
                      ? "Send Email"
                      : `Send to ${emailTargetMode === "selected" ? `${selectedIds.length} Selected` : "All"} Exhibitors`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
