import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Associate Piyush | Tax & Finance Consultant, Pune", template: "%s | Associate Piyush" },
  description: "Expert Tax Advisory, GST Reconciliation & Forensic Accounting Services for businesses across India. Associate Piyush — 950+ income tax cases. Pune. Pan India. Call +91 75073 54141.",
  keywords: ["tax consultant pune","GST reconciliation pune","forensic accounting india","income tax advisory pune","TDS compliance","CA consultant pune","Associate Piyush","Piyush Nimse"],
  authors: [{ name: "Associate Piyush" }],
  creator: "Associate Piyush",
  metadataBase: new URL("https://associate-piyush-bduu.vercel.app"),
  openGraph: {
    type: "website", locale: "en_IN",
    url: "https://associate-piyush-bduu.vercel.app",
    siteName: "Associate Piyush",
    title: "Associate Piyush | Tax & Finance Consultant, Pune",
    description: "Expert Tax Advisory, GST Reconciliation & Forensic Accounting. 950+ cases. Since 2025.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Associate Piyush - Tax Consultant Pune" }],
  },
  twitter: { card: "summary_large_image", title: "Associate Piyush | Tax & Finance Consultant, Pune", images: ["/og-image.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: "Associate Piyush",
  description: "Expert Tax Advisory, GST Reconciliation & Forensic Accounting Services across India.",
  url: "https://associate-piyush-bduu.vercel.app",
  telephone: "+917507354141",
  email: "associate.piyush.nimse@gmail.com",
  foundingDate: "2025",
  areaServed: "India",
  address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* No-flash dark mode init */}
        <script dangerouslySetInnerHTML={{ __html: `
(function(){
  try {
    var t = localStorage.getItem('ap-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', t === 'dark');
  } catch(e){}
})();
        ` }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        <ThemeProvider>
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
