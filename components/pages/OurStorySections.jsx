// Next.js-compatible JSX converted from the supplied static page markup.
import React from "react";

export function Section1({ bannerTitle, bannerImage }) {
  const title = bannerTitle || "The Story of ANJANI INDUSTRIES";
  const image = bannerImage || "/assets/img/our-story-banner.jpg";

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

export function Section2({ redBoxTitle, redBoxSubtitle }) {
  const title =
    redBoxTitle ||
    "The journey of ANJANI INDUSTRIES began in 1990,<br />when Shri Kiranbhai Patel established Anjani Machines Pvt. Ltd.";
  const subtitle =
    redBoxSubtitle ||
    "with a vision to manufacture high-quality textile dyeing and processing machinery for the growing textile industry.";

  return (
    <>
      <div className="about-page-section mb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="red-box-content">
                <h2 dangerouslySetInnerHTML={{ __html: title }} />
                <h4 dangerouslySetInnerHTML={{ __html: subtitle }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Section3({ timeline = [], timelineTitle }) {
  const sectionTitle = timelineTitle || "The Story of ANJANI INDUSTRIES";

  return (
    <>
      <div className="timeline mb-80">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb-4">
                <h2 className="mb-2">{sectionTitle}</h2>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="anjani-timeline">
                {timeline.map((item, index) => (
                  <div
                    key={item._id || item.id || index}
                    className={`anjani-timeline-item ${item.isLarge ? "large" : ""}`}
                  >
                    <div className="anjani-year">{item.year}</div>
                    <div
                      className="anjani-timeline-heading"
                      dangerouslySetInnerHTML={{ __html: item.heading || "" }}
                    />
                    <div
                      className="anjani-timeline-description"
                      dangerouslySetInnerHTML={{ __html: item.description || "" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function OurStorySections({ pageData = {}, timeline = [] }) {
  return (
    <>
      <Section1
        bannerTitle={pageData.bannerTitle}
        bannerImage={pageData.bannerImage}
      />
      <Section2
        redBoxTitle={pageData.redBoxTitle}
        redBoxSubtitle={pageData.redBoxSubtitle}
      />
      <Section3
        timeline={timeline}
        timelineTitle={pageData.timelineTitle}
      />
    </>
  );
}
