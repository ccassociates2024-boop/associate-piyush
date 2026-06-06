import type { Metadata } from "next";
import Link from "next/link";
import {
  FileSpreadsheet, Search, Calculator, ClipboardCheck, BarChart3, Briefcase,
  ArrowRight, CheckCircle, Shield, MapPin, FileText, RefreshCw, Clock,
  TrendingUp, Merge, FileOutput, Database, ChevronRight, Phone, Mail,
  Lightbulb, MessageCircle,
} from "lucide-react";
import Team from "@/components/Team";

export const metadata: Metadata = {
  title: { absolute: "Associate Piyush | Tax & Finance Consultant — Pune & Pan India" },
  description: "Piyush Nimse & CA Sourabh Chavan — Expert Tax & Finance Consultants. 950+ ITR filed. GST compliance & ITC refunds, Income Tax, TDS, Virtual CFO, Outsourced Accounting, Forensic Accounting. Serving clients Pan India from Pune. Call +91 75073 54141.",
  alternates: { canonical: "https://associatepiyush.co.in" },
};

const services = [
  { icon: RefreshCw,       title: "GST",                         desc: "End-to-end GST compliance (GSTR-1, 3B, 9), ITC claim management, and refund for SEZ suppliers & exporters.", href: "/services#gst"                    },
  { icon: Search,          title: "Forensic Accounting",     desc: "Financial fraud detection, transaction trail analysis, and investigative accounting for legal proceedings.",    href: "/services#forensic"               },
  { icon: Calculator,      title: "Income Tax Advisory",     desc: "ITR filing, tax planning, scrutiny handling, and regime optimisation for individuals and businesses.",          href: "/services#income-tax"              },
  { icon: ClipboardCheck,  title: "TDS Compliance",          desc: "Section 192–194N TDS computation, return filing, 26AS reconciliation, and default rectification.",            href: "/services#tds"                    },
  { icon: BarChart3,       title: "Audit & Assurance",       desc: "Statutory, internal, and compliance audits with actionable findings and management letter.",                   href: "/services#audit"                  },
  { icon: Briefcase,       title: "Business Advisory",       desc: "Business structuring, cost optimisation, financial planning, and growth strategy for SMEs.",                   href: "/services#business"               },
  { icon: TrendingUp,      title: "Virtual CFO Service",     desc: "Senior financial leadership for your business — MIS, budgeting, cash flow, compliance calendar, and investor readiness.", href: "/services#virtual-cfo"   },
  { icon: FileSpreadsheet, title: "Outsourced Accounting",   desc: "Full-cycle bookkeeping, bank reconciliation, GST-ready books, payroll, and monthly financial statements.",    href: "/services#outsourced-accounting"  },
  { icon: Lightbulb,       title: "Financial Consultation",  desc: "Personalised financial guidance — tax-efficient planning, debt management, profitability analysis, and custom financial roadmaps.", href: "/services#financial-consultation" },
];

const tools = [
  { icon: FileText,        label: "GST Invoice Generator",  href: "/tools/gst-invoice",   badge: "Popular" },
  { icon: Calculator,      label: "TDS Calculator",         href: "/tools/tds-calculator", badge: ""        },
  { icon: BarChart3,       label: "Income Tax Estimator",      href: "/tools/itr-estimator",  badge: "New"     },
  { icon: FileSpreadsheet, label: "GSTR-2A Reconciliation", href: "/tools/gstr2a-recon",   badge: ""        },
  { icon: Clock,           label: "GST Late Fee Calc",      href: "/tools/gst-late-fee",   badge: ""        },
  { icon: RefreshCw,       label: "26AS TDS Recon",         href: "/tools/26as-recon",     badge: ""        },
  { icon: TrendingUp,      label: "Advance Tax Calc",       href: "/tools/advance-tax",    badge: ""        },
  { icon: Database,        label: "Bank Statement → Excel", href: "/tools/bank-statement", badge: ""        },
  { icon: Merge,           label: "PDF Merge",              href: "/tools/pdf-merge",      badge: ""        },
  { icon: FileOutput,      label: "Word to PDF",            href: "/tools/word-to-pdf",    badge: ""        },
];

const stats = [
  { value: "950",  suffix: "+", label: "Income Tax Returns Filed" },
  { value: "150",  suffix: "+", label: "GST Clients Served"     },
  { value: "15",   suffix: "+", label: "Free Tools Built"       },
];

