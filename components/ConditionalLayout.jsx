"use client";

import { usePathname } from "next/navigation";

import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";
import LegacyScripts from "./LegacyScripts";
import RouteAnimations from "./RouteAnimations";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  const isEcardPage = pathname === "/ecard";

  if (isEcardPage) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <>
      <BackToTop />
      <Header />

      <main>
        {children}
      </main>

      <Footer />
      <LegacyScripts />
      <RouteAnimations />
    </>
  );
}