import "./globals.css";
import ConditionalLayout from "../components/ConditionalLayout";

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
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}