export default function HomePage() {
  return (
    <div className="pt-[60px]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--ap-surface)" }}
               className="border-b ap-divider py-14 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Location pill */}
          <div data-reveal
               className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-8"
               style={{ background: "var(--ap-gold-bg)", color: "var(--ap-gold)", border: "1px solid rgba(184,150,12,0.2)" }}>
            <MapPin size={11} />
            Pune, Maharashtra — Pan India Services
          </div>

          {/* Headline */}
          <h1 data-reveal data-delay="100"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-5 text-balance"
              style={{ color: "var(--ap-text)" }}>
            Expert Tax &amp; Finance<br />
            Advisory for <span className="text-gold-gradient">Indian Businesses</span>
          </h1>

          <p data-reveal data-delay="200"
             className="text-base sm:text-lg leading-relaxed mb-10 max-w-2xl"
             style={{ color: "var(--ap-text-muted)" }}>
            Piyush Nimse helps individuals, SMEs, and professionals with GST reconciliation, income tax returns, TDS compliance, and forensic accounting — across India.
          </p>

          {/* CTAs */}
          <div data-reveal data-delay="300" className="flex flex-wrap gap-3 mb-12">
            <Link href="/contact" className="btn-gold gap-2 px-6 py-3 text-sm">
              Book a Free Consultation <ArrowRight size={15} />
            </Link>
            <Link href="/tools" className="btn-outline gap-2 px-6 py-3 text-sm">
              <Shield size={14} /> Explore Free Tools
            </Link>
          </div>

          {/* Trust row */}
          <div data-reveal data-delay="400"
               className="flex flex-wrap gap-6 pt-8"
               style={{ borderTop: "1px solid var(--ap-border)" }}>
            {[
              { icon: CheckCircle, text: "100% Confidential" },
              { icon: CheckCircle, text: "Pan India Services" },
              { icon: CheckCircle, text: "First Consultation Free" },
              { icon: CheckCircle, text: "Quick Turnaround" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-sm" style={{ color: "var(--ap-text-muted)" }}>
                <Icon size={14} style={{ color: "var(--ap-green)" }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--ap-surface-2)" }} className="ap-divider border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-3">
            {stats.map((s, i) => (
              <div key={s.label} data-reveal data-delay={String(i * 100)}
                   className="text-center py-2"
                   style={i > 0 ? { borderLeft: "1px solid var(--ap-border)", paddingLeft: "2rem" } : { paddingRight: "2rem" }}>
                <div className="text-3xl sm:text-4xl font-bold mb-1"
                     style={{ color: "var(--ap-text)" }}>
                  <span data-counter={s.value} data-counter-suffix={s.suffix}>
                    {s.value}{s.suffix}
                  </span>
                </div>
                <div className="text-sm" style={{ color: "var(--ap-text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--ap-surface)" }} className="py-20 border-b ap-divider">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div data-reveal className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2"
               style={{ color: "var(--ap-gold)" }}>Services</p>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--ap-text)" }}>
              What We Help With
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <Link key={s.title} href={s.href}
                    data-reveal data-delay={String((i % 3) * 100)}
                    className="ap-card p-6 group block">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                     style={{ background: "var(--ap-gold-bg)" }}>
                  <s.icon size={18} style={{ color: "var(--ap-gold)" }} />
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--ap-text)" }}>
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--ap-text-muted)" }}>
                  {s.desc}
                </p>
                <div className="inline-flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-1.5"
                     style={{ color: "var(--ap-gold)" }}>
                  Learn more <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>

          <div data-reveal className="mt-10">
            <Link href="/services" className="btn-outline gap-1.5 text-sm">
              All Services <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FREE TOOLS ───────────────────────────────────────────────────── */}
      <section style={{ background: "var(--ap-surface-2)" }} className="py-20 border-b ap-divider">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div data-reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                 style={{ color: "var(--ap-gold)" }}>Free Tools</p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--ap-text)" }}>
                15+ Tools, No Login Required
              </h2>
              <p className="text-sm mt-2" style={{ color: "var(--ap-text-muted)" }}>
                Runs entirely in your browser. Your data never leaves your device.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full flex-shrink-0"
                 style={{ background: "rgba(22,163,74,0.08)", color: "#16A34A", border: "1px solid rgba(22,163,74,0.15)" }}>
              <Shield size={11} /> 100% Private
            </div>
          </div>

          {/* Tool list — simple grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
            {tools.map((t) => (
              <Link key={t.href} href={t.href}
                    className="dock-item ap-card p-4 flex flex-col items-start gap-2.5 group relative">
                {t.badge && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: "var(--ap-gold-bg)", color: "var(--ap-gold)" }}>
                    {t.badge}
                  </span>
                )}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                     style={{ background: "var(--ap-surface-2)" }}>
                  <t.icon size={16} style={{ color: "var(--ap-gold)" }} />
                </div>
                <span className="text-[11px] font-medium leading-tight" style={{ color: "var(--ap-text-2)" }}>
                  {t.label}
                </span>
              </Link>
            ))}
          </div>

          <div data-reveal>
            <Link href="/tools" className="btn-outline gap-1.5 text-sm">
              View All 15+ Tools <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TAX REGIME HIGHLIGHT ─────────────────────────────────────────── */}
      <section style={{ background: "var(--ap-surface)" }} className="py-20 border-b ap-divider">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            <div data-reveal>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                 style={{ color: "var(--ap-gold)" }}>Income Tax Advisory</p>
              <h2 className="text-2xl sm:text-3xl font-bold leading-snug mb-4"
                  style={{ color: "var(--ap-text)" }}>
                Old vs New Regime —<br />Which Saves More for You?
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--ap-text-muted)" }}>
                Under Finance Act 2025, the New Regime offers zero tax up to ₹12 lakh. But the Old Regime with 80C, 80D, and HRA can still win for high-deduction earners. We run the numbers for your exact situation.
              </p>
              <ul className="space-y-2.5 mb-8">
                {["ITR-1 to ITR-6 filing", "Old vs New regime comparison", "80C / 80D optimisation", "LTCG on property sale — Sec 54/54F relief", "Capital gains tax planning", "Scrutiny & notice handling", "Appeals before CIT(A) / ITAT"].map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm" style={{ color: "var(--ap-text-muted)" }}>
                    <CheckCircle size={13} style={{ color: "var(--ap-green)", flexShrink: 0 }} />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link href="/services#income-tax" className="btn-primary gap-1.5 text-sm">
                  View Service <ArrowRight size={14} />
                </Link>
                <Link href="/tools/itr-estimator" className="btn-outline gap-1.5 text-sm">
                  <Calculator size={13} /> Free ITR Estimator
                </Link>
              </div>
            </div>

            <div data-reveal data-delay="200" className="space-y-3">
              {[
                { label: "New Regime (FY 2026-27)", rate: "Zero tax up to ₹12L", note: "Standard deduction ₹75,000. Ideal for salaried with fewer deductions." },
                { label: "Old Regime",              rate: "₹50,000 std. deduction", note: "Add 80C (₹1.5L) + 80D + HRA + NPS — better for high-deduction earners." },
              ].map(({ label, rate, note }) => (
                <div key={label} className="ap-card p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="font-semibold text-sm" style={{ color: "var(--ap-text)" }}>{label}</div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap"
                          style={{ background: "var(--ap-gold-bg)", color: "var(--ap-gold)" }}>
                      {rate}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--ap-text-muted)" }}>{note}</p>
                </div>
              ))}
              <div className="ap-card p-5" style={{ borderLeft: "3px solid var(--ap-gold)" }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--ap-gold)" }}>
                  Try it free
                </p>
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--ap-text)" }}>
                  Income Tax Estimator — FY 2026-27
                </p>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--ap-text-muted)" }}>
                  Enter your income &amp; deductions — see both regimes compared side by side, instantly.
                </p>
                <Link href="/tools/itr-estimator" className="inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: "var(--ap-gold)" }}>
                  Open Tool <ArrowRight size={11} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PARTNERS ─────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--ap-surface)" }} className="py-20 border-b ap-divider">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-reveal className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2"
               style={{ color: "var(--ap-gold)" }}>Our Team</p>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--ap-text)" }}>
              The People Behind the Work
            </h2>
            <p className="text-sm mt-2 max-w-lg" style={{ color: "var(--ap-text-muted)" }}>
              Every engagement is handled personally — precise, confidential, and results-driven.
            </p>
          </div>
          <Team />
          <div data-reveal className="mt-8">
            <a
              href="https://wa.me/918421465966?text=Hello%20C.A.%20Sourabh%2C%20I%20need%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all"
              style={{ background: "rgba(22,163,74,0.10)", color: "#16A34A", border: "1px solid rgba(22,163,74,0.20)" }}
            >
              <MessageCircle size={14} /> WhatsApp C.A. Sourabh — +91 84214 65966
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "#0A1628", color: "#FFFFFF" }} className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-reveal>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4"
               style={{ color: "rgba(255,255,255,0.45)" }}>
              First Consultation Free
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Have a tax matter to resolve?
            </h2>
            <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.55)" }}>
              Reach out today — confidential, no obligation, and quick to respond.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <Link href="/contact" className="btn-gold gap-2 px-7 py-3 text-sm">
                Get in Touch <ArrowRight size={15} />
              </Link>
              <a href="https://wa.me/917507354141?text=Hello%20Associate%20Piyush%2C%20I%20need%20tax%20consultation."
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-lg transition-all"
                 style={{ background: "rgba(255,255,255,0.10)", color: "white", border: "1.5px solid rgba(255,255,255,0.20)" }}>
                💬 WhatsApp
              </a>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm"
                 style={{ color: "rgba(255,255,255,0.40)" }}>
              <a href="tel:+917507354141" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone size={13} /> +91 75073 54141
              </a>
              <span className="hidden sm:inline">·</span>
              <a href="mailto:associate.piyush.nimse@gmail.com"
                 className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail size={13} /> associate.piyush.nimse@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
