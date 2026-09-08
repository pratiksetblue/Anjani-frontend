"use client";

import { useState } from "react";
import "./ecard.css";

export default function EcardPage() {
  const [flipped, setFlipped] = useState(false);

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

    const vcf = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Patel;Dhruv;;;",
      "FN:Dhruv Patel",
      "ORG:Anjani Industries",
      "TITLE:The Dyeing Machine Company",
      "TEL;TYPE=CELL:+919979303570",
      "TEL;TYPE=WORK:+918154888370",
      "EMAIL;TYPE=INTERNET:dhruv@anjaniindustries.in",
      "EMAIL;TYPE=WORK:info@anjaniindustries.in",
      "URL:https://www.anjaniindustries.in",
      "ADR;TYPE=WORK:;;Plot No. 983 & 984, Road No. 58, GIDC Sachin;Surat;Gujarat;394230;India",
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vcf], {
      type: "text/vcard;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "Dhruv-Patel-Anjani-Industries.vcf";

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <main className="ecard-page">
      <h1>Anjani Industries</h1>

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
              src="/assets/img/front.png"
              alt="Anjani Industries visiting card front"
            />
          </section>

          <section className="ecard-face ecard-back">
            <img
              src="/assets/img/back.png"
              alt="Anjani Industries visiting card back"
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
        <a
          className="ecard-action ecard-primary"
          href="tel:+919979303570"
        >
          Call
        </a>

        <a
          className="ecard-action"
          href="mailto:dhruv@anjaniindustries.in"
        >
          Email
        </a>

        <a
          className="ecard-action"
          href="https://www.anjaniindustries.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          Website
        </a>

        <a
          className="ecard-action"
          href="https://maps.app.goo.gl/C7v1m2T8Y1cZBWNTA"
          target="_blank"
          rel="noopener noreferrer"
        >
          Location
        </a>

        <button
          className="ecard-action"
          type="button"
          onClick={saveContact}
        >
          Save Contact
        </button>
      </nav>

      <p className="ecard-credit">
        Tap once for the reverse side and again to return.
      </p>
    </main>
  );
}