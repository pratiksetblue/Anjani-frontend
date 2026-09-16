// Next.js-compatible JSX converted from the supplied static page markup.
import React from "react";

export function Section1({ bannerTitle, bannerImage }) {
  const title = bannerTitle || "Our Core Values & Ethics";
  const image = bannerImage || "/assets/img/values-banner.jpg";

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

export function Section2({ entrepreneurial }) {
  const title = entrepreneurial?.title || "Entrepreneurial Spirit";
  const subtitle = entrepreneurial?.subtitle || "Thinking Beyond Boundaries";
  const description =
    entrepreneurial?.description ||
    "We embrace innovation, encourage creative thinking, and continuously pursue new opportunities to improve our products, processes, and customer experience.";

  return (
    <>
      <div className="about-page-section mb-80">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12">
              <div className="red-box-content">
                <div className="row align-items-center">
                  <div className="col-lg-6 text-lg-center text-start">
                    <h2>{title}</h2>
                  </div>
                  <div className="col-lg-6 values-border">
                    <h4>{subtitle}</h4>
                    <p className="text-white mb-0" dangerouslySetInnerHTML={{ __html: description }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Section3({ family }) {
  const title = family?.title || "One Anjani Family";
  const values =
    Array.isArray(family?.values) && family.values.length > 0
      ? family.values
      : [
          {
            icon: "/assets/img/icon/core_value/core_value1.png",
            title: "Growing Together, Succeeding Together",
            desc: "We believe every employee, customer, supplier, and business partner is part of the Anjani family. Through trust, collaboration, and mutual respect, we build lasting relationships and achieve shared success.",
          },
          {
            icon: "/assets/img/icon/core_value/core_value2.png",
            title: "Innovation",
            desc: "We continuously develop advanced technologies to create efficient, reliable, and sustainable textile processing solutions.",
          },
        ];

  return (
    <>
      <div className="about-page-section mb-80">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb-4">
                <h2 className="mb-5 red">{title}</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {values.map((v, i) => (
              <div key={i} className="col-lg-6">
                <div className="velue-box">
                  <img alt="" src={v.icon || "/assets/img/icon/core_value/core_value1.png"} />
                  <div>
                    <h4>{v.title}</h4>
                    <p dangerouslySetInnerHTML={{ __html: v.desc }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function Section4({ qualityIntegrity }) {
  const qualityTitle = qualityIntegrity?.qualityTitle || "Quality";
  const qualityDesc =
    qualityIntegrity?.qualityDesc ||
    "We never compromise on quality and strive for excellence in every machine we manufacture.";
  const integrityTitle = qualityIntegrity?.integrityTitle || "Integrity";
  const integrityDesc =
    qualityIntegrity?.integrityDesc ||
    "We conduct our business with honesty, transparency, and professionalism.";
  const image = qualityIntegrity?.image || "/assets/img/quality.jpg";

  return (
    <>
      <div className="mb-50 inner-contact-section two">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="section-title text-left mb-4">
                <h2>{qualityTitle}</h2>
                <p className="pt-2" dangerouslySetInnerHTML={{ __html: qualityDesc }} />
              </div>
              <div className="section-title text-left mb-4">
                <h5>{integrityTitle}</h5>
                <p className="pt-2" dangerouslySetInnerHTML={{ __html: integrityDesc }} />
              </div>
            </div>
            <div className="col-lg-6">
              <img alt="" className="w-100" src={image} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Section5({ customerCommitment }) {
  const title = customerCommitment?.title || "Customer Commitment";
  const subtitle =
    customerCommitment?.subtitle ||
    "We build long-term partnerships by delivering dependable products and exceptional after-sales support.";
  const ethics =
    Array.isArray(customerCommitment?.ethics) && customerCommitment.ethics.length > 0
      ? customerCommitment.ethics
      : [
          { title: "Ethics Of Anjani Industries", desc: "Treat people as you want to be treated." },
          { title: "Respect for others", desc: "Treat people as you want to be treated." },
          { title: "Integrity and honesty", desc: "Tell the truth and avoid any wrongdoing to the best of your ability." },
          { title: "Justice", desc: "Make sure you’re objective and fair and don’t disadvantage others." },
          { title: "Lawfulness", desc: "Know and follow the law – always." },
          { title: "Competence and accountability", desc: "Work hard and be responsible for your work." },
          { title: "Teamwork", desc: "Collaborate and ask for help." },
        ];

  return (
    <>
      <div className="mb-50 values-ethics-section">
        <div className="container-fluid">
          <div className="row justify-content-center wow animate fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
            <div className="col-xl-12 col-lg-12 col-md-8">
              <div className="section-title text-center mb-5">
                <h2>{title}</h2>
                <p className="pt-2">{subtitle}</p>
              </div>
            </div>
          </div>
          <div className="row">
            {ethics.map((item, i) => (
              <div key={i} className="col-lg-3">
                <div className="customer-box">
                  <div>
                    <h4>{item.title}</h4>
                    <p className="mb-0">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function ValuesEthicsSections({ pageData = {} }) {
  return (
    <>
      <Section1
        bannerTitle={pageData.bannerTitle}
        bannerImage={pageData.bannerImage}
      />
      <Section2 entrepreneurial={pageData.entrepreneurial} />
      <Section3 family={pageData.family} />
      <Section4 qualityIntegrity={pageData.qualityIntegrity} />
      <Section5 customerCommitment={pageData.customerCommitment} />
    </>
  );
}
