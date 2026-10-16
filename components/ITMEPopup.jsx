
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const STORAGE_KEY = "anjani-itme-popup-dismissed";

export default function ITMEPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);

      if (dismissed !== "true") {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closePopup = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
    }

    setIsOpen(false);
  };

  if (!isReady || !isOpen) return null;

  return (
    <div
      className="itme-popup-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closePopup();
        }
      }}
    >
      <div
        className="itme-popup-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="NEXT INDIA ITME 2026 invitation"
      >
        <button
          type="button"
          className="itme-popup-close"
          onClick={closePopup}
          aria-label="Close invitation popup"
          title="Close"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        <div className="itme-popup-image-wrap">
  <img
    src="/assets/img/itme-invitation.jpeg"
    alt="Anjani Industries - NEXT INDIA ITME 2026 invitation"
    className="itme-popup-image"
    width="1080"
    height="1350"
  />
</div>
      </div>
    </div>
  );
}
