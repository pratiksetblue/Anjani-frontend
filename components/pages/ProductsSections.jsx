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

export function Section1() {
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
                <h1>
                  Advance Textile
                  <br />
                  Dyeing &amp; Processing Machines
                </h1>
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

export function Section3() {
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
              <h2>Why Choose ANJANI?</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="customer-box inn-probox">
              <div>
                <div className="pro-icon">
                  <img
                    alt="36+ Years of Engineering Experience"
                    src="/assets/img/icon/icon1.png"
                  />
                </div>
                <h4>
                  36+ Years of
                  <br />
                  Engineering Experience
                </h4>
                <p className="mb-0">
                  Manufacturing textile processing machinery since 1990.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="customer-box inn-probox">
              <div>
                <div className="pro-icon">
                  <img
                    alt="Advanced Fabric Handling"
                    src="/assets/img/icon/icon2.png"
                  />
                </div>
                <h4>
                  Advanced Fabric
                  <br />
                  Handling
                </h4>
                <p className="mb-0">
                  Designed for controlled and gentle fabric movement.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="customer-box inn-probox">
              <div>
                <div className="pro-icon">
                  <img
                    alt="Energy & Resource Efficiency"
                    src="/assets/img/icon/icon3.png"
                  />
                </div>
                <h4>
                  Energy &amp; Resource
                  <br />
                  Efficiency
                </h4>
                <p className="mb-0">
                  Engineered to reduce water, steam, power and processing time.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="customer-box inn-probox">
              <div>
                <div className="pro-icon">
                  <img
                    alt="PLC-Based Automation"
                    src="/assets/img/icon/icon4.png"
                  />
                </div>
                <h4>
                  PLC-Based
                  <br />
                  Automation
                </h4>
                <p className="mb-0">
                  Precise and repeatable process control.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="customer-box inn-probox">
              <div>
                <div className="pro-icon">
                  <img
                    alt="Robust Construction"
                    src="/assets/img/icon/icon5.png"
                  />
                </div>
                <h4>
                  Robust
                  <br />
                  Construction
                </h4>
                <p className="mb-0">
                  Designed for continuous industrial operation.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="customer-box inn-probox">
              <div>
                <div className="pro-icon">
                  <img
                    alt="Technical Support"
                    src="/assets/img/icon/icon6.png"
                  />
                </div>
                <h4>
                  Technical
                  <br />
                  Support
                </h4>
                <p className="mb-0">
                  Sales and service support across India and international markets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsSections({ initialProducts = [] }) {
  return (
    <>
      <Section1 />
      <Section2 initialProducts={initialProducts} />
      <Section3 />
    </>
  );
}
