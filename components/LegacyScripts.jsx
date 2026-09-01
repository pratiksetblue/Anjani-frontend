"use client";
import { useEffect } from "react";

const scripts = [
  "/assets/js/jquery-3.7.1.min.js",
  "/assets/js/jquery-ui.js",
  "/assets/js/bootstrap.min.js",
  "/assets/js/popper.min.js",
  "/assets/js/swiper-bundle.min.js",
  "/assets/js/slick.js",
  "/assets/js/waypoints.min.js",
  "/assets/js/jquery.counterup.min.js",
  "/assets/js/ScrollSmoother.min.js",
  "/assets/js/jquery.marquee.min.js",
  "/assets/js/gsap.min.js",
  "/assets/js/ScrollTrigger.min.js",
  "/assets/js/jquery.fancybox.min.js",
  "/assets/js/custom.js"
];

export default function LegacyScripts() {
  useEffect(() => {
    let cancelled = false;

    const load = (src) =>
      new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[data-legacy-src="${src}"]`);

        if (existing) {
          if (existing.dataset.loaded === "true") return resolve();
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", reject, { once: true });
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        script.dataset.legacySrc = src;
        script.onload = () => {
          script.dataset.loaded = "true";
          resolve();
        };
        script.onerror = reject;
        document.body.appendChild(script);
      });

    (async () => {
      // WOW has no dependency on the rest of the legacy bundle, so load it first.
      // This makes above-the-fold animations start immediately without a flash.
      await load("/assets/js/wow.min.js");
      if (cancelled) return;
      window.dispatchEvent(new Event("anjani:wow-ready"));

      // Load all other legacy plugins afterwards in their original order.
      for (const src of scripts) {
        if (cancelled) return;
        await load(src);
      }
    })().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
