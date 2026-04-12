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
    default: "Associate Piyush | Tax & Finance Consultant, Pune",
    template: "%s | Associate Piyush",
  },
  description:
    "Expert Tax Advisory, GST Reconciliation & Forensic Accounting Services for Businesses Across India. Based in Pune, Maharashtra.",
  keywords: [
    "tax consultant pune",
    "GST reconciliation pune",
    "forensic accounting india",
    "income tax advisory pune",
    "TDS compliance",
    "CA consultant pune",
    "tax advisory india",
    "Associate Piyush",
    "Piyush Nimse",
    "GST filing pune",
    "income tax return pune",
    "ITR filing pune",
    "tax notice reply",
    "business advisory pune",
  ],
  authors: [{ name: "Associate Piyush" }],
  creator: "Associate Piyush",
  publisher: "Associate Piyush",
  metadataBase: new URL("https://associatepiyush.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://associatepiyush.in",
    siteName: "Associate Piyush",
    title: "Associate Piyush | Tax & Finance Consultant, Pune",
    description:
      "Expert Tax Advisory, GST Reconciliation & Forensic Accounting Services for Businesses Across India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Associate Piyush - Tax & Finance Consultant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Associate Piyush | Tax & Finance Consultant, Pune",
    description:
      "Expert Tax Advisory, GST Reconciliation & Forensic Accounting Services for Businesses Across India.",
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
  name: "Associate Piyush",
  alternateName: "Piyush Nimse Tax Consultant",
  description:
    "Expert Tax Advisory, GST Reconciliation & Forensic Accounting Services for Businesses Across India. Based in Pune, Maharashtra.",
  url: "https://associatepiyush.in",
  telephone: "+917507354141",
  email: "associate.piyush.nimse@gmail.com",
  founder: {
    "@type": "Person",
    name: "Piyush Nimse",
    jobTitle: "Tax & Finance Consultant",
  },
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
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  knowsAbout: [
    "GST Reconciliation",
    "Forensic Accounting",
    "Income Tax Advisory",
    "TDS Compliance",
    "Tax Notice Reply",
    "Audit & Assurance",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Tax & Finance Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "GST Reconciliation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Forensic Accounting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Income Tax Advisory" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "TDS Compliance" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Audit & Assurance" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Advisory" } },
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
