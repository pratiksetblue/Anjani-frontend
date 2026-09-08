import './assets/css/ecard.css';

export const metadata = {
  title: 'Anjani Industries | E-Visiting Card',
  description: 'Anjani Industries digital visiting card - Dhruv Patel',
  themeColor: '#f2f2f2',
  icons: {
    icon: '/assets/img/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
