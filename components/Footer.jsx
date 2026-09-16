"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const defaultProducts = [
  {
    title: "PLC Based Low Liquor Ratio ECO+ Soft Flow Dyeing Machine",
    href: "/plc-based-low-liquor-ratio-eco-soft-flow-dyeing-machine",
  },
  {
    title: "PLC Based Low Liquor Ratio Sample ECO+ Soft Flow Dyeing Machine",
    href: "/plc-based-low-liquor-ratio-sample-eco-soft-flow-dyeing-machine",
  },
  {
    title: "PLC Based U Type Rapid Jet Dyeing Machine",
    href: "/plc-based-u-type-rapid-jet-dyeing-machine",
  },
  {
    title: "PLC Based U Type Soft Flow Dyeing Machine",
    href: "/plc-based-u-type-soft-flow-dyeing-machine",
  },
  {
    title: "PLC Based U Type Sample Jet Dyeing Machine",
    href: "/plc-based-u-type-sample-jet-dyeing-machine",
  },
  {
    title: "PLC Based Long Tube Rapid Jet Dyeing Machine",
    href: "/plc-based-long-tube-rapid-jet-dyeing-machine",
  },
  {
    title: "Plc Based Long Tube Rapid Jet Dyeing - One Autoclave Two Tubes",
    href: "/plc-based-long-tube-double-tube-rapid-jet-dyeing-machine",
  },
  {
    title: "PLC Based Long Tube Soft Flow Dyeing Machine",
    href: "/plc-based-long-tube-soft-flow-dyeing-machine",
  },
  {
    title: "Plc Based Long Tube Rapid Jet Dyeing - Two Autoclave Two Tubes",
    href: "/plc-based-long-tube-with-double-tube-rapid-jet",
  },
  {
    title: "PLC Based Long Tube Sample Jet Dyeing Machine",
    href: "/plc-based-long-tube-sample-jet-dyeing-machine",
  },
  {
    title: "PLC Based Weight Reduction Machine with Caustic Recovery Unit",
    href: "/plc-based-weight-reduction-machine-with-caustic-recovery-unit",
  },
  {
    title: "Fully Automatic Caustic Recovery Plant",
    href: "/fully-automatic-caustic-recovery-plant",
  },
];

