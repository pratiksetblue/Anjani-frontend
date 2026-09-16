"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [dashOffset, setDashOffset] = useState(307.876);
  const pathRef = useRef(null);
  const pathLengthRef = useRef(307.876);
  const pathname = usePathname();

  // Calculate and update scroll progress & visibility
  const updateScrollProgress = useCallback(() => {
    if (typeof window === "undefined") return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const maxScroll = scrollHeight - clientHeight;

    // Show button when scrolled more than 80px
    setIsVisible(scrollY > 80);

    // Update circular progress stroke
    if (maxScroll > 0) {
      const pathLength = pathLengthRef.current || 307.876;
      const progress = pathLength - (scrollY * pathLength) / maxScroll;
      setDashOffset(Math.max(0, Math.min(pathLength, progress)));
    }
  }, []);

  // Measure path length on mount / route change
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len && len > 0) {
          pathLengthRef.current = len;
        }
      } catch (e) {
        // Fallback circumference for radius 49: 2 * Math.PI * 49 = ~307.876
        pathLengthRef.current = 307.876;
      }
    }

    updateScrollProgress();

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [pathname, updateScrollProgress]);

  const scrollToTop = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Back to top"
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      className={`progress-wrap ${isVisible ? "active-progress" : ""}`}
      style={{
        cursor: "pointer",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <svg
        className="progress-circle svg-content"
        height="100%"
        viewBox="-1 -1 102 102"
        width="100%"
      >
        <path
          ref={pathRef}
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          style={{
            strokeDasharray: `${pathLengthRef.current} ${pathLengthRef.current}`,
            strokeDashoffset: dashOffset,
            transition: "stroke-dashoffset 15ms linear",
          }}
        />
      </svg>
      <svg
        className="arrow"
        height="25"
        viewBox="0 0 24 23"
        width="22"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M0.556131 11.4439L11.8139 0.186067L13.9214 2.29352L13.9422 20.6852L9.70638 20.7061L9.76793 8.22168L3.6064 14.4941L0.556131 11.4439Z" />
        <path d="M23.1276 11.4999L16.0288 4.40105L15.9991 10.4203L20.1031 14.5243L23.1276 11.4999Z" />
      </svg>
    </div>
  );
}

