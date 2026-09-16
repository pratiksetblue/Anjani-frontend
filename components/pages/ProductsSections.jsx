"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const ArrowIcon = () => (
  <svg className="arrow" height="23" viewBox="0 0 23 23" width="23" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M0.113861 0H22.9999V4.28425L4.32671 22.9997L0 18.7154L12.7524 6.08815L0.113861 6.20089V0Z" />
      <path d="M23 22.9996V8.56848L16.8516 14.6566V22.9996H23Z" />
    </g>
  </svg>
);

export function Section1({ bannerTitle }) {
  const title = bannerTitle || "Advance Textile<br />Dyeing &amp; Processing Machines";

  return (
    <div className="breadcrumb-section">
      <div className="breadcrumb-content-wrap">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-8 col-lg-9">
              <div className="breadcrumb-content">
                <ul className="breadcrumb-list">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>Products</li>
                </ul>
                <h1 dangerouslySetInnerHTML={{ __html: title }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Section2({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => console.error("Products error:", err));
  }, []);

  return (
    <div className="project-grid-page mb-100 mt-5">
      <div className="container-fluid">
        <div className="row gy-5 mb-70">
          {products.map((product, index) => (
            <div
              key={product.id || product.slug || index}
              className="col-lg-6 col-md-6 wow animate fadeInDown"
              data-wow-delay={`${((index % 4) + 1) * 200}ms`}
              data-wow-duration="1500ms"
            >
              <div className="project-card magnetic-item">
                <div className="project-img">
                  <Link href={`/${product.slug}`}>
                    <img alt={product.title} src={product.image} />
                  </Link>
                </div>
                <div className="project-content-wrap">
                  <div className="project-content">
                    <h3>
                      <Link href={`/${product.slug}`}>{product.title}</Link>
                    </h3>
                    {product.highlights && product.highlights.length > 0 && (
                      <ul>
                        {product.highlights.map((item, hIdx) => (
                          <li key={hIdx}>{item}</li>
                        ))}
                      </ul>
                    )}
                    <Link
                      className="primary-btn1 white-bg red-boder"
                      href={`/${product.slug}`}
                    >
                      <span>View Details</span>
                      <span>View Details</span>
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Section3({ whyChoose }) {
  const title = whyChoose?.title || "Why Choose ANJANI?";
  const cards =
    Array.isArray(whyChoose?.cards) && whyChoose.cards.length > 0
      ? whyChoose.cards
      : [
          {
            icon: "/assets/img/icon/icon1.png",
            title: "36+ Years of<br />Engineering Experience",
            desc: "Manufacturing textile processing machinery since 1990.",
          },
          {
            icon: "/assets/img/icon/icon2.png",
            title: "Advanced Fabric<br />Handling",
            desc: "Designed for controlled and gentle fabric movement.",
          },
          {
            icon: "/assets/img/icon/icon3.png",
            title: "Energy & Resource<br />Efficiency",
            desc: "Engineered to reduce water, steam, power and processing time.",
          },
          {
            icon: "/assets/img/icon/icon4.png",
            title: "Automation &<br />Process Control",
            desc: "Intelligent PLC automation for consistent batch-to-batch repeatability.",
          },
          {
            icon: "/assets/img/icon/icon5.png",
            title: "Robust Stainless<br />Steel Construction",
            desc: "Built with high-grade materials for durability and long operating life.",
          },
          {
            icon: "/assets/img/icon/icon6.png",
            title: "Dedicated<br />After-Sales Support",
            desc: "Prompt service, technical support, and genuine spare parts.",
          },
        ];

  return (
    <div className="mb-80 values-ethics-section">
      <div className="container-fluid">
        <div
          className="row justify-content-center wow animate fadeInDown"
          data-wow-delay="200ms"
          data-wow-duration="1500ms"
        >
          <div className="col-xl-12 col-lg-12 col-md-8">
            <div className="section-title text-center mb-5">
              <h2>{title}</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {cards.map((card, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 mb-4">
              <div className="customer-box inn-probox h-100">
                <div>
                  <div className="pro-icon">
                    <img alt={card.title?.replace(/<[^>]+>/g, '') || "Icon"} src={card.icon} />
                  </div>
                  <h4 dangerouslySetInnerHTML={{ __html: card.title }} />
                  <p className="mb-0">{card.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsSections({ initialProducts = [], pageData = {} }) {
  return (
    <>
      <Section1 bannerTitle={pageData.bannerTitle} />
      <Section2 initialProducts={initialProducts} />
      <Section3 whyChoose={pageData.whyChoose} />
    </>
  );
}
