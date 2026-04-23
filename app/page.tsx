import type { Metadata } from "next";
import Link from "next/link";
import {
  FileSpreadsheet, Search, Calculator, ClipboardCheck, BarChart3, Briefcase,
  ArrowRight, CheckCircle, Star, Shield, MapPin, FileText, RefreshCw, Clock,
  TrendingUp, Merge, Minimize2, FileOutput, Table, Database, ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Associate Piyush | CA Tax Consultant Pune | GST, Income Tax & TDS Advisory" },
  description: "Piyush Nimse — Expert Tax & Finance Consultant in Pune. 950+ income tax cases. GST Reconciliation, Income Tax Returns, TDS Compliance, Forensic Accounting & Tax Notice Reply. Call +91 75073 54141.",
  alternates: { canonical: "https://associate-piyush-bduu.vercel.app" },
};

const services = [
  { icon: RefreshCw, title: "GST Reconciliation",  desc: "Accurate GSTR-2A/2B matching, ITC eligibility analysis, and discrepancy resolution under Sec 16(2) CGST Act.", href: "/services#gst" },
  { icon: Search,    title: "Forensic Accounting", desc: "Financial fraud detection, transaction trail analysis, and investigative accounting for legal proceedings.",    href: "/services#forensic" },
  { icon: Calculator,title: "Income Tax Advisory", desc: "ITR filing, tax planning, scrutiny handling, and regime optimization for individuals and businesses.",           href: "/services#income-tax" },
  { icon: ClipboardCheck, title: "TDS Compliance", desc: "Section 192–194N TDS computation, return filing, 26AS reconciliation, and default rectification.",             href: "/services#tds" },
  { icon: BarChart3, title: "Audit & Assurance",   desc: "Statutory, internal, and compliance audits with actionable findings and management letter.",                   href: "/services#audit" },
  { icon: Briefcase, title: "Business Advisory",   desc: "Business structuring, cost optimization, financial planning, and growth strategy for SMEs.",                   href: "/services#business" },
];

const tools = [
  { icon: FileText,     label: "GST Invoice Generator",  href: "/tools/gst-invoice",   badge: "Popular" },
  { icon: Calculator,   label: "TDS Calculator",         href: "/tools/tds-calculator", badge: "" },
  { icon: BarChart3,    label: "ITR Tax Estimator",      href: "/tools/itr-estimator",  badge: "New" },
  { icon: FileSpreadsheet, label: "GSTR-2A Recon",       href: "/tools/gstr2a-recon",   badge: "" },
  { icon: Clock,        label: "GST Late Fee Calc",      href: "/tools/gst-late-fee",   badge: "" },
  { icon: RefreshCw,    label: "26AS TDS Recon",         href: "/tools/26as-recon",     badge: "" },
  { icon: TrendingUp,   label: "Advance Tax Calc",       href: "/tools/advance-tax",    badge: "" },
  { icon: Database,     label: "Bank Statement→Excel",   href: "/tools/bank-statement", badge: "" },
  { icon: Merge,        label: "PDF Merge",              href: "/tools/pdf-merge",      badge: "" },
  { icon: FileOutput,   label: "Word to PDF",            href: "/tools/word-to-pdf",    badge: "" },
];

const stats = [
  { value: "950+",    label: "Income Tax Cases" },
  { value: "28+",     label: "Audit Clients" },
  { value: "150+",    label: "GST Clients" },
  { value: "15+",     label: "Free Tools" },
];

const testimonials = [
  { name: "Mukund Kulkarni",  role: "Director, Kulkarni Enterprises, Pune",      service: "GST Reconciliation",  stars: 5, text: "Piyush resolved a 3-year GST ITC mismatch in under a week. Meticulous report — helped us recover ₹4.2 lakhs of blocked credit." },
  { name: "Yogesh Zaware",    role: "Proprietor, Zaware Agro Traders, Nashik",   service: "Income Tax Advisory", stars: 5, text: "Saved ₹1.8 lakhs after switching to the new tax regime on Piyush's advice. The free ITR estimator gave me confidence even before the consultation." },
  { name: "Nirmala Sawant",   role: "CFO, TechBridge Solutions, Bangalore",      service: "Forensic Accounting", stars: 5, text: "Engaged for a forensic audit after detecting vendor payment irregularities. Thorough, confidential, and the findings held up in legal proceedings." },
  { name: "Pravin Patil",     role: "Owner, Patil Construction, Solapur",        service: "TDS Compliance",      stars: 5, text: "Zero TDS defaults in 14 months since we engaged him. Piyush set up a proper quarterly compliance system that just works." },
];

