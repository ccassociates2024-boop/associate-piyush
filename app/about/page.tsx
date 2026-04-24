import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, GraduationCap, Award, Code2, CheckCircle, ArrowRight, BookOpen, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About Piyush Nimse",
  description:
    "Meet Piyush Nimse — Tax & Finance Consultant and Forensic Accounting Specialist in Pune. Expert in GST, Income Tax, TDS, and Forensic Accounting since 2020. Serving clients across India.",
  keywords: [
    "Piyush Nimse",
    "Associate Piyush",
    "tax consultant pune",
    "forensic accounting specialist pune",
    "GST expert pune",
    "income tax consultant",
    "CA tax advisor pune",
    "about Associate Piyush",
  ],
  alternates: {
    canonical: "https://associatepiyush.in/about",
  },
  openGraph: {
    title: "About Piyush Nimse | Tax & Finance Consultant Pune",
    description:
      "Piyush Nimse — Forensic Accounting & Tax Consultant in Pune since 2020. GST, Income Tax, TDS, Audit expert. Pan India service.",
    url: "https://associatepiyush.in/about",
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

const tools = [
  { cat: "Tax Software", items: ["Tally Prime", "TallyERP 9", "BUSY Accounting", "Zoho Books"] },
  { cat: "GST Portal", items: ["GST Portal (GSTN)", "E-Invoice Portal", "E-Way Bill Portal"] },
  { cat: "Income Tax", items: ["IT Department Portal", "TRACES", "CPC TDS"] },
  { cat: "Office & Analytics", items: ["Microsoft Excel (Advanced)", "Power BI (Basic)", "Google Sheets", "PDF Tools"] },
  { cat: "Development", items: ["JavaScript / TypeScript", "Next.js", "React", "Python (Basic)"] },
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full border-4 border-gold bg-white/10 flex items-center justify-center">
                <span className="text-5xl font-bold text-white">AP</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Piyush</h1>
              <p className="text-gold font-semibold text-lg mb-3">
                Tax & Finance Consultant | Forensic Accounting Specialist
              </p>
              <div className="flex flex-wrap gap-4 text-blue-200 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gold" />
                  Pune, Maharashtra, India
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-gold" />
                  Pursuing MBA in Finance
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={14} className="text-gold" />
                  Active Since 2020
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: About Text */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-card shadow-card border border-gray-100 p-6">
                <h2 className="font-bold text-dark text-xl mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-gold" /> About Me
                </h2>
                <div className="space-y-3 text-muted text-sm leading-relaxed">
                  <p>
                    I am a Tax & Finance Consultant specializing in GST compliance, income tax advisory, and forensic accounting, based in Pune, Maharashtra. With over 4 years of hands-on experience, I have worked with businesses across manufacturing, trading, services, and e-commerce sectors across India.
                  </p>
                  <p>
                    My practice is built on the principle that compliance should be precise, proactive, and transparent. Whether it is resolving a 3-year ITC mismatch, defending a scrutiny assessment, or investigating financial irregularities, I bring the same level of rigor to every engagement.
                  </p>
                  <p>
                    Currently pursuing an MBA in Finance, I combine formal financial education with practical field experience — a combination that helps me advise clients not just on compliance, but on financially sound decision-making.
                  </p>
                  <p>
                    I am particularly passionate about forensic accounting — the intersection of accounting, law, and investigation. I have assisted in cases involving vendor fraud, embezzlement, and complex financial misreporting, producing investigation reports that have been used in legal proceedings.
                  </p>
                  <p>
                    Beyond client work, I build free financial tools (this website!) to democratize access to professional-grade tax calculators and reconciliation tools for small businesses and professionals across India.
                  </p>
                </div>
              </div>

              {/* Professional Philosophy */}
              <div className="bg-white rounded-card shadow-card border border-gray-100 p-6">
                <h2 className="font-bold text-dark text-xl mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-gold" /> Professional Philosophy
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { title: "Precision First", desc: "Numbers don't lie when analyzed correctly. Every discrepancy has a cause — find it, fix it." },
                    { title: "Client Confidentiality", desc: "Financial matters are sensitive. Complete confidentiality is not optional — it's foundational." },
                    { title: "Proactive Compliance", desc: "The best tax problem is the one avoided. Plan ahead, stay compliant, minimize risk." },
                  ].map(({ title, desc }) => (
                    <div key={title} className="p-4 bg-background rounded-lg border border-gray-100">
                      <div className="font-semibold text-dark text-sm mb-2">{title}</div>
                      <div className="text-muted text-xs leading-relaxed">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div className="bg-white rounded-card shadow-card border border-gray-100 p-6">
                <h2 className="font-bold text-dark text-xl mb-4 flex items-center gap-2">
                  <Award size={18} className="text-gold" /> Specializations
                </h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {specializations.map(s => (
                    <div key={s} className="flex items-start gap-2 text-sm text-muted">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Tools, CTA */}
            <div className="space-y-5">
              {/* Tools & Platforms */}
              <div className="bg-white rounded-card shadow-card border border-gray-100 p-5">
                <h3 className="font-bold text-dark mb-4 flex items-center gap-2 text-sm">
                  <Code2 size={16} className="text-gold" /> Tools & Platforms
                </h3>
                <div className="space-y-4">
                  {tools.map(({ cat, items }) => (
                    <div key={cat}>
                      <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">{cat}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {items.map(item => (
                          <span key={item} className="px-2 py-1 bg-background border border-gray-100 rounded text-xs text-muted">{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-card shadow-card border border-gray-100 p-5">
                <h3 className="font-bold text-dark mb-4 text-sm">Quick Stats</h3>
                <div className="space-y-3">
                  {[
                    { label: "GST Cases Handled", value: "150+" },
                    { label: "Forensic Investigations", value: "25+" },
                    { label: "ITRs Filed", value: "200+" },
                    { label: "States Covered", value: "15+" },
                    { label: "Free Tools Built", value: "12" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                      <span className="text-muted">{label}</span>
                      <span className="font-bold text-primary">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-primary rounded-card p-5 text-white">
                <h3 className="font-bold mb-2">Let's Work Together</h3>
                <p className="text-blue-200 text-sm leading-relaxed mb-4">
                  Have a tax matter, audit requirement, or forensic investigation? I'm available for consultations.
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
