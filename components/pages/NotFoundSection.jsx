import React from "react";
import Link from "next/link";
import { Home, Package, PhoneCall, ArrowRight, MessageCircle } from "lucide-react";

const ArrowIcon = () => (
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
);

export default function NotFoundSection() {
  return (
    <div className="not-found-page-container">
      {/* Top Breadcrumb Section with authentic Anjani banner */}
      <div className="breadcrumb-section">
        <div className="breadcrumb-content-wrap">
          <div className="container">
            <div className="row">
              <div className="col-xl-9 col-lg-10">
                <div className="breadcrumb-content">
                  <h1>404 - Page Not Found</h1>
                  <ul
                    className="breadcrumb-list d-flex align-items-center gap-2 mt-2"
                    style={{ listStyle: "none", padding: 0, margin: 0 }}
                  >
                    <li>
                      <Link
                        href="/"
                        style={{ color: "#ffffff", opacity: 0.85, fontSize: "15px" }}
                      >
                        Home
                      </Link>
                    </li>
                    <li style={{ color: "#cb0000", fontSize: "14px" }}>/</li>
                    <li style={{ color: "#cb0000", fontWeight: 600, fontSize: "15px" }}>
                      404 Error
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="breadcrumb-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Anjani Industries Banner" src="/assets/img/about-banner.jpg" />
        </div>
      </div>

      {/* Main 404 Content */}
      <section className="not-found-main-area" style={{ padding: "70px 0 90px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8 text-center">
              {/* Industrial Gear 404 SVG Graphic */}
              <div className="not-found-graphic mb-4">
                <svg
                  width="280"
                  height="110"
                  viewBox="0 0 280 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ maxWidth: "100%", height: "auto" }}
                >
                  <text
                    x="20"
                    y="95"
                    fontFamily="var(--font-manrope, 'Manrope', sans-serif)"
                    fontSize="110"
                    fontWeight="900"
                    fill="#111827"
                    letterSpacing="-2px"
                  >
                    4
                  </text>
                  <g transform="translate(140, 55)">
                    <circle r="44" fill="#FEF2F2" stroke="#CB0000" strokeWidth="6" />
                    <circle r="26" fill="#CB0000" />
                    <circle r="12" fill="#FFFFFF" />
                    <rect x="-4" y="-50" width="8" height="12" rx="2" fill="#CB0000" />
                    <rect x="-4" y="38" width="8" height="12" rx="2" fill="#CB0000" />
                    <rect x="-50" y="-4" width="12" height="8" rx="2" fill="#CB0000" />
                    <rect x="38" y="-4" width="12" height="8" rx="2" fill="#CB0000" />
                    <rect
                      x="-35"
                      y="-35"
                      width="8"
                      height="12"
                      rx="2"
                      transform="rotate(45, -31, -29)"
                      fill="#CB0000"
                    />
                    <rect
                      x="27"
                      y="27"
                      width="8"
                      height="12"
                      rx="2"
                      transform="rotate(45, 31, 33)"
                      fill="#CB0000"
                    />
                    <rect
                      x="-35"
                      y="27"
                      width="8"
                      height="12"
                      rx="2"
                      transform="rotate(-45, -31, 33)"
                      fill="#CB0000"
                    />
                    <rect
                      x="27"
                      y="-35"
                      width="8"
                      height="12"
                      rx="2"
                      transform="rotate(-45, 31, -29)"
                      fill="#CB0000"
                    />
                  </g>
                  <text
                    x="200"
                    y="95"
                    fontFamily="var(--font-manrope, 'Manrope', sans-serif)"
                    fontSize="110"
                    fontWeight="900"
                    fill="#111827"
                    letterSpacing="-2px"
                  >
                    4
                  </text>
                </svg>
              </div>

              {/* Title & Description */}
              <h2
                style={{
                  fontSize: "clamp(24px, 3.5vw, 36px)",
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: "16px",
                  lineHeight: 1.3,
                  fontFamily: "var(--font-manrope, 'Manrope', sans-serif)",
                }}
              >
                Oops! The Page You Are Looking For Doesn&apos;t Exist.
              </h2>

              <p
                style={{
                  fontSize: "16.5px",
                  color: "#475569",
                  lineHeight: 1.7,
                  maxWidth: "680px",
                  margin: "0 auto 36px auto",
                  fontFamily: "var(--font-dmsans, 'DM Sans', sans-serif)",
                }}
              >
                The link you followed may be broken, or the page may have been removed or renamed.
                Explore our textile dyeing machinery or return to our homepage.
              </p>

              {/* Primary Action Buttons */}
              <div
                className="not-found-btn-group"
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginBottom: "50px",
                }}
              >
                <Link className="primary-btn1 black-bg" href="/">
                  <span>Back To Home</span>
                  <span>Back To Home</span>
                  <ArrowIcon />
                </Link>

                <Link className="primary-btn1 white-bg" href="/products">
                  <span>Explore Machinery</span>
                  <span>Explore Machinery</span>
                  <ArrowIcon />
                </Link>
              </div>

              {/* Quick Navigation Cards */}
              <div
                className="not-found-quick-links text-start"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                {/* Card 1 */}
                <Link
                  href="/products"
                  className="quick-link-card"
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "26px 22px",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        backgroundColor: "#fee2e2",
                        color: "#cb0000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <Package size={22} />
                    </div>
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: "8px",
                        fontFamily: "var(--font-manrope, 'Manrope', sans-serif)",
                      }}
                    >
                      Dyeing Machinery
                    </h4>
                    <p
                      style={{
                        fontSize: "13.5px",
                        color: "#64748b",
                        margin: 0,
                        lineHeight: 1.55,
                        fontFamily: "var(--font-dmsans, 'DM Sans', sans-serif)",
                      }}
                    >
                      Browse ECO+ Soft Flow, Rapid Jet, Sample and Weight Reduction machines.
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: "16px",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#cb0000",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>

                {/* Card 2 */}
                <Link
                  href="/about-us"
                  className="quick-link-card"
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "26px 22px",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        backgroundColor: "#fee2e2",
                        color: "#cb0000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <Home size={22} />
                    </div>
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: "8px",
                        fontFamily: "var(--font-manrope, 'Manrope', sans-serif)",
                      }}
                    >
                      About Anjani
                    </h4>
                    <p
                      style={{
                        fontSize: "13.5px",
                        color: "#64748b",
                        margin: 0,
                        lineHeight: 1.55,
                        fontFamily: "var(--font-dmsans, 'DM Sans', sans-serif)",
                      }}
                    >
                      Discover 36+ years of engineering excellence and global presence.
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: "16px",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#cb0000",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>Read Our Story</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>

                {/* Card 3 */}
                <Link
                  href="/contact-us"
                  className="quick-link-card"
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "26px 22px",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        backgroundColor: "#fee2e2",
                        color: "#cb0000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <PhoneCall size={22} />
                    </div>
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#0f172a",
                        marginBottom: "8px",
                        fontFamily: "var(--font-manrope, 'Manrope', sans-serif)",
                      }}
                    >
                      Get In Touch
                    </h4>
                    <p
                      style={{
                        fontSize: "13.5px",
                        color: "#64748b",
                        margin: 0,
                        lineHeight: 1.55,
                        fontFamily: "var(--font-dmsans, 'DM Sans', sans-serif)",
                      }}
                    >
                      Contact our sales, technical support, or visit our GIDC facility.
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: "16px",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#cb0000",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>Contact Us</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              </div>

              {/* Direct WhatsApp Callout */}
              <div
                style={{
                  marginTop: "36px",
                  padding: "16px 22px",
                  borderRadius: "12px",
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <MessageCircle size={20} color="#16a34a" />
                <span style={{ fontSize: "14px", color: "#166534", fontWeight: 500 }}>
                  Need immediate assistance with a machine?
                </span>
                <a
                  href="https://wa.me/917096007670"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#15803d",
                    textDecoration: "underline",
                  }}
                >
                  Chat with our engineers on WhatsApp (+91 7096 007 670)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
