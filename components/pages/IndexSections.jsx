"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const defaultProducts = [
  {
    title: "PLC Based Low Liquor Ratio ECO+ Soft Flow Dyeing Machine",
    href: "/plc-based-low-liquor-ratio-eco-soft-flow-dyeing-machine",
    image: "/assets/img/product/product1.jpg",
  },
  {
    title: "PLC Based Low Liquor Ratio Sample ECO+ Soft Flow Dyeing Machine",
    href: "/plc-based-low-liquor-ratio-sample-eco-soft-flow-dyeing-machine",
    image: "/assets/img/product/product2.jpg",
  },
  {
    title: "PLC Based U Type Rapid Jet Dyeing Machine",
    href: "/plc-based-u-type-rapid-jet-dyeing-machine",
    image: "/assets/img/product/product3.jpg",
  },
  {
    title: "PLC Based U Type Soft Flow Dyeing Machine",
    href: "/plc-based-u-type-soft-flow-dyeing-machine",
    image: "/assets/img/product/product4.jpg",
  },
  {
    title: "PLC Based U Type Sample Jet Dyeing Machine",
    href: "/plc-based-u-type-sample-jet-dyeing-machine",
    image: "/assets/img/product/product5.jpg",
  },
  {
    title: "PLC Based Long Tube Rapid Jet Dyeing Machine",
    href: "/plc-based-long-tube-rapid-jet-dyeing-machine",
    image: "/assets/img/product/product6.jpg",
  },
  {
    title: "Plc Based Long Tube Rapid Jet Dyeing - One Autoclave Two Tubes",
    href: "/plc-based-long-tube-double-tube-rapid-jet-dyeing-machine",
    image: "/assets/img/product/product7.jpg",
  },
  {
    title: "PLC Based Long Tube Soft Flow Dyeing Machine",
    href: "/plc-based-long-tube-soft-flow-dyeing-machine",
    image: "/assets/img/product/product8.jpg",
  },
  {
    title: "Plc Based Long Tube Rapid Jet Dyeing - Two Autoclave Two Tubes",
    href: "/plc-based-long-tube-with-double-tube-rapid-jet",
    image: "/assets/img/product/product9.jpg",
  },
  {
    title: "PLC Based Long Tube Sample Jet Dyeing Machine",
    href: "/plc-based-long-tube-sample-jet-dyeing-machine",
    image: "/assets/img/product/product10.jpg",
  },
  {
    title: "PLC Based Weight Reduction Machine with Caustic Recovery Unit",
    href: "/plc-based-weight-reduction-machine-with-caustic-recovery-unit",
    image: "/assets/img/product/product11.jpg",
  },
  {
    title: "Fully Automatic Caustic Recovery Plant",
    href: "/fully-automatic-caustic-recovery-plant",
    image: "/assets/img/product/product12.jpg",
  },
];

const defaultHome = {
  hero: {
    title: "Engineering the Future of Fabric Dyeing Machinery Since 1990",
    subtitle: "Delivering advanced fabric dyeing machinery trusted by textile manufacturers worldwide for over 36 years.",
    buttonText: "Learn More",
    buttonLink: "/about-us",
    videoDesktop: "/assets/video/main.mp4",
    videoMobile: "/assets/video/mobile.mp4",
  },
  about: {
    badge: "About Our Story",
    title: "Anjani – A Leading Manufacturer of Fabric Dyeing Machinery",
    highlight: "Established in 1990, Anjani Industries is one of India's leading manufacturers of textile dyeing and processing machinery, backed by over 36 years of engineering excellence.",
    productsHighlight: "Our comprehensive product portfolio includes Low Liquor Ratio ECO+ Soft Flow Dyeing Machines, U-Type Jet Dyeing Machines, Long Tube Rapid Jet Dyeing Machines, Weight Reduction (Scouring) Machines, Caustic Recovery Plants, and a wide range of customized textile processing machinery.",
    description: "Every machine is precision-engineered to optimize water, steam, and power consumption while improving productivity, reducing processing time, and ensuring consistent performance for modern textile manufacturers worldwide.",
    image: "/assets/img/home1/about-img.jpg",
  },
  counters: [
    { number: "36", suffix: "+", label: "Years of Industry Excellence" },
    { number: "45", suffix: "K", label: "Sq Ft Production Facility" },
    { number: "270", suffix: "", label: "Pcs Annual Production Capacity" },
  ],
  bannerImage: "/assets/img/home1/singleimg.jpg",
  certifications: [
    {
      image: "/assets/img/Certifications/gogreen.png",
      title: "GO GREEN",
      description: "Sustainable Manufacturing Commitment",
    },
    {
      image: "/assets/img/Certifications/iso.png",
      title: "ISO Certified",
      description: "Commitment to Quality & Excellence",
    },
    {
      image: "/assets/img/Certifications/year.png",
      title: "36 Years",
      description: "Decades of Manufacturing Excellence",
    },
    {
      image: "/assets/img/Certifications/outlook.png",
      title: "Industry Outlook",
      description: "Recognized Textile Machinery Manufacturer",
    },
  ],
};

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