export default function HomePage() {
  return (
    <div className="pt-[60px]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="ap-hero min-h-[92vh] flex items-center relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div style={{ position:"absolute", top:"20%",  left:"-5%", width:"50vw", height:"50vw", maxWidth:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(30,80,200,0.15) 0%, transparent 70%)", filter:"blur(60px)" }} />
          <div style={{ position:"absolute", bottom:"10%", right:"-5%", width:"40vw", height:"40vw", maxWidth:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)", filter:"blur(60px)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Location pill */}
              <div data-reveal className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 glass"
                   style={{ color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}>
                <MapPin size={11} />
                Pune, Maharashtra — Pan India Services
              </div>

              {/* Headline */}
              <h1 data-reveal data-delay="100"
                  className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight text-balance mb-6"
                  style={{ color: "var(--ap-text)" }}>
                Precision in<br />Every{" "}
                <span className="text-gold-gradient">Number.</span>
              </h1>

              <p data-reveal data-delay="200"
                 className="text-lg lg:text-xl leading-relaxed mb-10 max-w-lg"
                 style={{ color: "var(--ap-text-muted)" }}>
                Expert Tax Advisory, GST Reconciliation & Forensic Accounting for businesses across India.
              </p>

              {/* CTAs */}
              <div data-reveal data-delay="300" className="flex flex-wrap gap-3 mb-10">
                <Link href="/services" className="btn-gold gap-2 px-7 py-3.5 text-sm">
                  Explore Services <ArrowRight size={16} />
                </Link>
                <Link href="/tools" className="btn-outline gap-2 px-7 py-3.5 text-sm">
                  <Shield size={15} /> Try Free Tools
                </Link>
              </div>

              {/* Trust badges */}
              <div data-reveal data-delay="400" className="flex flex-wrap gap-4">
                {["Confidential", "Pan India", "Quick Turnaround"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-sm" style={{ color: "var(--ap-text-muted)" }}>
                    <CheckCircle size={14} style={{ color: "#4ADE80" }} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AP Avatar card */}
            <div data-reveal data-delay="200" className="flex justify-center lg:justify-end">
              <div className="relative animate-float">
                <div className="ap-glass-card w-72 h-72 lg:w-80 lg:h-80 flex flex-col items-center justify-center gap-4"
                     style={{ borderRadius: "50%", boxShadow: "0 0 60px rgba(201,168,76,0.12), var(--ap-shadow-lg)" }}>
                  <div className="w-24 h-24 rounded-full flex items-center justify-center"
                       style={{ background: "linear-gradient(135deg, #0A1628, #1F3088)", border: "3px solid rgba(201,168,76,0.5)" }}>
                    <span className="text-4xl font-black text-white">AP</span>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg" style={{ color: "var(--ap-text)" }}>Tax & Finance</div>
                    <div className="text-sm" style={{ color: "var(--ap-text-muted)" }}>Consultant</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full"
                       style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}>
                    📍 Pune, Maharashtra
                  </div>
                </div>

                {/* Floating mini cards */}
                <div className="absolute -right-8 top-8 ap-glass-card px-3 py-2 text-xs font-semibold whitespace-nowrap"
                     style={{ color: "#C9A84C" }}>
                  950+ Tax Cases
                </div>
                <div className="absolute -left-8 bottom-12 ap-glass-card px-3 py-2 text-xs font-semibold whitespace-nowrap"
                     style={{ color: "var(--ap-text)" }}>
                  🔒 100% Confidential
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "#050A14", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={s.label} data-reveal data-delay={String(i * 100)} className="text-center">
                <div className="text-4xl lg:text-5xl font-black mb-2 text-gold-gradient">{s.value}</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <section className="ap-surface-2 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 glass"
                 style={{ color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}>
              What We Do
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ color: "var(--ap-text)" }}>Our Services</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--ap-text-muted)" }}>
              Comprehensive tax and finance solutions built for Indian businesses.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={s.title} data-reveal data-delay={String((i % 3) * 100)} className="ap-card p-7 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                     style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.2)" }}>
                  <s.icon size={22} style={{ color: "#C9A84C" }} />
                </div>
                <h3 className="font-bold text-base mb-3" style={{ color: "var(--ap-text)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--ap-text-muted)" }}>{s.desc}</p>
                <Link href={s.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
                  style={{ color: "#C9A84C" }}>
                  Learn More <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div data-reveal className="text-center mt-12">
            <Link href="/services" className="btn-primary gap-2">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tools (Dock-style) ─────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "var(--ap-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-reveal className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
                 style={{ background: "rgba(74,222,128,0.10)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>
              <Shield size={11} /> 100% Free · No Login · Runs in Your Browser
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-4" style={{ color: "var(--ap-text)" }}>Free Tax Tools</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--ap-text-muted)" }}>
              Professional-grade tools for Indian tax compliance. Your data never leaves your device.
            </p>
          </div>

          {/* Dock */}
          <div data-reveal className="flex flex-wrap justify-center gap-4 mt-14 mb-10">
            {tools.map((t, i) => (
              <Link key={t.href} href={t.href}
                className="dock-item relative flex flex-col items-center gap-2 w-24 group"
                title={t.label}>
                {t.badge && (
                  <span className="absolute -top-1.5 -right-1 z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "#C9A84C", color: "#0A1628" }}>
                    {t.badge}
                  </span>
                )}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:shadow-gold"
                     style={{ background: "var(--ap-surface)", border: "1px solid var(--ap-border)", boxShadow: "var(--ap-shadow)" }}>
                  <t.icon size={26} style={{ color: "#C9A84C" }} />
                </div>
                <span className="text-[10px] font-medium text-center leading-tight" style={{ color: "var(--ap-text-muted)" }}>
                  {t.label}
                </span>
              </Link>
            ))}
          </div>

          <div data-reveal className="text-center">
            <Link href="/tools" className="btn-outline gap-2">
              View All 15 Tools <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tax Regime highlight ──────────────────────────────────────────── */}
      <section className="py-20 ap-surface-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 glass"
                   style={{ color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}>
                <Calculator size={11} /> Income Tax Advisory
              </div>
              <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-5" style={{ color: "var(--ap-text)" }}>
                Old vs New Regime —<br />
                <span className="text-gold-gradient">Know Which Saves More</span>
              </h2>
              <p className="leading-relaxed mb-8" style={{ color: "var(--ap-text-muted)" }}>
                Under Finance Act 2025, the New Regime offers zero tax up to ₹12 lakh. But Old Regime with 80C, 80D, and HRA can still win for high deduction earners. We run a live comparison for your exact numbers.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {["ITR-1 to ITR-6 filing","Old vs New regime live comparison","80C / 80D optimization","Capital gains (STCG/LTCG) planning","Scrutiny & notice handling","Appeals before CIT(A) / ITAT"].map((pt) => (
                  <div key={pt} className="flex items-start gap-2 text-sm" style={{ color: "var(--ap-text-muted)" }}>
                    <CheckCircle size={14} style={{ color: "#4ADE80", marginTop: 2, flexShrink: 0 }} />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/services#income-tax" className="btn-primary gap-2">View Details <ArrowRight size={15} /></Link>
                <Link href="/tools/itr-estimator" className="btn-outline gap-2"><Calculator size={15} /> Free ITR Estimator</Link>
              </div>
            </div>

            <div data-reveal data-delay="200" className="space-y-4">
              {[
                { label: "New Regime (FY 2026-27)", rate: "Zero tax up to ₹12L", note: "Standard deduction ₹75,000. Best for fewer deductions.", accent: "#C9A84C" },
                { label: "Old Regime", rate: "₹50K std. deduction", note: "Add 80C (₹1.5L) + 80D + HRA + NPS — can save more for high deduction earners.", accent: "#6080DC" },
              ].map(({ label, rate, note, accent }) => (
                <div key={label} className="ap-card p-5" style={{ borderLeft: `3px solid ${accent}` }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="font-semibold text-sm" style={{ color: "var(--ap-text)" }}>{label}</div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{ background: `${accent}18`, color: accent }}>{rate}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--ap-text-muted)" }}>{note}</p>
                </div>
              ))}
              <div className="ap-glass-card p-5" style={{ borderLeft: "3px solid rgba(201,168,76,0.5)" }}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#C9A84C" }}>Our Free Tool</div>
                <div className="font-semibold text-sm mb-1" style={{ color: "var(--ap-text)" }}>ITR Tax Estimator — FY 2026-27</div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--ap-text-muted)" }}>Enter income & deductions → see both regimes side by side instantly.</p>
                <Link href="/tools/itr-estimator" className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "#C9A84C" }}>
                  Open Tool <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: "var(--ap-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-reveal className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: "var(--ap-text)" }}>Client Testimonials</h2>
            <p className="text-lg" style={{ color: "var(--ap-text-muted)" }}>Trusted by businesses across India.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <div key={t.name} data-reveal data-delay={String(i * 100)} className="ap-card p-6 flex flex-col"
                   style={{ borderTop: "3px solid #C9A84C" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} size={12} style={{ color: "#C9A84C", fill: "#C9A84C" }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C" }}>
                    {t.service}
                  </span>
                </div>
                <p className="text-sm leading-relaxed italic flex-1 mb-5" style={{ color: "var(--ap-text-muted)" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid var(--ap-border)" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                       style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}>
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "var(--ap-text)" }}>{t.name}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--ap-text-muted)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #050A14 0%, #0A1628 50%, #0D1840 100%)", borderTop: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-reveal className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 glass"
               style={{ color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}>
            First Consultation Free
          </div>
          <h2 data-reveal className="text-4xl lg:text-5xl font-black text-white mb-4">
            Ready to resolve your<br />
            <span className="text-gold-gradient">tax matter?</span>
          </h2>
          <p data-reveal data-delay="100" className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.55)" }}>
            Confidential · Quick Turnaround · Pan India · Expert guidance tailored to your situation.
          </p>
          <div data-reveal data-delay="200" className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-gold gap-2 px-8 py-4 text-base">
              Get in Touch <ArrowRight size={18} />
            </Link>
            <a href="https://wa.me/917507354141?text=Hello%20Associate%20Piyush%2C%20I%20need%20tax%20consultation."
               target="_blank" rel="noopener noreferrer"
               className="btn-outline gap-2 px-8 py-4 text-base">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
