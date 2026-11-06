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
          minWidth: 600,
          maxWidth: 600,
          backgroundColor: "#ffffff",
          borderCollapse: "collapse",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* Top Logo */}
        <div style={{ padding: "12px 20px", textAlign: "center", backgroundColor: "#ffffff" }}>
          <a href="https://www.anjaniindustries.in/" target="_blank" rel="noreferrer">
            <img
              src="/emailer-assets/logo.jpg"
              alt="Anjani Industries"
              style={{ display: "inline-block", maxWidth: 260, width: "100%", height: "auto", border: 0 }}
            />
          </a>
        </div>

        {/* Hero Factory Banner */}
        <div>
          <img
            src="/emailer-assets/hero_factory.jpg"
            alt="Anjani Industries Textile Dyeing Machinery"
            style={{ display: "block", width: 600, height: "auto", border: 0 }}
          />
        </div>

        {/* Optional Heading Banner */}
        {resolvedHeading && resolvedHeading.trim() ? (
          <div
            style={{
              padding: "20px 24px 0 24px",
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
            padding: "24px 42px 16px",
            fontSize: 16,
            lineHeight: "24px",
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
          <div style={{ padding: "15px 20px 24px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                textAlign: "center",
              }}
            >
              <div style={{ borderRight: "1px solid #eee", padding: "4px" }}>
                <div style={{ fontSize: 32, fontWeight: "bold", color: "#f03b3f" }}>
                  {stat1Value || "36+"}
                </div>
                <div style={{ fontSize: 13, color: "#334155", lineHeight: "16px", marginTop: 4 }}>
                  {stat1Label || "Years of Industry Excellence"}
                </div>
              </div>
              <div style={{ borderRight: "1px solid #eee", padding: "4px" }}>
                <div style={{ fontSize: 32, fontWeight: "bold", color: "#f03b3f" }}>
                  {stat2Value || "45K"}
                </div>
                <div style={{ fontSize: 13, color: "#334155", lineHeight: "16px", marginTop: 4 }}>
                  {stat2Label || "Sq Ft Production Facility"}
                </div>
              </div>
              <div style={{ padding: "4px" }}>
                <div style={{ fontSize: 32, fontWeight: "bold", color: "#f03b3f" }}>
                  {stat3Value || "270"}
                </div>
                <div style={{ fontSize: 13, color: "#334155", lineHeight: "16px", marginTop: 4 }}>
                  {stat3Label || "Pcs Annual Production Capacity"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Showcase */}
        {showProducts && (
          <div style={{ padding: "0 18px 12px" }}>
            <div style={{ textAlign: "center", padding: "12px 10px 18px" }}>
              <div style={{ fontSize: 29, fontWeight: "bold" }}>
                OUR <span style={{ color: "#ef3339" }}>PRODUCTS</span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  letterSpacing: 1,
                  lineHeight: "17px",
                  color: "#111",
                  marginTop: 4,
                }}
              >
                ADVANCE TEXTILE<br />DYEING &amp; PROCESSING MACHINES
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {productRows.map(([p1, p2], rowIdx) => (
                <div
                  key={rowIdx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <a
                      href={`https://www.anjaniindustries.in/${p1.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none", color: "#111", display: "block" }}
                    >
                      <img
                        src={p1.image}
                        alt={p1.name}
                        style={{
                          display: "block",
                          width: "100%",
                          height: "auto",
                          border: 0,
                        }}
                      />
                      <div
                        style={{
                          fontSize: 15,
                          lineHeight: "20px",
                          padding: "6px 0 9px",
                          color: "#111",
                          textAlign: "left",
                        }}
                      >
                        {p1.name}
                      </div>
                    </a>
                  </div>

                  {p2 ? (
                    <div style={{ textAlign: "center" }}>
                      <a
                        href={`https://www.anjaniindustries.in/${p2.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: "none", color: "#111", display: "block" }}
                      >
                        <img
                          src={p2.image}
                          alt={p2.name}
                          style={{
                            display: "block",
                            width: "100%",
                            height: "auto",
                            border: 0,
                          }}
                        />
                        <div
                          style={{
                            fontSize: 15,
                            lineHeight: "20px",
                            padding: "6px 0 9px",
                            color: "#111",
                            textAlign: "left",
                          }}
                        >
                          {p2.name}
                        </div>
                      </a>
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
            padding: "28px 15px 25px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 2 }}>CONNECT WITH US</div>
          <div style={{ fontSize: 24, fontWeight: "bold", lineHeight: "30px", margin: "7px 0 16px" }}>
            Need Reliable Dyeing Solutions?
          </div>
          <a
            href={ctaUrl || "https://www.anjaniindustries.in/contact-us"}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              backgroundColor: "#ffffff",
              color: "#df1111",
              padding: "12px 24px",
              fontSize: 13,
              fontWeight: "bold",
              textDecoration: "none",
              borderRadius: 4,
            }}
          >
            {ctaText || "REQUEST A QUOTE"}
          </a>
        </div>

        {/* Dark Footer */}
        <div style={{ backgroundColor: "#050505", color: "#eee", padding: "25px 22px 14px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr",
              gap: 12,
              fontSize: 12,
              lineHeight: "17px",
            }}
          >
            <div>
              <b style={{ color: "#fff", display: "block", marginBottom: 3 }}>ADDRESS</b>
              Plot No. 983 &amp; 984, Road No. 58, GIDC Sachin, Surat - 394 230, Gujarat, India
            </div>
            <div style={{ borderLeft: "1px solid #555", paddingLeft: 8 }}>
              <b style={{ color: "#fff", display: "block", marginBottom: 3 }}>PHONE</b>
              <a style={{ color: "#fff", textDecoration: "none" }} href="tel:+918154888370">
                +91-8154888370
              </a>
              <br />
              <a style={{ color: "#fff", textDecoration: "none" }} href="tel:+917096007670">
                +91-7096007670
              </a>
            </div>
            <div style={{ borderLeft: "1px solid #555", paddingLeft: 8 }}>
              <b style={{ color: "#fff", display: "block", marginBottom: 3 }}>EMAIL</b>
              <a href="mailto:info@anjaniindustries.in" style={{ color: "#eee", textDecoration: "none" }}>
                info@anjaniindustries.in
              </a>
            </div>
          </div>

          <p style={{ fontSize: 12, lineHeight: "20px", margin: "22px 0 14px", color: "#eee" }}>
            <b style={{ color: "#fff" }}>Sales &amp; Service Offices:</b>
            <br />
            India – Surat, Ahmedabad, Mumbai, Ludhiana, Amritsar &amp; Bhilwara.
            <br />
            International – Colombo, Sri Lanka; Bandung, Indonesia.
          </p>

          <div
            style={{
              borderTop: "1px solid #444",
              textAlign: "center",
              padding: "14px 0",
              color: "#fff",
              fontSize: 14,
            }}
          >
            <a href="https://www.facebook.com/anjaniindustriess/" target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none" }}>
              Facebook
            </a>
            &nbsp; | &nbsp;
            <a href="https://www.linkedin.com/company/anjaniindustries/" target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none" }}>
              LinkedIn
            </a>
            &nbsp; | &nbsp;
            <a href="https://www.youtube.com/channel/UCQQSNOPZex4BUe7mN87DrIA" target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none" }}>
              YouTube
            </a>
            &nbsp; | &nbsp;
            <a href="https://in.pinterest.com/Anjaniindustries/" target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none" }}>
              Pinterest
            </a>
          </div>

          <div
            style={{
              borderTop: "1px solid #444",
              textAlign: "center",
              padding: "12px 0",
              fontSize: 13,
            }}
          >
            <a
              href="https://www.anjaniindustries.in/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#ccc", textDecoration: "none" }}
            >
              www.anjaniindustries.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
