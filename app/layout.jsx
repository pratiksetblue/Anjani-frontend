import "./globals.css";
import ConditionalLayout from "../components/ConditionalLayout";
import SeoAnalyticsHead from "../components/SeoAnalyticsHead";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#cb0000",
};

export const metadata = {
  title: "Anjani Industries | Fabric Dyeing Machinery Manufacturer",
  description: "Leading manufacturer of advanced fabric dyeing machinery in India since 1990.",
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
        <SeoAnalyticsHead />
      </head>
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
