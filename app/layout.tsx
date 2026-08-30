import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Madina Goods Transport Company, Chiniot - Munshi Portal',
  description: 'Enterprise Brokerage & Live Inventory Transport Management System for Madina Goods Transport Company, Chiniot.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
