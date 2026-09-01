import "./globals.css";
import RouteAnimations from "../components/RouteAnimations";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import LegacyScripts from "../components/LegacyScripts";

export const metadata = {
  title: "Anjani Industries",
  description: "Anjani Industries",

  icons: {
    icon: "../assets/img/favicon.png",
    shortcut: "../assets/img/favicon.png",
    apple: "../assets/img/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        <BackToTop />
        <Header />
        <main>{children}</main>
        <Footer />
        <LegacyScripts />
        <RouteAnimations />
      </body>
    </html>
  );
}


