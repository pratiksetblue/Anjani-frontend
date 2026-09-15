"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Edit2,
  Trash2,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  Lock,
  Mail,
  User as UserIcon,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [selectedUser, setSelectedUser] = useState(null);

  // Password reset modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Admin",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, meRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/auth/me"),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data);
      }
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentAdmin(meData.user || null);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setMessage({ text: "Failed to load admin users", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Admin",
    });
    setShowPassword(false);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", // Leave blank if not changing
      role: user.role || "Admin",
    });
    setShowPassword(false);
    setModalOpen(true);
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setShowPassword(false);
    setPasswordModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      if (modalMode === "create") {
        if (!formData.password || formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create user");

        setMessage({
          text: `Admin user "${data.name}" created successfully! They can now log in.`,
          type: "success",
        });
        setModalOpen(false);
        fetchUsers();
      } else {
        // Edit mode
        const payload = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password && formData.password.trim().length >= 6) {
          payload.password = formData.password.trim();
        }

        const res = await fetch(`/api/users/${selectedUser.id || selectedUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update user");

        setMessage({
          text: `Admin user "${data.name}" updated successfully!`,
          type: "success",
        });
        setModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    setPasswordSubmitting(true);
    try {
      const res = await fetch(`/api/users/${selectedUser.id || selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      setMessage({
        text: `Password updated for "${selectedUser.name}"!`,
        type: "success",
      });
      setPasswordModalOpen(false);
    } catch (err) {
      alert(err.message || "Failed to update password");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    const userId = user.id || user._id;
    if (currentAdmin && (currentAdmin.id === userId || currentAdmin._id === userId)) {
      alert("You cannot delete your own logged-in account.");
      return;
    }

    if (users.length <= 1) {
      alert("You cannot delete the only remaining admin account.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete admin "${user.name}" (${user.email})? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setMessage({
        text: `User "${user.name}" deleted successfully.`,
        type: "success",
      });
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== userId));
    } catch (err) {
      alert(err.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case "Super Admin":
        return {
          bg: "#fee2e2",
          color: "#991b1b",
          border: "#fecaca",
          icon: ShieldAlert,
        };
      case "Admin":
        return {
          bg: "#eff6ff",
          color: "#1e40af",
          border: "#bfdbfe",
          icon: ShieldCheck,
        };
      default:
        return {
          bg: "#f1f5f9",
          color: "#334155",
          border: "#e2e8f0",
          icon: Shield,
        };
    }
  };

  return (
    <div>
      {/* Top Page Header */}
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
            Admin User Management ({users.length})
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Create and manage authorized administrators with access to the Anjani Industries control panel.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={fetchUsers}
            className="admin-btn admin-btn-secondary"
            title="Refresh List"
          >
            <RefreshCw size={16} />
            <span className="d-none d-sm-inline">Refresh</span>
          </button>
          <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
            <UserPlus size={16} />
            <span>Create New Admin</span>
          </button>
        </div>
      </div>

      {/* Global Notification Banner */}
      {message.text && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 14,
            fontWeight: 500,
            backgroundColor: message.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: message.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${message.type === "success" ? "#a7f3d0" : "#fecaca"}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage({ text: "", type: "" })}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className="admin-card">
        {/* Search Bar */}
        <div style={{ marginBottom: 20, position: "relative", maxWidth: 360 }}>
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
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            Loading admin users from MongoDB Atlas...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            No admin users found matching your search.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Admin User</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const userId = user.id || user._id;
                  const isCurrent =
                    currentAdmin &&
                    (currentAdmin.id === userId || currentAdmin._id === userId);
                  const roleStyle = getRoleBadge(user.role);
                  const RoleIcon = roleStyle.icon;

                  return (
                    <tr key={userId}>
                      {/* User Avatar + Name */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              backgroundColor: "var(--admin-primary)",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 15,
                              flexShrink: 0,
                            }}
                          >
                            {user.name ? user.name[0].toUpperCase() : "A"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#0f172a" }}>
                              {user.name}
                              {isCurrent && (
                                <span
                                  style={{
                                    marginLeft: 8,
                                    fontSize: 11,
                                    backgroundColor: "#dcfce7",
                                    color: "#15803d",
                                    padding: "2px 6px",
                                    borderRadius: 4,
                                    fontWeight: 700,
                                  }}
                                >
                                  You
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 12, color: "#94a3b8" }}>ID: {userId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Mail size={14} style={{ color: "#94a3b8" }} />
                          <span style={{ fontWeight: 500, color: "#334155" }}>{user.email}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: roleStyle.bg,
                            color: roleStyle.color,
                            border: `1px solid ${roleStyle.border}`,
                            padding: "4px 10px",
                            borderRadius: 14,
                          }}
                        >
                          <RoleIcon size={13} />
                          <span>{user.role || "Admin"}</span>
                        </span>
                      </td>

                      {/* Created Date */}
                      <td style={{ fontSize: 13, color: "#64748b" }}>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Primary Account"}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            onClick={() => openPasswordModal(user)}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="Reset / Change Password"
                          >
                            <Key size={13} />
                            <span className="d-none d-md-inline">Password</span>
                          </button>

                          <button
                            onClick={() => openEditModal(user)}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="Edit User Details"
                          >
                            <Edit2 size={13} />
                            <span className="d-none d-md-inline">Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user)}
                            disabled={isCurrent || users.length <= 1 || deletingId === userId}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            title={
                              isCurrent
                                ? "Cannot delete yourself"
                                : users.length <= 1
                                ? "Cannot delete the only admin"
                                : "Delete Admin User"
                            }
                            style={{
                              opacity: isCurrent || users.length <= 1 ? 0.4 : 1,
                              cursor:
                                isCurrent || users.length <= 1 ? "not-allowed" : "pointer",
                            }}
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

      {/* CREATE / EDIT USER MODAL */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 14,
              maxWidth: 500,
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "18px 24px",
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
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: "#fee2e2",
                    color: "var(--admin-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserPlus size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: "#0f172a" }}>
                    {modalMode === "create" ? "Create New Admin User" : "Edit Admin User"}
                  </h2>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                    {modalMode === "create"
                      ? "Create credentials for authorized staff to log into the admin panel."
                      : `Update account details for ${selectedUser?.name}.`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} style={{ padding: 24 }}>
              <div className="admin-form-group">
                <label className="admin-label">Full Name *</label>
                <div style={{ position: "relative" }}>
                  <UserIcon
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
                    required
                    className="admin-input"
                    style={{ paddingLeft: 38 }}
                    placeholder="e.g. Nikunj Hapani or Plant Manager"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Email Address (Login Username) *</label>
                <div style={{ position: "relative" }}>
                  <Mail
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
                    type="email"
                    required
                    className="admin-input"
                    style={{ paddingLeft: 38 }}
                    placeholder="user@anjaniindustries.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  {modalMode === "create" ? "Login Password *" : "Change Password (optional)"}
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
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
                    type={showPassword ? "text" : "password"}
                    required={modalMode === "create"}
                    className="admin-input"
                    style={{ paddingLeft: 38, paddingRight: 40 }}
                    placeholder={
                      modalMode === "create" ? "Minimum 6 characters" : "Leave blank to keep unchanged"
                    }
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">User Role & Access Level</label>
                <select
                  className="admin-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Super Admin">Super Admin (Full access to all modules & users)</option>
                  <option value="Admin">Admin (Access to machinery, content, leads & SEO)</option>
                  <option value="Editor">Editor (Catalog and content updates only)</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-btn admin-btn-primary"
                >
                  {submitting
                    ? "Saving..."
                    : modalMode === "create"
                    ? "Create Admin User"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PASSWORD RESET MODAL */}
      {passwordModalOpen && selectedUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 14,
              maxWidth: 440,
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Key size={18} style={{ color: "var(--admin-primary)" }} />
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#0f172a" }}>
                    Reset Password
                  </h3>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {selectedUser.name} ({selectedUser.email})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPasswordModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} style={{ padding: 24 }}>
              <div className="admin-form-group">
                <label className="admin-label">New Password *</label>
                <div style={{ position: "relative" }}>
                  <Lock
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
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    className="admin-input"
                    style={{ paddingLeft: 38, paddingRight: 40 }}
                    placeholder="Enter new password (min. 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="admin-btn admin-btn-primary"
                >
                  {passwordSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
