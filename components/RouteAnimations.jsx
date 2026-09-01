"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    const initWow = () => {
      if (cancelled || !window.WOW) return;

      // Stop the previous instance so route changes do not create duplicate listeners.
      if (window.__anjaniWow && typeof window.__anjaniWow.stop === "function") {
        try {
          window.__anjaniWow.stop();
        } catch (_) {}
      }

      const nodes = document.querySelectorAll("main .wow");

      // Reset route elements while keeping them hidden. Do NOT remove visibility here;
      // removing it causes the one-frame flash/blink before WOW starts.
      nodes.forEach((node) => {
        node.classList.remove("animated");
        node.style.visibility = "hidden";
        node.style.removeProperty("animation-name");
      });

      const wow = new window.WOW({
        boxClass: "wow",
        animateClass: "animated",
        offset: 0,
        mobile: true,
        live: false,
      });

      wow.init();
      window.__anjaniWow = wow;

      // Ask WOW to evaluate the current viewport immediately.
      if (typeof wow.scrollHandler === "function") wow.scrollHandler();
      if (typeof wow.scrollCallback === "function") wow.scrollCallback();
    };

    // If WOW is already loaded (normal route navigation), start on next paint.
    if (window.WOW) {
      requestAnimationFrame(initWow);
    } else {
      // First page load: initialize the exact moment wow.min.js finishes loading.
      window.addEventListener("anjani:wow-ready", initWow, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("anjani:wow-ready", initWow);
    };
  }, [pathname]);

  return null;
}
