import type { Metadata } from "next";
import ContactSection from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Piyush Nimse for GST, Income Tax, TDS, Forensic Accounting consultations. Call or WhatsApp: +91 75073 54141. Email: associate.piyush.nimse@gmail.com. Pune, Maharashtra — Pan India. First consultation free.",
  keywords: [
    "contact tax consultant pune", "Piyush Nimse contact",
    "Associate Piyush WhatsApp", "tax consultation pune",
    "GST consultant contact pune", "tax advisor phone pune",
  ],
  alternates: { canonical: "https://associate-piyush-bduu.vercel.app/contact" },
  openGraph: {
    title: "Contact Associate Piyush | Tax Consultant Pune",
    description: "WhatsApp or call +91 75073 54141. First consultation free. GST, Income Tax, TDS & Forensic Accounting — Pune & Pan India.",
    url: "https://associate-piyush-bduu.vercel.app/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact Associate Piyush" }],
  },
};

export default function ContactPage() {
  return (
    <div className="pt-[60px]" style={{ background: "var(--ap-bg)" }}>

      {/* Hero */}
      <section className="relative overflow-hidden py-20" style={{ background: "linear-gradient(135deg, #050A14 0%, #0A1628 60%, #0F1E35 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full blur-[120px] opacity-20" style={{ background: "radial-gradient(circle, #1E50C8, transparent)" }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-[100px] opacity-15" style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80" }}>
            First Consultation Free
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Let&apos;s Talk<br />
            <span style={{ color: "#C9A84C" }}>Tax Strategy</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            WhatsApp, call, or email. We respond within 2 hours during business days. Pune-based, Pan India service.
          </p>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
