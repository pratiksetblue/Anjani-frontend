"use client";

import { useState, useEffect } from "react";
import "./ecard.css";

const defaultEcard = {
  name: "Dhruv Patel",
  title: "Owner",
  organization: "Anjani Industries",
  tagline: "The Dyeing Machine Company",
  frontImage: "/assets/img/front.png",
  backImage: "/assets/img/back.png",
  phoneMobile: "+91 9979 303 570",
  phoneOffice: "+91 8154 888 370",
  emailDirect: "dhruv@anjaniindustries.in",
  emailGeneral: "info@anjaniindustries.in",
  website: "https://www.anjaniindustries.in",
  mapUrl: "https://maps.app.goo.gl/C7v1m2T8Y1cZBWNTA",
  address: "Plot No. 983 & 984, Road No. 58, GIDC Sachin, Surat- 394 230, Gujarat, India."
};

export default function EcardPage() {
  const [cardData, setCardData] = useState(defaultEcard);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    fetch("/api/pages/ecard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.name) {
          setCardData({ ...defaultEcard, ...data });
        }
      })
      .catch(() => {});
  }, []);

  const flipCard = () => {
    setFlipped((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flipCard();
    }
  };

  const saveContact = (e) => {
    e.stopPropagation();

    const nameParts = (cardData.name || "Dhruv Patel").split(" ");
    const firstName = nameParts[0] || "Dhruv";
    const lastName = nameParts.slice(1).join(" ") || "Patel";
    const cleanMobile = (cardData.phoneMobile || "+919979303570").replace(/\s+/g, "");
    const cleanOffice = (cardData.phoneOffice || "+918154888370").replace(/\s+/g, "");

    const vcf = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${lastName};${firstName};;;`,
      `FN:${cardData.name || "Dhruv Patel"}`,
      `ORG:${cardData.organization || "Anjani Industries"}`,
      `TITLE:${cardData.tagline || cardData.title || "The Dyeing Machine Company"}`,
      `TEL;TYPE=CELL:${cleanMobile}`,
      `TEL;TYPE=WORK:${cleanOffice}`,
      `EMAIL;TYPE=INTERNET:${cardData.emailDirect || "dhruv@anjaniindustries.in"}`,
      `EMAIL;TYPE=WORK:${cardData.emailGeneral || "info@anjaniindustries.in"}`,
      `URL:${cardData.website || "https://www.anjaniindustries.in"}`,
      `ADR;TYPE=WORK:;;${cardData.address || "Plot No. 983 & 984, Road No. 58, GIDC Sachin;Surat;Gujarat;394230;India"}`,
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vcf], {
      type: "text/vcard;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${(cardData.name || "Dhruv-Patel").replace(/\s+/g, "-")}-Anjani-Industries.vcf`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const phoneHref = (cardData.phoneMobile || "+919979303570").replace(/\s+/g, "");
  const emailHref = cardData.emailDirect || "dhruv@anjaniindustries.in";

  return (
    <main className="ecard-page">
      <h1>{cardData.organization || "Anjani Industries"}</h1>

      <div className="ecard-scene">
        <div
          className={`ecard-card ${flipped ? "is-flipped" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Flip visiting card"
          aria-pressed={flipped}
          onClick={flipCard}
          onKeyDown={handleKeyDown}
        >
          <section className="ecard-face ecard-front">
            <img
              src={cardData.frontImage || "/assets/img/front.png"}
              alt={`${cardData.organization} visiting card front`}
            />
          </section>

          <section className="ecard-face ecard-back">
            <img
              src={cardData.backImage || "/assets/img/back.png"}
              alt={`${cardData.organization} visiting card back`}
            />
          </section>
        </div>
      </div>

      <div className="ecard-hint">
        <span className="ecard-flip-icon">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M7.1 6.2A8 8 0 0 1 19.3 9H17a1 1 0 1 0 0 2h4a1 1 0 0 0 1-1V6a1 1 0 1 0-2 0v1.3A10 10 0 0 0 5.7 4.8a1 1 0 1 0 1.4 1.4ZM2 14v4a1 1 0 1 0 2 0v-1.3a10 10 0 0 0 14.3 2.5 1 1 0 0 0-1.4-1.4A8 8 0 0 1 4.7 15H7a1 1 0 1 0 0-2H3a1 1 0 0 0-1 1Z"
            />
          </svg>
        </span>
        Tap / click card to flip
      </div>

      <nav className="ecard-actions">
        <a className="ecard-action ecard-primary" href={`tel:${phoneHref}`}>
          Call
        </a>

        <a className="ecard-action" href={`mailto:${emailHref}`}>
          Email
        </a>

        <a
          className="ecard-action"
          href={cardData.website || "https://www.anjaniindustries.in"}
          target="_blank"
          rel="noopener noreferrer"
        >
          Website
        </a>

        <a
          className="ecard-action"
          href={cardData.mapUrl || "https://maps.app.goo.gl/C7v1m2T8Y1cZBWNTA"}
          target="_blank"
          rel="noopener noreferrer"
        >
          Location
        </a>

        <button className="ecard-action" type="button" onClick={saveContact}>
          Save Contact
        </button>
      </nav>

      <p className="ecard-credit">
        Tap once for the reverse side and again to return.
      </p>
    </main>
  );
}
