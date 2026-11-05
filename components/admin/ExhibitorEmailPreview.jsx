"use client";

import React from "react";
import { EXHIBITOR_EMAIL_PRODUCTS } from "@/lib/emailerProducts";

export default function ExhibitorEmailPreview({
  heading = "",
  body = "",
  ctaText = "REQUEST A QUOTE",
  ctaUrl = "https://www.anjaniindustries.in/contact-us",
  recipient = null,
  stat1Value = "36+",
  stat1Label = "Years of Industry Excellence",
  stat2Value = "45K",
  stat2Label = "Sq Ft Production Facility",
  stat3Value = "270",
  stat3Label = "Pcs Annual Production Capacity",
  showStats = true,
  showProducts = true,
}) {
  const sampleFullName = recipient
    ? [recipient.firstName, recipient.lastName].filter(Boolean).join(" ") || "Rahul Patel"
    : "Rahul Patel";
  const sampleFirstName = recipient?.firstName || "Rahul";
  const sampleLastName = recipient?.lastName || "Patel";
  const sampleCompany = recipient?.companyName || "TexFab Industries";
  const sampleCountry = recipient?.country || "India";
  const sampleEmail = recipient?.email || "rahul.patel@textilemills.in";
  const samplePhone = recipient?.phone || "+91 98251 23456";

  const resolvedHeading = (heading || "")
    .replace(/\{fullName\}/g, sampleFullName)
    .replace(/\{firstName\}/g, sampleFirstName)
    .replace(/\{lastName\}/g, sampleLastName)
    .replace(/\{companyName\}/g, sampleCompany)
    .replace(/\{country\}/g, sampleCountry)
    .replace(/\{email\}/g, sampleEmail)
    .replace(/\{phone\}/g, samplePhone);

  const resolvedBody = (body || "")
    .replace(/\{fullName\}/g, sampleFullName)
    .replace(/\{firstName\}/g, sampleFirstName)
    .replace(/\{lastName\}/g, sampleLastName)
    .replace(/\{companyName\}/g, sampleCompany)
    .replace(/\{country\}/g, sampleCountry)
    .replace(/\{email\}/g, sampleEmail)
    .replace(/\{phone\}/g, samplePhone);

  // Group products in pairs of 2
  const productRows = [];
  for (let i = 0; i < EXHIBITOR_EMAIL_PRODUCTS.length; i += 2) {
    productRows.push([EXHIBITOR_EMAIL_PRODUCTS[i], EXHIBITOR_EMAIL_PRODUCTS[i + 1]]);
  }

  return (
    <div
      style={{
        backgroundColor: "#e9eef1",
        padding: "20px 10px",
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: 600,
          maxWidth: "100%",
          backgroundColor: "#ffffff",
          borderCollapse: "collapse",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* Top Logo */}
        <div style={{ padding: "16px 20px", textAlign: "center", backgroundColor: "#ffffff" }}>
          <img
            src="/emailer-assets/logo.jpg"
            alt="Anjani Industries"
            style={{ display: "inline-block", maxWidth: 260, width: "100%", height: "auto" }}
          />
        </div>

        {/* Hero Factory Banner */}
        <div>
          <img
            src="/emailer-assets/hero_factory.jpg"
            alt="Anjani Industries Factory"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        </div>

        {/* Optional Heading Banner */}
        {resolvedHeading && resolvedHeading.trim() ? (
          <div
            style={{
              padding: "22px 30px 0 30px",
              textAlign: "center",
              fontSize: 20,
              fontWeight: 700,
              color: "#ef3339",
            }}
          >
            {resolvedHeading.trim()}
          </div>
        ) : null}

        {/* Message Body */}
        <div
          style={{
            padding: "22px 34px 18px",
            fontSize: 15,
            lineHeight: 1.6,
            color: "#1e293b",
            whiteSpace: "pre-line",
            textAlign: "center",
          }}
        >
          {resolvedBody || (
            <span>
              Anjani Industries is one of India&apos;s leading manufacturers of textile dyeing and
              processing machinery, backed by over 36 years of engineering excellence.
            </span>
          )}
        </div>

        {/* Stats Row */}
        {showStats && (
          <div style={{ padding: "10px 20px 22px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                textAlign: "center",
                borderTop: "1px solid #f1f5f9",
                borderBottom: "1px solid #f1f5f9",
                padding: "12px 0",
              }}
            >
              <div style={{ borderRight: "1px solid #eee", padding: "4px" }}>
                <div style={{ fontSize: 28, fontWeight: "bold", color: "#f03b3f" }}>
                  {stat1Value || "36+"}
                </div>
                <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.3, marginTop: 4 }}>
                  {stat1Label || "Years of Industry Excellence"}
                </div>
              </div>
              <div style={{ borderRight: "1px solid #eee", padding: "4px" }}>
                <div style={{ fontSize: 28, fontWeight: "bold", color: "#f03b3f" }}>
                  {stat2Value || "45K"}
                </div>
                <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.3, marginTop: 4 }}>
                  {stat2Label || "Sq Ft Production Facility"}
                </div>
              </div>
              <div style={{ padding: "4px" }}>
                <div style={{ fontSize: 28, fontWeight: "bold", color: "#f03b3f" }}>
                  {stat3Value || "270"}
                </div>
                <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.3, marginTop: 4 }}>
                  {stat3Label || "Pcs Annual Production Capacity"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Showcase */}
        {showProducts && (
          <div style={{ padding: "10px 18px 20px" }}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 24, fontWeight: "bold", letterSpacing: 0.5 }}>
                OUR <span style={{ color: "#ef3339" }}>PRODUCTS</span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1,
                  lineHeight: 1.4,
                  color: "#475569",
                  marginTop: 4,
                }}
              >
                ADVANCE TEXTILE DYEING &amp; PROCESSING MACHINES
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {productRows.map(([p1, p2], rowIdx) => (
                <div
                  key={rowIdx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={p1.image}
                      alt={p1.name}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        borderRadius: 4,
                        border: "1px solid #f1f5f9",
                      }}
                    />
                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: 1.4,
                        padding: "6px 2px",
                        color: "#0f172a",
                        fontWeight: 600,
                        textAlign: "left",
                      }}
                    >
                      {p1.name}
                    </div>
                  </div>

                  {p2 ? (
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={p2.image}
                        alt={p2.name}
                        style={{
                          display: "block",
                          width: "100%",
                          height: "auto",
                          borderRadius: 4,
                          border: "1px solid #f1f5f9",
                        }}
                      />
                      <div
                        style={{
                          fontSize: 13,
                          lineHeight: 1.4,
                          padding: "6px 2px",
                          color: "#0f172a",
                          fontWeight: 600,
                          textAlign: "left",
                        }}
                      >
                        {p2.name}
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Red CTA Banner */}
        <div
          style={{
            backgroundColor: "#e50000",
            color: "#ffffff",
            padding: "26px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.9 }}>
            CONNECT WITH US
          </div>
          <div style={{ fontSize: 22, fontWeight: "bold", margin: "6px 0 16px" }}>
            Need Reliable Dyeing Solutions?
          </div>
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#ffffff",
              color: "#df1111",
              padding: "10px 24px",
              fontSize: 12,
              fontWeight: "bold",
              borderRadius: 4,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {ctaText || "REQUEST A QUOTE"}
          </span>
        </div>

        {/* Dark Footer */}
        <div style={{ backgroundColor: "#050505", color: "#eee", padding: "24px 22px 16px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr",
              gap: 12,
              fontSize: 11,
              lineHeight: 1.5,
              borderBottom: "1px solid #333",
              paddingBottom: 16,
            }}
          >
            <div>
              <b style={{ color: "#fff", display: "block", marginBottom: 3 }}>ADDRESS</b>
              Plot No. 983 &amp; 984, Road No. 58, GIDC Sachin, Surat – 394230, Gujarat, India
            </div>
            <div style={{ borderLeft: "1px solid #444", paddingLeft: 10 }}>
              <b style={{ color: "#fff", display: "block", marginBottom: 3 }}>PHONE</b>
              +91-8154888370
              <br />
              +91-7096007670
            </div>
            <div style={{ borderLeft: "1px solid #444", paddingLeft: 10 }}>
              <b style={{ color: "#fff", display: "block", marginBottom: 3 }}>EMAIL</b>
              info@anjaniindustries.in
            </div>
          </div>

          <p style={{ fontSize: 11, lineHeight: 1.6, margin: "16px 0 12px", color: "#94a3b8" }}>
            <b style={{ color: "#fff" }}>Sales &amp; Service Offices:</b>
            <br />
            India – Surat, Ahmedabad, Mumbai, Ludhiana, Amritsar &amp; Bhilwara.
            <br />
            International – Colombo, Sri Lanka; Bandung, Indonesia.
          </p>

          <div
            style={{
              borderTop: "1px solid #333",
              textAlign: "center",
              padding: "12px 0 8px",
              color: "#fff",
              fontSize: 12,
            }}
          >
            Facebook &nbsp;|&nbsp; LinkedIn &nbsp;|&nbsp; YouTube &nbsp;|&nbsp; Pinterest
          </div>

          <div
            style={{
              borderTop: "1px solid #333",
              textAlign: "center",
              paddingTop: 10,
              fontSize: 12,
              color: "#94a3b8",
            }}
          >
            www.anjaniindustries.in
          </div>
        </div>
      </div>
    </div>
  );
}
