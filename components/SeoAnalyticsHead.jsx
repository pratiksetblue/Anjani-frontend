import React from "react";
import Script from "next/script";
import { getSeoSettings } from "@/lib/db";

export default async function SeoAnalyticsHead() {
  const seo = await getSeoSettings();
  const ga = seo?.googleAnalytics || {};

  return (
    <>
      {/* Google Site Verification */}
      {ga.googleSiteVerification && (
        <meta
          name="google-site-verification"
          content={ga.googleSiteVerification}
        />
      )}

      {/* Meta Keywords */}
      {seo?.metaKeywords && (
        <meta name="keywords" content={seo.metaKeywords} />
      )}

      {/* Google Analytics Script */}
      {ga.enabled && ga.measurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga.measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga.measurementId}');
            `}
          </Script>
        </>
      )}

      {/* Custom Head Scripts if provided */}
      {ga.headCustomScripts && (
        <script
          dangerouslySetInnerHTML={{ __html: ga.headCustomScripts }}
        />
      )}
    </>
  );
}
