import type { Metadata } from "next";
import Link from "next/link";
import {
  RefreshCw, Search, Calculator, ClipboardCheck, BarChart3, Briefcase,
  CheckCircle, ArrowRight, Scale, Users, IndianRupee, Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tax & Finance Services",
  description:
    "Comprehensive tax and finance services in Pune — GST Reconciliation, Forensic Accounting, Income Tax Advisory, TDS Compliance, Audit & Assurance, Business Advisory. Pan India. Call +91 75073 54141.",
  keywords: [
    "GST reconciliation pune", "forensic accounting pune", "income tax advisory pune",
    "TDS compliance pune", "audit assurance pune", "business advisory pune",
    "tax services pune", "Piyush Nimse services",
  ],
  alternates: { canonical: "https://associate-piyush-bduu.vercel.app/services" },
  openGraph: {
    title: "Tax & Finance Services | Associate Piyush",
    description: "GST Reconciliation, Forensic Accounting, Income Tax, TDS & more. Expert services by Piyush Nimse, Pune.",
    url: "https://associate-piyush-bduu.vercel.app/services",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tax Services - Associate Piyush" }],
  },
};

const services = [
  {
    id: "gst", icon: RefreshCw,
    title: "GST Reconciliation",
    law: "Sec 16(2) CGST Act, 2017 | GSTR-2A/2B Matching",
    pricing: "Starting from ₹3,500 / month",
    description: "GST Input Tax Credit (ITC) reconciliation is critical for every registered business. A mismatch between your purchase register and GSTR-2A/2B can lead to ITC reversal, penalties, and scrutiny notices from the GST department. Our systematic reconciliation process ensures that every rupee of ITC you're entitled to is claimed, and every discrepancy is resolved before the annual return filing.",
    includes: [
      "Month-wise GSTR-2A vs Purchase Register matching",
      "GSTR-2B reconciliation and ITC eligibility analysis",
      "Identification of missing invoices and vendor follow-up",
      "Blocked credit (Rule 36(4)) computation",
      "GSTR-3B vs GSTR-1 output liability reconciliation",
      "Annual reconciliation for GSTR-9/9C",
      "Discrepancy reports with actionable recommendations",
    ],
    whoFor: "Manufacturing companies, trading firms, exporters, e-commerce operators, and any business with monthly GST liability.",
  },
  {
    id: "forensic", icon: Search,
    title: "Forensic Accounting",
    law: "Companies Act 2013 | PMLA | IPC Provisions",
    pricing: "Custom quote — based on scope",
    description: "Forensic accounting merges accounting expertise with investigative skills to uncover financial irregularities, fraud, and misappropriation. Whether you suspect vendor fraud, employee embezzlement, or need evidence for litigation, our forensic investigation follows a rigorous, court-admissible methodology.",
    includes: [
      "Financial statement fraud examination",
      "Vendor and procurement fraud investigation",
      "Cash flow analysis and fund tracing",
      "Round-trip and circular transaction detection",
      "Payroll fraud and ghost employee detection",
      "Digital forensics support (document authentication)",
      "Expert witness report preparation",
    ],
    whoFor: "Companies suspecting internal fraud, banks, insurance companies, legal firms requiring financial expert testimony, and insolvency professionals.",
  },
  {
    id: "income-tax", icon: Calculator,
    title: "Income Tax Advisory",
    law: "Income Tax Act, 1961 | Finance Act 2025 | AY 2025-26",
    pricing: "ITR filing from ₹1,500 · Advisory from ₹5,000",
    description: "Navigating India's complex income tax landscape requires not just compliance but strategic planning. We provide end-to-end income tax services from ITR preparation to representing clients before tax authorities. Our analysis covers old vs new regime comparison, deduction optimization, capital gains planning, and advance tax computation.",
    includes: [
      "ITR-1 to ITR-6 preparation and e-filing",
      "Old vs New tax regime analysis and recommendation",
      "Advance tax computation and challan filing",
      "Capital gains tax optimization (STCG/LTCG)",
      "Scrutiny notice (143(2)/148) handling",
      "Appeals before CIT(A) and ITAT",
      "Tax planning for HUF, partnerships, and companies",
    ],
    whoFor: "Salaried individuals, business owners, NRIs, HUFs, partnership firms, LLPs, and private limited companies.",
  },
  {
    id: "tds", icon: ClipboardCheck,
    title: "TDS Compliance",
    law: "Sec 192–194N, Income Tax Act | Form 24Q, 26Q, 27Q",
    pricing: "Starting from ₹2,500 / quarter",
    description: "TDS (Tax Deducted at Source) compliance involves timely deduction, deposit, and return filing across multiple sections. Defaults attract interest under Sec 201(1A) and penalties under Sec 271C. Our TDS management service ensures zero defaults — from rate determination to TRACES reconciliation.",
    includes: [
      "TDS deduction rate determination (Sec 192–194N)",
      "Quarterly TDS return filing (24Q/26Q/27EQ/27Q)",
      "Challan 281 computation and payment tracking",
      "Form 16/16A generation and distribution",
      "26AS reconciliation with books of accounts",
      "TDS default rectification and interest computation",
      "Lower deduction certificate (Form 13) assistance",
    ],
    whoFor: "Employers paying salaries, businesses making contractor/professional payments, companies with NRI transactions, and any entity deducting TDS.",
  },
  {
    id: "audit", icon: BarChart3,
    title: "Audit & Assurance",
    law: "Companies Act 2013 | SA (Standards on Auditing) | ICAI Guidelines",
    pricing: "Statutory audit from ₹15,000 · Tax audit from ₹8,000",
    description: "Our audit and assurance services go beyond tick-box compliance. We conduct risk-based audits that identify control weaknesses, operational inefficiencies, and compliance gaps. The management letter accompanying every audit provides practical, prioritized recommendations that add real business value.",
    includes: [
      "Statutory audit under Companies Act 2013",
      "Tax audit under Sec 44AB (Form 3CD/3CB)",
      "Internal audit with risk-based approach",
      "GST audit and annual return (GSTR-9C)",
      "Stock audit and physical verification",
      "Compliance audit (FEMA, SEBI, RBI)",
      "Management letter with improvement recommendations",
    ],
    whoFor: "Private and public limited companies, LLPs, partnership firms with turnover above threshold, NGOs, and any entity requiring independent financial verification.",
  },
  {
    id: "business", icon: Briefcase,
    title: "Business Advisory",
    law: "Companies Act 2013 | MSME Act | Startup India Framework",
    pricing: "Virtual CFO from ₹8,000 / month",
    description: "Beyond compliance, we help businesses grow profitably. Our business advisory service combines financial analysis with strategic thinking — identifying where your business is leaking money, how to structure it for tax efficiency, and what financial benchmarks to track for sustainable growth.",
    includes: [
      "Business structure optimization (Proprietorship/LLP/Pvt Ltd)",
      "Working capital and cash flow analysis",
      "Cost centre analysis and profitability mapping",
      "Financial projections and budgeting",
      "Due diligence for business acquisition or investment",
      "MSME registration and scheme advisory",
      "Virtual CFO services for startups and SMEs",
    ],
    whoFor: "Startups, SMEs, family businesses undergoing succession planning, entrepreneurs planning expansion, and businesses seeking investment or preparing for acquisition.",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-[60px]" style={{ background: "var(--ap-bg)" }}>

      {/* Hero */}
      <section className="relative overflow-hidden py-20" style={{ background: "linear-gradient(135deg, #050A14 0%, #0A1628 60%, #0F1E35 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ background: "radial-gradient(circle, #1E50C8, transparent)" }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-[100px] opacity-15" style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C" }}>
            <Sparkles size={12} />
            What We Offer
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5">
            Expert Tax &amp; Finance<br />
            <span style={{ color: "#C9A84C" }}>Services</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.55)" }}>
            Comprehensive tax and finance services built for Indian businesses. Each engagement is handled with precision, confidentiality, and deep domain expertise.
          </p>

          {/* Service quick nav */}
          <div className="flex flex-wrap gap-2 mt-8">
            {services.map((s) => (
              <a key={s.id} href={`#${s.id}`}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)" }}>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {services.map((service, idx) => (
            <div
              key={service.id}
              id={service.id}
              data-reveal
              className="rounded-2xl overflow-hidden scroll-mt-24"
              style={{ background: "var(--ap-surface)", border: "1px solid var(--ap-border)" }}
            >
              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-8">

                  {/* Left */}
                  <div className="lg:w-1/3">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, rgba(10,22,40,0.8), rgba(31,48,136,0.6))", border: "1px solid rgba(201,168,76,0.3)" }}>
                        <service.icon size={22} style={{ color: "#C9A84C" }} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#C9A84C" }}>
                          Service {String(idx + 1).padStart(2, "0")}
                        </div>
                        <h2 className="text-xl font-bold" style={{ color: "var(--ap-text)" }}>{service.title}</h2>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
                      style={{ background: "rgba(10,22,40,0.12)", border: "1px solid rgba(10,22,40,0.15)", color: "var(--ap-text-muted)" }}>
                      <Scale size={10} />
                      {service.law}
                    </div>

                    <div className="flex items-center gap-1.5 mb-5 text-sm">
                      <IndianRupee size={13} style={{ color: "#C9A84C", flexShrink: 0 }} />
                      <span className="font-semibold" style={{ color: "#C9A84C" }}>{service.pricing}</span>
                    </div>

                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--ap-text-muted)" }}>{service.description}</p>

                    <div className="flex items-start gap-2 text-sm" style={{ color: "var(--ap-text-muted)" }}>
                      <Users size={14} style={{ color: "var(--ap-text-muted)", marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <span className="font-semibold" style={{ color: "var(--ap-text)" }}>Who It&apos;s For: </span>
                        {service.whoFor}
                      </div>
                    </div>

                    <Link href="/contact" className="btn-gold gap-2 mt-6 w-full justify-center text-sm">
                      Enquire Now <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Right */}
                  <div className="lg:w-2/3 rounded-xl p-6" style={{ background: "var(--ap-surface-2)", border: "1px solid var(--ap-border)" }}>
                    <h3 className="font-semibold text-xs uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: "var(--ap-text-muted)" }}>
                      <CheckCircle size={13} style={{ color: "#C9A84C" }} />
                      What&apos;s Included
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--ap-text-muted)" }}>
                          <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#4ADE80" }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #050A14 0%, #0A1628 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Not sure which service you need?
          </h2>
          <p className="mb-8 text-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
            Get a free 30-minute consultation call. We&apos;ll assess your situation and recommend the right approach.
          </p>
          <Link href="/contact" className="btn-gold gap-2 text-base px-8 py-3">
            Schedule a Free Call <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
