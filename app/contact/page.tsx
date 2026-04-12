import type { Metadata } from "next";
import ContactSection from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Piyush Nimse for GST, Income Tax, TDS, Forensic Accounting consultations. Call or WhatsApp: +91 75073 54141. Email: associate.piyush.nimse@gmail.com. Pune, Maharashtra — Pan India. First consultation free.",
  keywords: [
    "contact tax consultant pune",
    "Piyush Nimse contact",
    "Associate Piyush WhatsApp",
    "tax consultation pune",
    "GST consultant contact pune",
    "tax advisor phone pune",
  ],
  alternates: {
    canonical: "https://associatepiyush.in/contact",
  },
  openGraph: {
    title: "Contact Associate Piyush | Tax Consultant Pune",
    description:
      "WhatsApp or call +91 75073 54141. First consultation free. GST, Income Tax, TDS & Forensic Accounting — Pune & Pan India.",
    url: "https://associatepiyush.in/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact Associate Piyush" }],
  },
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-gold text-sm font-semibold uppercase tracking-wider mb-3">
              Get in Touch
            </p>
            <h1 className="text-4xl font-bold text-white mb-4">
              Let&apos;s Resolve Your Tax Matter
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed">
              Reach out via WhatsApp, call, or email. First consultation is free.
              Response within 2 hours on business days.
            </p>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
