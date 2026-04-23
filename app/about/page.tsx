import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, GraduationCap, Award, Code2, CheckCircle, ArrowRight, BookOpen, Shield, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Piyush Nimse",
  description:
    "Meet Piyush Nimse — Tax & Finance Consultant and Forensic Accounting Specialist in Pune. Expert in GST, Income Tax, TDS, and Forensic Accounting since 2020. Serving clients across India.",
  keywords: [
    "Piyush Nimse", "Associate Piyush", "tax consultant pune",
    "forensic accounting specialist pune", "GST expert pune",
    "income tax consultant", "CA tax advisor pune", "about Associate Piyush",
  ],
  alternates: { canonical: "https://associate-piyush-bduu.vercel.app/about" },
  openGraph: {
    title: "About Piyush Nimse | Tax & Finance Consultant Pune",
    description: "Piyush Nimse — Forensic Accounting & Tax Consultant in Pune since 2020. GST, Income Tax, TDS, Audit expert. Pan India service.",
    url: "https://associate-piyush-bduu.vercel.app/about",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Piyush Nimse - Tax Consultant Pune" }],
  },
};

const specializations = [
  "GST Compliance & Reconciliation (GSTR-1, 3B, 9, 9C)",
  "Forensic Accounting & Financial Fraud Detection",
  "Income Tax Advisory (ITR, Appeals, Scrutiny Handling)",
  "TDS Compliance (Sec 192–194N, Return Filing, 26AS Recon)",
  "Statutory & Internal Audit under Companies Act 2013",
  "Financial Statement Analysis & Ratio Analysis",
  "Tax Regime Optimization (Old vs New Regime)",
  "Business Structuring & Cost Optimization",
  "Advance Tax & Minimum Alternate Tax (MAT) Planning",
  "MSME Advisory & Virtual CFO Services",
];

const techStack = [
  { cat: "Tax Software", items: ["Tally Prime", "TallyERP 9", "BUSY Accounting", "Zoho Books"] },
  { cat: "GST Portal", items: ["GST Portal (GSTN)", "E-Invoice Portal", "E-Way Bill Portal"] },
  { cat: "Income Tax", items: ["IT Department Portal", "TRACES", "CPC TDS"] },
  { cat: "Office & Analytics", items: ["Microsoft Excel (Advanced)", "Power BI (Basic)", "Google Sheets", "PDF Tools"] },
  { cat: "Development", items: ["JavaScript / TypeScript", "Next.js", "React", "Python (Basic)"] },
];

const stats = [
  { label: "GST Cases Handled", value: "150+" },
  { label: "Forensic Investigations", value: "25+" },
  { label: "ITRs Filed", value: "950+" },
  { label: "States Covered", value: "15+" },
  { label: "Free Tools Built", value: "15" },
];

const philosophy = [
  { title: "Precision First", desc: "Numbers don't lie when analyzed correctly. Every discrepancy has a cause — find it, fix it." },
  { title: "Client Confidentiality", desc: "Financial matters are sensitive. Complete confidentiality is not optional — it's foundational." },
  { title: "Proactive Compliance", desc: "The best tax problem is the one avoided. Plan ahead, stay compliant, minimize risk." },
];

