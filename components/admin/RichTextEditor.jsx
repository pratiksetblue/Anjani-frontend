"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Code, Eye, Sparkles } from "lucide-react";

// Dynamically import ReactQuill to prevent SSR window/document issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return function QuillComponent(props) {
      return <RQ {...props} />;
    };
  },
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: 180,
          background: "#f8fafc",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: 14,
        }}
      >
        Loading Editor...
      </div>
    ),
  }
);

// Pre-defined color palette with ANJANI Brand Red (#cb0000) and ECO+ Green (#00B050)
const customColors = [
  "#cb0000", // ANJANI Brand Red
  "#00B050", // ECO+ Green
  "#000000", // Black
  "#1e293b", // Slate Dark
  "#475569", // Gray
  "#2563eb", // Blue
  "#d97706", // Amber
  "#dc2626", // Crimson
  "#7c3aed", // Purple
  "#ffffff", // White
];

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write detailed description...",
  minHeight = 220,
}) {
  const [showHtmlSource, setShowHtmlSource] = useState(false);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: customColors }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
  ];

  // Helper to insert brand red tag around selection or append
  const insertAnjaniBrandTag = () => {
    const brandHtml = `<strong style="color: #cb0000; font-weight: 600;">ANJANI</strong> `;
    if (!value) {
      onChange(brandHtml);
    } else {
      onChange(value + " " + brandHtml);
    }
  };

  // Helper to insert ECO+ green tag
  const insertEcoTag = () => {
    const ecoHtml = `<strong style="color: #00B050; font-weight: 600;">ECO+</strong> `;
    if (!value) {
      onChange(ecoHtml);
    } else {
      onChange(value + " " + ecoHtml);
    }
  };

  return (
    <div className="admin-rich-editor-wrapper">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={insertAnjaniBrandTag}
            className="admin-btn admin-btn-sm"
            style={{
              background: "#fff1f2",
              color: "#cb0000",
              border: "1px solid #fecdd3",
              fontWeight: 600,
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              cursor: "pointer",
            }}
            title="Insert highlighted ANJANI brand name in red"
          >
            <Sparkles size={13} />
            <span>+ &quot;ANJANI&quot; (Red)</span>
          </button>

          <button
            type="button"
            onClick={insertEcoTag}
            className="admin-btn admin-btn-sm"
            style={{
              background: "#f0fdf4",
              color: "#00B050",
              border: "1px solid #bbf7d0",
              fontWeight: 600,
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              cursor: "pointer",
            }}
            title="Insert highlighted ECO+ in green"
          >
            <Sparkles size={13} />
            <span>+ &quot;ECO+&quot; (Green)</span>
          </button>

          <span style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>
            Color dropdown has Red (#cb0000) &amp; Green (#00B050)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowHtmlSource((prev) => !prev)}
          className="admin-btn admin-btn-secondary admin-btn-sm"
          style={{
            fontSize: 12,
            padding: "4px 10px",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {showHtmlSource ? (
            <>
              <Eye size={13} />
              <span>Rich Visual Editor</span>
            </>
          ) : (
            <>
              <Code size={13} />
              <span>HTML Source Code</span>
            </>
          )}
        </button>
      </div>

      {showHtmlSource ? (
        <textarea
          className="admin-textarea"
          rows={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Edit raw HTML..."
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            background: "#0f172a",
            color: "#f8fafc",
            borderColor: "#334155",
            minHeight,
          }}
        />
      ) : (
        <div
          className="quill-container-wrapper"
          style={{
            background: "#ffffff",
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #cbd5e1",
          }}
        >
          <ReactQuill
            theme="snow"
            value={value || ""}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            style={{ minHeight }}
          />
        </div>
      )}

      <style jsx global>{`
        .admin-rich-editor-wrapper .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          padding: 8px 12px;
        }
        .admin-rich-editor-wrapper .ql-container.ql-snow {
          border: none;
          min-height: ${minHeight}px;
          font-size: 15px;
          font-family: inherit;
        }
        .admin-rich-editor-wrapper .ql-editor {
          min-height: ${minHeight}px;
          line-height: 1.7;
          color: #1e293b;
          padding: 14px 16px;
        }
        .admin-rich-editor-wrapper .ql-editor p {
          margin-bottom: 12px;
        }
        .admin-rich-editor-wrapper .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
          left: 16px;
        }
        .admin-rich-editor-wrapper .ql-snow .ql-picker.ql-color .ql-picker-label svg,
        .admin-rich-editor-wrapper .ql-snow .ql-picker.ql-background .ql-picker-label svg {
          stroke: #334155;
        }
      `}</style>
    </div>
  );
}
