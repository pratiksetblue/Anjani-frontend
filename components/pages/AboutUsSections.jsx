// Next.js-compatible JSX converted from the supplied static page markup.
import React from "react";

export function Section1({ bannerTitle, bannerImage }) {
  const title = bannerTitle || "About ANJANI INDUSTRIES";
  const image = bannerImage || "/assets/img/about-banner.jpg";

  return (
    <>
      <div className="breadcrumb-section">
        <div className="breadcrumb-content-wrap">
          <div className="container">
            <div className="row">
              <div className="col-xl-9 col-lg-10">
                <div className="breadcrumb-content">
                  <h1>{title}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="breadcrumb-img">
          <img alt="" src={image} />
        </div>
      </div>
    </>
  );
}

export function Section2({ redBoxTitle, redBoxSubtitle, introParagraphs }) {
  const title = redBoxTitle || "Established in 1990, ANJANI INDUSTRIES";
  const subtitle =
    redBoxSubtitle ||
    "is one of India’s leading manufacturers of textile dyeing and processing machinery, backed by over 36 years of engineering excellence.";
  const paragraphs =
    Array.isArray(introParagraphs) && introParagraphs.length > 0
      ? introParagraphs
      : [
          "Since our inception, we have been committed to delivering innovative, reliable, and energy-efficient textile processing solutions that empower manufacturers to enhance productivity, improve dyeing quality, and reduce operating costs.",
          "We specialize in the design, engineering, and manufacturing of technologically advanced textile dyeing machinery that combines precision engineering, robust construction, and intelligent automation to meet the evolving demands of the global textile industry.",
        ];

  return (
    <>
      <div className="about-page-section mb-80">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="red-box-content">
                <h2 dangerouslySetInnerHTML={{ __html: title }} />
                <h4 dangerouslySetInnerHTML={{ __html: subtitle }} />
              </div>
              <div className="about-box-padding">
                {paragraphs.map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Section3({ products }) {
  const title = products?.title || "Our Products";
  const subtitle = products?.subtitle || "Our comprehensive product portfolio includes:";
  const items =
    Array.isArray(products?.items) && products.items.length > 0
      ? products.items
      : [
          "Low Liquor Ratio ECO+ Soft Flow Dyeing Machines",
          "Weight Reduction (Scouring) Machines",
          "U-Type Jet Dyeing Machines",
          "Caustic Recovery Plants",
          "Long Tube Rapid Jet Dyeing Machines",
          "Customized Textile Processing Machinery",
        ];
  const footerText =
    products?.footerText ||
    "Every machine is meticulously engineered to minimize water, steam, and power consumption while maximizing productivity, reducing processing time, and delivering consistent dyeing performance.";

  return (
    <>
      <div className="about-page-section mb-80">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb-4">
                <h2 className="mb-2">{title}</h2>
                <h6>{subtitle}</h6>
              </div>
            </div>
          </div>
          <div className="row">
            {items.map((item, idx) => (
              <div key={idx} className="col-lg-6">
                <div className="about-pro-lit">{item}</div>
              </div>
            ))}
          </div>
          {footerText && (
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center mb-4 italic-font">
                  <p dangerouslySetInnerHTML={{ __html: footerText }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function Section4({ manufacturing }) {
  const title = manufacturing?.title || "Manufacturing Excellence";
  const image = manufacturing?.image || "/assets/img/Manufacturing.jpg";
  const paragraphs =
    Array.isArray(manufacturing?.paragraphs) && manufacturing.paragraphs.length > 0
      ? manufacturing.paragraphs
      : [
          "Our corporate headquarters and state-of-the-art manufacturing facility are located in Surat, Gujarat, India, spanning over 45,000 sq. ft. Equipped with modern manufacturing infrastructure, advanced R&D capabilities, precision machining, stringent quality control systems, and dedicated after-sales technical support, we deliver complete textile processing solutions under one roof.",
          "Every stage of manufacturing—from design and fabrication to assembly, testing, and commissioning—is carried out with strict adherence to international quality standards to ensure long-lasting performance and reliability.",
        ];

  return (
    <>
      <div className="home1-about-section">
        <div className="container-fluid">
          <div className="row align-items-center g-0">
            <div className="col-lg-6 wow animate fadeInRight" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="about-img">
                <img alt="" className="w-100" src={image} />
              </div>
            </div>
            <div className="col-lg-6 wow animate fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="about-full-box-page-left">
                <div className="section-title mb-3">
                  <h2>{title}</h2>
                </div>
                <div className="about-content">
                  {paragraphs.map((p, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Section5({ innovation }) {
  const title = innovation?.title || "Innovation Driven by Experience";
  const image = innovation?.image || "/assets/img/Experience.jpg";
  const paragraphs =
    Array.isArray(innovation?.paragraphs) && innovation.paragraphs.length > 0
      ? innovation.paragraphs
      : [
          "For over 36 years, Anjani Industries has continuously invested in research, product development, and engineering innovation to create machinery that meets the changing needs of modern textile processors.",
          "Our focus on sustainable engineering enables customers to reduce water, steam, energy, and chemical consumption while achieving superior dyeing quality and lower production costs.",
          "Today, textile manufacturers across India and international markets trust Anjani Industries for dependable machinery, technical expertise, and responsive after-sales support.",
        ];

  return (
    <>
      <div className="home1-about-section mb-80">
        <div className="container-fluid">
          <div className="row align-items-center g-0">
            <div className="col-lg-6 wow animate fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="about-full-box-page-right">
                <div className="section-title mb-3">
                  <h2>{title}</h2>
                </div>
                <div className="about-content">
                  {paragraphs.map((p, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6 wow animate fadeInRight" data-wow-delay="200ms" data-wow-duration="1500ms">
              <div className="about-img">
                <img alt="" className="w-100" src={image} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Section6({ quality }) {
  const title = quality?.title || "Quality Assurance";
  const subtitle =
    quality?.subtitle || "As an ISO 9001:2015 Certified Company, quality is at the heart of everything we do.";
  const description =
    quality?.description ||
    "Every machine undergoes rigorous quality inspections and performance testing before dispatch, ensuring it meets our uncompromising standards for reliability, efficiency, and durability.";
  const leadershipImage = quality?.leadershipImage || "/assets/img/dhruv-patel.jpg";
  const leadershipTitle = quality?.leadershipTitle || "Leadership Message";
  const leadershipQuote =
    quality?.leadershipQuote ||
    "“At Anjani Industries, we never compromise on the quality of our products. Our commitment is to deliver innovative textile dyeing solutions that create lasting value for our customers through quality, technology, and exceptional service.”";
  const leadershipAuthor = quality?.leadershipAuthor || "- Dhruv Patel, Owner";

  return (
    <>
      <div className="mb-80">
        <div className="container">
          <div className="row justify-content-center wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="col-xl-12 col-lg-12">
              <div className="section-title text-center mb-4">
                <h2 className="mb-2">{title}</h2>
                <h6 className="mb-0">{subtitle}</h6>
                <p dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="leadership-box">
            <div className="row align-items-center g-0">
              <div className="col-lg-4">
                <img alt="" className="w-100" src={leadershipImage} />
              </div>
              <div className="col-lg-8">
                <div className="p-5 text-white">
                  <h3 className="text-white">{leadershipTitle}</h3>
                  <p className="text-white" dangerouslySetInnerHTML={{ __html: leadershipQuote }} />
                  <h5 className="text-white">{leadershipAuthor}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Section7({ whyTrust }) {
  const title = whyTrust?.title || "Why Textile manufacturers\ntrust Anjani Industries?";
  const reasons =
    Array.isArray(whyTrust?.reasons) && whyTrust.reasons.length > 0
      ? whyTrust.reasons
      : [
          { title: "36+ Years of Engineering Excellence", desc: "As an ISO 9001:2015 Certified Company, quality is at the heart of everything we do." },
          { title: "Quality • Technology • Metrology • Service", desc: "The four pillars that drive everything we do." },
          { title: "ISO 9001:2015 Certified Company", desc: "Committed to international quality standards." },
          { title: "45,000 sq. ft. Modern Manufacturing Facility", desc: "Equipped with advanced manufacturing and testing infrastructure." },
          { title: "Innovative & Energy-Efficient Dyeing Machinery", desc: "Designed to reduce water, steam, power, and operating costs." },
          { title: "Dedicated Research & Development", desc: "Continuously developing technologies for the evolving textile industry." },
          { title: "Reliable After-Sales Technical Support", desc: "Prompt service and long-term customer assistance." },
          { title: "Trusted by Textile Manufacturers Across India & International Markets", desc: "Building lasting partnerships through quality and performance." },
        ];

  return (
    <>
      <div className="mb-80 inner-contact-section two">
        <div className="container-fluid">
          <div className="row justify-content-center wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="col-xl-12 col-lg-12 col-md-8">
              <div className="section-title text-left mb-4">
                <h2>
                  Why Textile manufacturers
                  <br />
                  <div className="red">trust Anjani Industries?</div>
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              {reasons.slice(0, 4).map((r, i) => (
                <div key={i} className="manufacturers-list">
                  <h5>{r.title}</h5>
                  <p>{r.desc}</p>
                </div>
              ))}
            </div>
            <div className="col-lg-6">
              {reasons.slice(4).map((r, i) => (
                <div key={i} className="manufacturers-list">
                  <h5>{r.title}</h5>
                  <p>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Section8({ hse }) {
  const title = hse?.title || "Health, Safety & Environment";
  const paragraphs =
    Array.isArray(hse?.paragraphs) && hse.paragraphs.length > 0
      ? hse.paragraphs
      : [
          "The safety of our employees, customers, and manufacturing operations is our highest priority.",
          "We maintain a safe and healthy workplace through modern manufacturing practices, advanced production technologies, regular safety training, and strict quality and safety procedures.",
          "Our commitment to environmental responsibility is reflected in the development of resource-efficient textile processing machinery that helps reduce water, energy, and steam consumption, contributing to a more sustainable textile industry.",
        ];

  return (
    <>
      <div className="mb-40">
        <div className="container-fluid">
          <div className="row justify-content-center wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="col-xl-12 col-lg-12 col-md-8">
              <div className="section-title text-left mb-4">
                <h2>{title}</h2>
              </div>
              {paragraphs.map((p, i) => (
                <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Section9({ commitment }) {
  const title = commitment?.title || "Our Commitment";
  const subtitle = commitment?.subtitle || "Quality • Technology • Metrology • Service";
  const description =
    commitment?.description ||
    "These four pillars define everything we do and continue to guide Anjani Industries in delivering world-class textile dyeing and processing solutions for customers across the globe.";

  return (
    <>
      <div className="mb-80">
        <div className="container-fluid">
          <div className="row justify-content-center wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="col-xl-12 col-lg-12 col-md-8">
              <div className="section-title text-left mb-4">
                <h2>{title}</h2>
              </div>
              <h6>{subtitle}</h6>
              <p dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AboutUsSections({ pageData = {} }) {
  return (
    <>
      <Section1
        bannerTitle={pageData.bannerTitle}
        bannerImage={pageData.bannerImage}
      />
      <Section2
        redBoxTitle={pageData.redBoxTitle}
        redBoxSubtitle={pageData.redBoxSubtitle}
        introParagraphs={pageData.introParagraphs}
      />
      <Section3 products={pageData.products} />
      <Section4 manufacturing={pageData.manufacturing} />
      <Section5 innovation={pageData.innovation} />
      <Section6 quality={pageData.quality} />
      <Section7 whyTrust={pageData.whyTrust} />
      <Section8 hse={pageData.hse} />
      <Section9 commitment={pageData.commitment} />
    </>
  );
}
