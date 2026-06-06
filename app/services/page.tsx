import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServicesAccordion from "./ServicesAccordion";

export const metadata: Metadata = {
  title: "Tax & Finance Services",
  description:
    "Comprehensive tax and finance services — GST compliance & ITC refund, Income Tax Advisory, TDS, Audit, Virtual CFO, Outsourced Accounting & Financial Consultation. Based in Pune, serving clients Pan India. Call +91 75073 54141.",
  keywords: [
    "GST compliance pune",
    "GST refund exporters india",
    "income tax advisory india",
    "virtual CFO india",
    "outsourced accounting india",
    "TDS compliance pune",
    "audit assurance pune",
    "financial consultation pune",
    "LTCG property tax advisor",
    "Piyush Nimse services",
  ],
  alternates: { canonical: "https://associatepiyush.co.in/services" },
  openGraph: {
    title: "Tax & Finance Services | Associate Piyush",
    description:
      "GST, Income Tax, TDS, Audit, Virtual CFO, Outsourced Accounting & Financial Consultation. Piyush Nimse, Pune. Pan India.",
    url: "https://associatepiyush.co.in/services",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tax Services - Associate Piyush" }],
  },
};

export default function ServicesPage() {
  return (
    <div className="pt-16">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
            What We Offer
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Our Services</h1>
          <p className="text-blue-200 text-sm sm:text-base max-w-xl leading-relaxed">
            Click any service to see full details, pricing, and what&apos;s included.
            Each engagement is handled with precision and confidentiality.
          </p>
        </div>
      </section>

      {/* ── Accordion list ────────────────────────────────────────────────── */}
      <section className="bg-background py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesAccordion />
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Not sure which service you need?
          </h2>
          <p className="text-blue-200 text-sm mb-6">
            Get a free 10-minute consultation — we&apos;ll assess your situation and recommend the right approach.
          </p>
          <Link
            href="/contact"
            className="btn-gold gap-2"
          >
            Schedule a Free Call <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
