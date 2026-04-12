import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CC Associates | Tax Advisory, GST, Audit & Litigation | Pune, India",
    template: "%s | CC Associates",
  },
  description:
    "Professional tax and advisory by CC Associates — 950+ income tax cases, GST compliance, TDS, statutory audit, litigation & business advisory. Piyush Nimse & CA Sourabh Chavan. Pune. Pan India.",
  keywords: [
    "tax consultant pune",
    "GST reconciliation pune",
    "forensic accounting india",
    "income tax advisory pune",
    "TDS compliance",
    "CA consultant pune",
    "tax advisory india",
    "CC Associates",
    "Piyush Nimse",
    "Sourabh Chavan CA",
    "GST filing pune",
    "income tax return pune",
    "ITR filing pune",
    "tax notice reply",
    "business advisory pune",
    "statutory audit pune",
    "litigation support pune",
  ],
  authors: [{ name: "CC Associates" }],
  creator: "CC Associates",
  publisher: "CC Associates",
  metadataBase: new URL("https://associate-piyush-bduu.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://associate-piyush-bduu.vercel.app",
    siteName: "CC Associates",
    title: "CC Associates — Tax & Advisory Practice | Pune",
    description:
      "950+ income tax cases. GST, TDS, Audit, Litigation. CA Sourabh Chavan & Piyush Nimse. Since 2025. associate.piyush.nimse@gmail.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CC Associates - Tax & Advisory Practice, Pune",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CC Associates | Tax Advisory, GST, Audit | Pune",
    description:
      "950+ income tax cases. GST, TDS, Audit, Litigation. Since 2025.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: "CC Associates",
  alternateName: "Associate Piyush",
  description:
    "Expert Tax Advisory, GST Reconciliation, Statutory Audit & Forensic Accounting Services across India. Based in Pune, Maharashtra. Since 2025.",
  url: "https://associate-piyush-bduu.vercel.app",
  telephone: "+917507354141",
  email: "associate.piyush.nimse@gmail.com",
  foundingDate: "2025",
  areaServed: "India",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "18.5204",
    longitude: "73.8567",
  },
  openingHours: "Mo-Sa 10:00-19:00",
  priceRange: "$$",
  currenciesAccepted: "INR",
  paymentAccepted: "Bank Transfer, UPI",
  employee: [
    {
      "@type": "Person",
      name: "Piyush Nimse",
      jobTitle: "Founding Partner — Tax & Finance",
      telephone: "+917507354141",
      email: "associate.piyush.nimse@gmail.com",
    },
    {
      "@type": "Person",
      name: "Sourabh Chavan",
      jobTitle: "Audit & Advisory Partner (CA)",
      telephone: "+918421465966",
      email: "ccassociates2024@gmail.com",
    },
  ],
  serviceType: [
    "Income Tax Advisory",
    "GST Compliance",
    "TDS Compliance",
    "Statutory Audit",
    "Litigation Support",
    "Business Advisory",
    "Forensic Accounting",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Tax & Advisory Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "GST Reconciliation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Forensic Accounting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Income Tax Advisory" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "TDS Compliance" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Statutory Audit" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Advisory" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Litigation Support" } },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