export default function Footer() {
  const [products, setProducts] = useState(defaultProducts);
  const [settings, setSettings] = useState({
    address:
      "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat- 394 230, Gujarat, India.",
    phone: "+91 8154 888 370",
    mapUrl: "https://maps.app.goo.gl/WAXYaDPz3nCyyMnk9",
    socialLinks: {
      facebook: "https://www.facebook.com/anjaniindustriess/",
      pinterest: "https://in.pinterest.com/Anjaniindustries/",
      youtube: "https://www.youtube.com/channel/UCQQSNOPZex4BUe7mN87DrIA",
      linkedin: "https://www.linkedin.com/company/anjaniindustries/",
    },
  });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(
            data.map((p) => ({
              title: p.title,
              href: `/${p.slug}`,
            })),
          );
        }
      })
      .catch(() => {});

    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setSettings({
            address: data.headquarters?.address || settings.address,
            phone: data.phone || settings.phone,
            mapUrl: data.headquarters?.mapUrl || settings.mapUrl,
            socialLinks: data.socialLinks || settings.socialLinks,
          });
        }
      })
      .catch(() => {});
  }, []);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState({ text: "", type: "" });

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.trim()) {
      setNewsletterMsg({
        text: "Please enter your email address.",
        type: "error",
      });
      return;
    }

    setSubmittingNewsletter(true);
    setNewsletterMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Subscription failed.");
      }

      setNewsletterMsg({
        text: "✓ Thank you for subscribing! Check your inbox for confirmation.",
        type: "success",
      });
      setNewsletterEmail("");
    } catch (err) {
      setNewsletterMsg({
        text: err.message || "Failed to subscribe. Please try again.",
        type: "error",
      });
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  return (
    <>
      <div className="footer-top-banner-section">
        <div className="container-fluid">
          <div className="footer-top-banner-wrap">
            <div
              className="section-title white wow animate fadeInLeft"
              data-wow-delay="200ms"
              data-wow-duration="1500ms"
            >
              <span>Connect with us</span>
              <h2>Need Reliable Dyeing Solutions?</h2>
            </div>
            <div
              className="btn-grp wow animate fadeInRight"
              data-wow-delay="200ms"
              data-wow-duration="1500ms"
            >
              <Link className="primary-btn1 white-bg" href="/contact-us">
                <span>Request a Quote</span>
                <span>Request a Quote</span>
                <svg
                  className="arrow"
                  height="23"
                  viewBox="0 0 23 23"
                  width="23"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path d="M0.113861 0H22.9999V4.28425L4.32671 22.9997L0 18.7154L12.7524 6.08815L0.113861 6.20089V0Z" />
                    <path d="M23 22.9996V8.56848L16.8516 14.6566V22.9996H23Z" />
                  </g>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <svg
          className="arrow-vector"
          height="147"
          viewBox="0 0 147 147"
          width="147"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path d="M0.727728 0H147.001V27.3823L27.6537 147L0 119.617L81.5055 38.9117L0.727728 39.6323V0Z" />
            <path d="M147.002 146.999V54.7637L107.705 93.6754V146.999H147.002Z" />
          </g>
        </svg>
      </div>

      <footer className="footer-section">
        <div className="footer-wrapper">
          <div className="container-fluid">
            <div className="footer-menu-and-address-wrap">
              <div className="row">
                <div className="col-lg-3">
                  <div className="footer-widget">
                    <div className="address-area">
                      <ul className="address-list">
                        <li className="single-address">
                          <span>HEADQUARTERS</span>
                          <p>{settings.address}</p>
                          <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}>
                            Tel: {settings.phone}
                          </a>
                        </li>
                      </ul>
                      <a
                        className="location-btn"
                        href={settings.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View All Factory Location
                      </a>
                    </div>
                    <ul className="social-area">
                      <li>
                        <a
                          href={settings.socialLinks?.facebook}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Facebook"
                        >
                          <i className="bi bi-facebook" />
                        </a>
                      </li>
                      <li>
                        <a
                          href={settings.socialLinks?.pinterest}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Pinterest"
                        >
                          <i className="bi bi-pinterest" />
                        </a>
                      </li>
                      <li>
                        <a
                          href={settings.socialLinks?.youtube}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="YouTube"
                        >
                          <i className="bi bi-youtube" />
                        </a>
                      </li>
                      <li>
                        <a
                          href={settings.socialLinks?.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="LinkedIn"
                        >
                          <i className="bi bi-linkedin" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-lg-9">
                  <div className="footer-menu">
                    <div className="row gy-5">
                      <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="footer-widget">
                          <div className="widget-title">
                            <h5>COMPANY LINKS</h5>
                          </div>
                          <div className="menu-container">
                            <ul className="widget-list">
                              <li>
                                <Link href="/about-us">
                                  Who We Are
                                  <svg
                                    height="9"
                                    viewBox="0 0 9 9"
                                    width="9"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M0.0445549 0H9.00008V1.67647L1.69308 9L0 7.32353L4.99014 2.38235L0.0445549 2.42647V0Z" />
                                    <path d="M9.0002 8.9996V3.35254L6.59424 5.73489V8.9996H9.0002Z" />
                                  </svg>
                                </Link>
                              </li>
                              <ul className="footer-sub-link">
                                <li>
                                  <Link href="/about-us">
                                    About Us
                                    <svg
                                      height="9"
                                      viewBox="0 0 9 9"
                                      width="9"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M0.0445549 0H9.00008V1.67647L1.69308 9L0 7.32353L4.99014 2.38235L0.0445549 2.42647V0Z" />
                                      <path d="M9.0002 8.9996V3.35254L6.59424 5.73489V8.9996H9.0002Z" />
                                    </svg>
                                  </Link>
                                </li>
                                <li>
                                  <Link href="/our-story">
                                    Our Story
                                    <svg
                                      height="9"
                                      viewBox="0 0 9 9"
                                      width="9"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M0.0445549 0H9.00008V1.67647L1.69308 9L0 7.32353L4.99014 2.38235L0.0445549 2.42647V0Z" />
                                      <path d="M9.0002 8.9996V3.35254L6.59424 5.73489V8.9996H9.0002Z" />
                                    </svg>
                                  </Link>
                                </li>
                                <li>
                                  <Link href="/values-ethics">
                                    Values &amp; Ethics
                                    <svg
                                      height="9"
                                      viewBox="0 0 9 9"
                                      width="9"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M0.0445549 0H9.00008V1.67647L1.69308 9L0 7.32353L4.99014 2.38235L0.0445549 2.42647V0Z" />
                                      <path d="M9.0002 8.9996V3.35254L6.59424 5.73489V8.9996H9.0002Z" />
                                    </svg>
                                  </Link>
                                </li>
                              </ul>
                              <li>
                                <Link href="/contact-us">
                                  Contact
                                  <svg
                                    height="9"
                                    viewBox="0 0 9 9"
                                    width="9"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M0.0445549 0H9.00008V1.67647L1.69308 9L0 7.32353L4.99014 2.38235L0.0445549 2.42647V0Z" />
                                    <path d="M9.0002 8.9996V3.35254L6.59424 5.73489V8.9996H9.0002Z" />
                                  </svg>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-5 col-md-6 col-sm-6">
                        <div className="footer-widget">
                          <div className="widget-title">
                            <h5>PRODUCTS</h5>
                          </div>
                          <div className="menu-container">
                            <ul className="widget-list">
                              {products.map((p) => (
                                <li key={p.href}>
                                  <Link href={p.href}>
                                    {p.title}
                                    <svg
                                      height="9"
                                      viewBox="0 0 9 9"
                                      width="9"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M0.0445549 0H9.00008V1.67647L1.69308 9L0 7.32353L4.99014 2.38235L0.0445549 2.42647V0Z" />
                                      <path d="M9.0002 8.9996V3.35254L6.59424 5.73489V8.9996H9.0002Z" />
                                    </svg>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-12">
                        <div className="footer-widget">
                          <div className="widget-title">
                            <h5>NEWSLETTER</h5>
                          </div>
                          <p
                            style={{
                              color: "#94a3b8",
                              fontSize: "14px",
                              lineHeight: "1.6",
                              marginBottom: "16px",
                            }}
                          >
                            Subscribe to receive the latest updates on advanced
                            fabric dyeing machinery, eco-friendly innovations,
                            and global textile trade news.
                          </p>

                          <form
                            onSubmit={handleNewsletterSubmit}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <input
                                type="email"
                                required
                                placeholder="Enter your email address..."
                                value={newsletterEmail}
                                onChange={(e) =>
                                  setNewsletterEmail(e.target.value)
                                }
                                disabled={submittingNewsletter}
                                style={{
                                  width: "100%",
                                  height: "48px",
                                  padding: "0 130px 0 16px",
                                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                                  border: "1px solid #2d3248",
                                  borderRadius: "6px",
                                  color: "#ffffff",
                                  fontSize: "14px",
                                  outline: "none",
                                  transition: "border-color 0.2s ease",
                                }}
                                onFocus={(e) =>
                                  (e.target.style.borderColor = "#cb0000")
                                }
                                onBlur={(e) =>
                                  (e.target.style.borderColor = "#2d3248")
                                }
                              />
                              <button
                                type="submit"
                                disabled={submittingNewsletter}
                                className="newsletter-submit-btn"
                              >
                                <span
                                  style={{
                                    background: "transparent",
                                    color: "#ffffff",
                                  }}
                                >
                                  {submittingNewsletter
                                    ? "Subscribing..."
                                    : "Subscribe"}
                                </span>
                                {!submittingNewsletter && (
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                  </svg>
                                )}
                              </button>
                            </div>

                            {newsletterMsg.text && (
                              <div
                                style={{
                                  fontSize: "13px",
                                  padding: "8px 12px",
                                  borderRadius: "4px",
                                  backgroundColor:
                                    newsletterMsg.type === "success"
                                      ? "rgba(34, 197, 94, 0.15)"
                                      : "rgba(239, 68, 68, 0.15)",
                                  color:
                                    newsletterMsg.type === "success"
                                      ? "#4ade80"
                                      : "#f87171",
                                  border: `1px solid ${newsletterMsg.type === "success" ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                                }}
                              >
                                {newsletterMsg.text}
                              </div>
                            )}

                            <span
                              style={{
                                fontSize: "12px",
                                color: "#64748b",
                                marginTop: "2px",
                              }}
                            >
                              🔒 We respect your privacy. No spam, ever.
                            </span>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom-wrap">
          <div className="container-fluid">
            <div className="footer-bottom">
              <div className="copyright-area">
                <p>
                  © 2026 Anjani industries. |{" "}
                  <a href="/assets/pdf/privacy_policy.pdf" target="_blank">
                    Privacy Policy
                  </a>
                </p>
              </div>
              <div className="copyright-area">
                <p>
                  Website developed by:{" "}
                  <a
                    href="https://www.setblue.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Setblue.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