export default function AboutPage() {
  return (
    <div className="pt-[60px]" style={{ background: "var(--ap-bg)" }}>

      {/* Hero */}
      <section className="relative overflow-hidden py-20" style={{ background: "linear-gradient(135deg, #050A14 0%, #0A1628 60%, #0F1E35 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full blur-[120px] opacity-20" style={{ background: "radial-gradient(circle, #1E50C8, transparent)" }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-[100px] opacity-15" style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10">

            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-40 h-40">
                <div className="w-40 h-40 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #0A1628, #1F3088)", border: "2px solid rgba(201,168,76,0.4)", boxShadow: "0 0 60px rgba(201,168,76,0.15)" }}>
                  <span className="text-5xl font-bold text-white">AP</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "#C9A84C" }}>
                  <Sparkles size={16} style={{ color: "#0A1628" }} />
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C" }}>
                Tax & Finance Consultant
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Piyush Nimse</h1>
              <p className="text-lg font-medium mb-4" style={{ color: "#C9A84C" }}>
                Forensic Accounting Specialist
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                {[
                  { Icon: MapPin, text: "Pune, Maharashtra, India" },
                  { Icon: GraduationCap, text: "Pursuing MBA in Finance" },
                  { Icon: Award, text: "Active Since 2020" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <Icon size={14} style={{ color: "#C9A84C" }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left */}
            <div className="lg:col-span-2 space-y-6">

              {/* About */}
              <div data-reveal className="rounded-2xl p-6"
                style={{ background: "var(--ap-surface)", border: "1px solid var(--ap-border)" }}>
                <h2 className="font-bold text-xl mb-4 flex items-center gap-2" style={{ color: "var(--ap-text)" }}>
                  <BookOpen size={18} style={{ color: "#C9A84C" }} /> About Me
                </h2>
                <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--ap-text-muted)" }}>
                  <p>I am a Tax & Finance Consultant specializing in GST compliance, income tax advisory, and forensic accounting, based in Pune, Maharashtra. With over 4 years of hands-on experience, I have worked with businesses across manufacturing, trading, services, and e-commerce sectors across India.</p>
                  <p>My practice is built on the principle that compliance should be precise, proactive, and transparent. Whether it is resolving a 3-year ITC mismatch, defending a scrutiny assessment, or investigating financial irregularities, I bring the same level of rigor to every engagement.</p>
                  <p>Currently pursuing an MBA in Finance, I combine formal financial education with practical field experience — a combination that helps me advise clients not just on compliance, but on financially sound decision-making.</p>
                  <p>I am particularly passionate about forensic accounting — the intersection of accounting, law, and investigation. I have assisted in cases involving vendor fraud, embezzlement, and complex financial misreporting, producing investigation reports used in legal proceedings.</p>
                  <p>Beyond client work, I build free financial tools (this website!) to democratize access to professional-grade tax calculators and reconciliation tools for small businesses and professionals across India.</p>
                </div>
              </div>

              {/* Philosophy */}
              <div data-reveal className="rounded-2xl p-6"
                style={{ background: "var(--ap-surface)", border: "1px solid var(--ap-border)" }}>
                <h2 className="font-bold text-xl mb-5 flex items-center gap-2" style={{ color: "var(--ap-text)" }}>
                  <Shield size={18} style={{ color: "#C9A84C" }} /> Professional Philosophy
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {philosophy.map(({ title, desc }) => (
                    <div key={title} className="p-4 rounded-xl" style={{ background: "var(--ap-surface-2)", border: "1px solid var(--ap-border)" }}>
                      <div className="font-semibold text-sm mb-2" style={{ color: "#C9A84C" }}>{title}</div>
                      <div className="text-xs leading-relaxed" style={{ color: "var(--ap-text-muted)" }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div data-reveal className="rounded-2xl p-6"
                style={{ background: "var(--ap-surface)", border: "1px solid var(--ap-border)" }}>
                <h2 className="font-bold text-xl mb-5 flex items-center gap-2" style={{ color: "var(--ap-text)" }}>
                  <Award size={18} style={{ color: "#C9A84C" }} /> Specializations
                </h2>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {specializations.map((s) => (
                    <div key={s} className="flex items-start gap-2 text-sm" style={{ color: "var(--ap-text-muted)" }}>
                      <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#4ADE80" }} />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">

              {/* Stats */}
              <div data-reveal className="rounded-2xl p-5"
                style={{ background: "var(--ap-surface)", border: "1px solid var(--ap-border)" }}>
                <h3 className="font-bold text-sm mb-4" style={{ color: "var(--ap-text)" }}>Quick Stats</h3>
                <div className="space-y-3">
                  {stats.map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center text-sm pb-2"
                      style={{ borderBottom: "1px solid var(--ap-border)" }}>
                      <span style={{ color: "var(--ap-text-muted)" }}>{label}</span>
                      <span className="font-bold" style={{ color: "#C9A84C" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div data-reveal className="rounded-2xl p-5"
                style={{ background: "var(--ap-surface)", border: "1px solid var(--ap-border)" }}>
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--ap-text)" }}>
                  <Code2 size={15} style={{ color: "#C9A84C" }} /> Tools & Platforms
                </h3>
                <div className="space-y-4">
                  {techStack.map(({ cat, items }) => (
                    <div key={cat}>
                      <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#C9A84C" }}>{cat}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map((item) => (
                          <span key={item} className="px-2 py-1 rounded text-xs"
                            style={{ background: "var(--ap-surface-2)", border: "1px solid var(--ap-border)", color: "var(--ap-text-muted)" }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div data-reveal className="rounded-2xl p-5 text-white"
                style={{ background: "linear-gradient(135deg, #0A1628 0%, #1F3088 100%)", border: "1px solid rgba(201,168,76,0.2)" }}>
                <h3 className="font-bold mb-2">Let&apos;s Work Together</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Have a tax matter, audit requirement, or forensic investigation? Available for consultations.
                </p>
                <Link href="/contact" className="btn-gold gap-2 w-full justify-center text-sm">
                  Get in Touch <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
