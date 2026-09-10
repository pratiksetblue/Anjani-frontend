import "./globals.css";
import ConditionalLayout from "../components/ConditionalLayout";
import Script from "next/script";

export const metadata = {
  title: "Anjani Industries",
  description: "Anjani Industries",
  icons: {
    icon: "/assets/img/favicon.png",
    shortcut: "/assets/img/favicon.png",
    apple: "/assets/img/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="gzbGX_Ws9uHs_D0iP2jcKLR7rkKrX3C4iK5sgpa0nAM" />
      </head>
      <body>
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NW6Z613EES"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NW6Z613EES');
          `}
        </Script>

        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