/* =========================================================
   SECTION 1 - HERO
========================================================= */

export function Section1({ hero }) {
  return (
    <section className="home1-banner-section mb-80">
      <div className="container-full">
        <div className="banner-wrapper">
          <div className="video-c-box-only">
            <div className="video-overlay" />

            <video
              autoPlay
              className="main-video"
              loop
              muted
              playsInline
              src={hero?.videoDesktop || "/assets/video/main.mp4"}
            />

            <video
              autoPlay
              className="main-video-mobile"
              loop
              muted
              playsInline
              src={hero?.videoMobile || "/assets/video/mobile.mp4"}
            />

            <div className="banner-content-wrap">
              <div
                className="banner-content wow animate fadeInLeft"
                data-wow-delay="200ms"
                data-wow-duration="1500ms"
              >
                <h1>{hero?.title || "Engineering the Future of Fabric Dyeing Machinery Since 1990"}</h1>
              </div>
            </div>
          </div>

          <div className="hero-section-bottom">
            <div
              className="banner-content wow animate fadeInLeft"
              data-wow-delay="200ms"
              data-wow-duration="1500ms"
            >
              <p>{hero?.subtitle || "Delivering advanced fabric dyeing machinery trusted by textile manufacturers worldwide for over 36 years."}</p>

              <div className="btn-grp">
                <Link className="primary-btn1 white-bg" href={hero?.buttonLink || "/about-us"}>
                  <span>{hero?.buttonText || "Learn More"}</span>
                  <span>{hero?.buttonText || "Learn More"}</span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 2 - ABOUT
========================================================= */

export function Section2({ about }) {
  return (
    <section className="home1-about-section mb-80">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div
            className="col-lg-6 wow animate fadeInLeft"
            data-wow-delay="200ms"
            data-wow-duration="1500ms"
          >
            <div className="about-full-box">
              <div className="about-title-area">
                <div className="section-title">
                  <span>{about?.badge || "About Our Story"}</span>

                  <h2>{about?.title || "Anjani – A Leading Manufacturer of Fabric Dyeing Machinery"}</h2>
                </div>
              </div>

              <div className="about-content">
                <ul>
                  <li>
                    <p className="red fw-semibold">
                      {about?.highlight || "Established in 1990, Anjani Industries is one of India's leading manufacturers of textile dyeing and processing machinery, backed by over 36 years of engineering excellence."}
                    </p>

                    <p>
                      Our comprehensive product portfolio includes{" "}
                      <span className="red fw-semibold">
                        {about?.productsHighlight || "Low Liquor Ratio ECO+ Soft Flow Dyeing Machines, U-Type Jet Dyeing Machines, Long Tube Rapid Jet Dyeing Machines, Weight Reduction (Scouring) Machines, Caustic Recovery Plants,"}
                      </span>{" "}
                      and a wide range of customized textile processing machinery.
                    </p>

                    <p>
                      {about?.description || "Every machine is precision-engineered to optimize water, steam, and power consumption while improving productivity, reducing processing time, and ensuring consistent performance for modern textile manufacturers worldwide."}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className="col-lg-6 wow animate fadeInRight"
            data-wow-delay="200ms"
            data-wow-duration="1500ms"
          >
            <div className="about-img">
              <img
                src={about?.image || "/assets/img/home1/about-img.jpg"}
                alt="Anjani Industries"
                className="w-100"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 3 - COUNTER
========================================================= */

export function Section3({ counters }) {
  const list = counters && counters.length > 0 ? counters : defaultHome.counters;

  return (
    <section className="home1-counter-section mb-80">
      <div className="container">
        <div className="counter-wrap">
          <div className="row gy-4">
            {list.map((item, idx) => (
              <div
                key={idx}
                className={`col-lg-4 col-md-4 col-sm-6 col-12 ${
                  idx < list.length - 1 ? "divider" : ""
                } ${idx === 1 ? "d-flex justify-content-lg-center" : ""} ${
                  idx === 2 ? "d-flex justify-content-lg-center justify-content-md-end" : ""
                }`}
              >
                <div className="single-countdown">
                  <div className="number">
                    <h2 className="counter">{item.number}</h2>
                    {item.suffix && <span>{item.suffix}</span>}
                  </div>

                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 4 - IMAGE
========================================================= */

export function Section4({ bannerImage }) {
  return (
    <section className="product-box">
      <img
        src={bannerImage || "/assets/img/home1/singleimg.jpg"}
        alt="Anjani Industries"
      />
    </section>
  );
}

/* =========================================================
   SECTION 5 - PRODUCTS
========================================================= */

export function Section5({ products }) {
  const list = products && products.length > 0 ? products : defaultProducts;

  return (
    <section className="home1-project-section mb-80">
      <div className="container">
        <div className="row justify-content-center mb-20">
          <div className="col-xl-6 col-lg-7 col-md-8">
            <div
              className="section-title white text-center wow animate fadeInDown"
              data-wow-delay="200ms"
              data-wow-duration="1500ms"
            >
              <span>Our Specialities</span>
              <h2>Our Products</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="project-slider-area mb-50">
        <div className="row">
          <div className="col-lg-12">
            <Swiper
              className="home1-project-slider"
              modules={[Autoplay]}
              loop
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              slidesPerView={1}
              breakpoints={{
                576: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                992: {
                  slidesPerView: 3,
                },
                1200: {
                  slidesPerView: 4,
                },
              }}
            >
              {list.map((product) => (
                <SwiperSlide key={product.href || product.slug}>
                  <div className="project-card-wrap">
                    <Link
                      className="project-card"
                      href={product.href || `/${product.slug}`}
                    >
                      <div className="project-img">
                        <img
                          src={product.image}
                          alt={product.title}
                        />
                      </div>

                      <div className="project-content-wrap">
                        <div className="project-content">
                          <h3>{product.title}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center bounce_up">
            <Link className="primary-btn1 white-bg" href="/products">
              <span>View All Products</span>
              <span>View All Products</span>
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SECTION 6 - CERTIFICATIONS
========================================================= */

export function Section6({ certifications }) {
  const list = certifications && certifications.length > 0 ? certifications : defaultHome.certifications;

  return (
    <section className="home2-certification-section mb-80">
      <div className="container">
        <div
          className="section-title two text-center mb-40 wow animate fadeInDown"
          data-wow-delay="200ms"
          data-wow-duration="1500ms"
        >
          <h2>Our Certifications &amp; Achievements</h2>
        </div>

        <div className="row g-3">
          {list.map((item, index) => (
            <div
              key={item.title || index}
              className="col-lg-3 col-sm-6 col-6 wow animate fadeInDown"
              data-wow-delay={`${(index + 1) * 200}ms`}
              data-wow-duration="1500ms"
            >
              <div
                className={`certificate-card ${
                  index === 1
                    ? "border-right-mobile-none"
                    : index === 3
                    ? "border-right-none"
                    : ""
                }`}
              >
                <div className="certificate-logo">
                  <img src={item.image} alt={item.title} />
                </div>

                <h4 className="tag">{item.title}</h4>

                <h6>{item.description}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function IndexSections() {
  const [homeData, setHomeData] = useState(defaultHome);
  const [products, setProducts] = useState(defaultProducts);

  useEffect(() => {
    fetch("/api/home")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.hero) {
          setHomeData(data);
        }
      })
      .catch(() => {});

    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(
            data.map((p) => ({
              title: p.title,
              href: `/${p.slug}`,
              image: p.image,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Section1 hero={homeData.hero} />
      <Section2 about={homeData.about} />
      <Section3 counters={homeData.counters} />
      <Section4 bannerImage={homeData.bannerImage} />
      <Section5 products={products} />
      <Section6 certifications={homeData.certifications} />
    </>
  );
}