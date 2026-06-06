"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RefreshCw, Search, Calculator, ClipboardCheck, BarChart3, Briefcase,
  TrendingUp, FileSpreadsheet, Lightbulb,
  ChevronDown, CheckCircle, Scale, Users, Building2, IndianRupee, ArrowRight,
} from "lucide-react";

/* ─── Services data ──────────────────────────────────────────────────────── */
const services = [
  {
    id: "gst",
    icon: RefreshCw,
    title: "GST",
    tagline: "Compliance · ITC Claims · Refunds",
    law: "CGST Act, 2017 | GST Compliance | ITC Claims",
    pricing: "from ₹3,500 / month",
    keyAreas: ["GST Compliance", "ITC Claim Management"],
    description:
      "End-to-end GST services covering two critical pillars — Compliance and ITC Claims. On the compliance side, we manage your registrations, return filings (GSTR-1, 3B, 9, 9C), and e-invoice obligations so you are always audit-ready. On the ITC side, we ensure every rupee of eligible Input Tax Credit is claimed, reconciled, and defended — and handle refund applications for SEZ suppliers and exporters.",
    includes: [
      "GST registration, amendments & cancellation",
      "Monthly / quarterly GSTR-1 & GSTR-3B filing",
      "Annual return GSTR-9 & GSTR-9C reconciliation statement",
      "E-invoice & e-way bill compliance",
      "GSTR-2A / GSTR-2B vs Purchase Register matching",
      "ITC eligibility analysis & blocked credit (Rule 36(4))",
      "Missing invoice identification & vendor follow-up",
      "GSTR-3B vs GSTR-1 output liability reconciliation",
      "GST refund for SEZ suppliers — zero-rated supply",
      "GST refund for exporters (with & without payment of tax)",
    ],
    whoFor:
      "GST Compliance applies to every registered business. ITC Claim Management is specifically critical for: Manufacturers & traders with high input purchases · SEZ units (zero-rated outward supply) · Exporters (LUT / IGST refund) · Businesses with inverted duty structure · E-commerce operators with TCS deducted at source.",
    cta: "Enquire Now",
  },
  {
    id: "income-tax",
    icon: Calculator,
    title: "Income Tax Advisory",
    tagline: "ITR Filing · Planning · Scrutiny · Appeals",
    law: "Income Tax Act, 1961 | Finance Act 2025 | AY 2025-26",
    pricing: "ITR from ₹2,500 · Advisory from ₹5,000",
    description:
      "End-to-end income tax services from ITR preparation to representing clients before tax authorities. Covers old vs new regime comparison, deduction optimisation, LTCG on property sale, and advance tax computation.",
    includes: [
      "ITR-1 to ITR-6 preparation and e-filing",
      "Old vs New tax regime analysis & recommendation",
      "Advance tax computation and challan filing",
      "LTCG on sale of property — Section 54 / 54F relief",
      "Capital gains tax optimisation (STCG / LTCG)",
      "Scrutiny notice (143(2) / 148) handling",
      "Appeals before CIT(A) and ITAT",
      "Tax planning for HUF, partnerships, and companies",
    ],
    whoFor:
      "Salaried individuals, business owners, NRIs, HUFs, partnership firms, LLPs, and private limited companies.",
    cta: "Enquire Now",
  },
  {
    id: "tds",
    icon: ClipboardCheck,
    title: "TDS Compliance",
    tagline: "Deduction · Filing · 26AS Reconciliation",
    law: "Sec 192–194N, Income Tax Act | Form 24Q, 26Q, 27Q",
    pricing: "from ₹3,500 / quarter",
    description:
      "TDS compliance covering rate determination, challan payment, quarterly return filing, and TRACES reconciliation. Defaults attract interest under Sec 201(1A) and penalties under Sec 271C — we ensure zero defaults.",
    includes: [
      "TDS rate determination (Sec 192–194N)",
      "Quarterly return filing (24Q / 26Q / 27EQ / 27Q)",
      "Challan 281 computation and payment tracking",
      "Form 16 / 16A generation and distribution",
      "26AS reconciliation with books of accounts",
      "TDS default rectification and interest computation",
      "Lower deduction certificate (Form 13) assistance",
    ],
    whoFor:
      "Employers paying salaries, businesses making contractor / professional payments, companies with NRI transactions, and any entity deducting TDS.",
    cta: "Enquire Now",
  },
  {
    id: "audit",
    icon: BarChart3,
    title: "Audit & Assurance",
    tagline: "Statutory · Tax Audit · Internal · GSTR-9C",
    law: "Companies Act 2013 | Standards on Auditing | ICAI Guidelines",
    pricing: "Statutory audit from ₹30,000 · Tax audit from ₹25,000",
    description:
      "Risk-based audits that go beyond tick-box compliance — identifying control weaknesses, operational gaps, and providing a management letter with prioritised recommendations that add real business value.",
    includes: [
      "Statutory audit under Companies Act 2013",
      "Tax audit under Sec 44AB (Form 3CD / 3CB)",
      "Internal audit with risk-based approach",
      "GST audit and annual return (GSTR-9C)",
      "Stock audit and physical verification",
      "Compliance audit (FEMA, SEBI, RBI)",
      "Management letter with improvement recommendations",
    ],
    whoFor:
      "Private and public limited companies, LLPs, partnership firms above threshold turnover, NGOs, and any entity requiring independent financial verification.",
    cta: "Enquire Now",
  },
  {
    id: "virtual-cfo",
    icon: TrendingUp,
    title: "Virtual CFO Service",
    tagline: "MIS · Budgeting · Cash Flow · Investor Readiness",
    law: "Companies Act 2013 | ICAI Guidelines | MCA Regulations",
    pricing: "from ₹25,000 / month",
    description:
      "Senior-level financial leadership without the cost of a full-time hire. We become your financial backbone — managing reporting, planning, and compliance so you can focus on growth.",
    includes: [
      "Monthly MIS reports & financial dashboards",
      "Budgeting, forecasting & variance analysis",
      "P&L, cash flow & balance sheet management",
      "Board-level financial presentation preparation",
      "Fund planning & investor readiness support",
      "Compliance calendar management (GST, TDS, ROC)",
      "Cost optimisation & profitability improvement",
    ],
    whoFor:
      "Startups, SMEs, e-commerce businesses, and founders who need professional financial oversight without a full-time CFO salary.",
    cta: "Enquire Now",
  },
  {
    id: "outsourced-accounting",
    icon: FileSpreadsheet,
    title: "Outsourced Accounting",
    tagline: "Bookkeeping · Bank Recon · Payroll · MIS",
    law: "Companies Act 2013 | Income Tax Act | CGST Act",
    pricing: "from ₹5,000 / month",
    description:
      "Full-cycle bookkeeping and accounting — maintained as if we are your in-house team, without the overhead of salaries, software, and training costs.",
    includes: [
      "Daily / monthly bookkeeping (Tally or preferred software)",
      "Bank & credit card reconciliation",
      "Accounts payable & receivable management",
      "GST-ready books with ITC tracking",
      "Payroll processing & salary statements",
      "Monthly / quarterly MIS reports",
      "Year-end financial statements (Balance Sheet, P&L)",
    ],
    whoFor:
      "SMEs, startups, sole proprietors, professionals, and traders who want accurate books without an in-house accounting team.",
    cta: "Enquire Now",
  },
  {
    id: "financial-consultation",
    icon: Lightbulb,
    title: "Financial Consultation",
    tagline: "Planning · Profitability · Roadmap · Risk Review",
    law: "Income Tax Act, 1961 | CGST Act | Companies Act 2013",
    pricing: "from ₹2,000 / session",
    description:
      "Clear, actionable financial guidance combining tax expertise with financial planning — helping individuals and businesses make decisions that are legally sound and financially optimal.",
    includes: [
      "Personal & business financial health check-up",
      "Tax-efficient investment & savings planning",
      "Debt restructuring & liability management advice",
      "Business profitability & cost structure analysis",
      "Regulatory compliance review & risk assessment",
      "Succession & wealth transfer planning",
      "Custom financial roadmap tailored to your goals",
    ],
    whoFor:
      "Individuals, salaried professionals, entrepreneurs, SME owners, and NRIs seeking expert financial guidance.",
    cta: "Enquire Now",
  },
  {
    id: "forensic",
    icon: Search,
    title: "Forensic Accounting",
    tagline: "Fraud Detection · Fund Tracing · Expert Reports",
    law: "Companies Act 2013 | PMLA | IPC Provisions",
    pricing: "Custom quote — based on scope",
    description:
      "Investigative accounting to uncover financial irregularities, fraud, and misappropriation. Rigorous, court-admissible methodology — from transaction pattern analysis to expert witness report preparation.",
    includes: [
      "Financial statement fraud examination",
      "Vendor and procurement fraud investigation",
      "Cash flow analysis and fund tracing",
      "Round-trip and circular transaction detection",
      "Payroll fraud and ghost employee detection",
      "Digital forensics support (document authentication)",
      "Expert witness report preparation",
    ],
    whoFor:
      "Companies suspecting internal fraud, banks, insurance companies, legal firms requiring financial expert testimony, and insolvency professionals.",
    cta: "Enquire Now",
  },
  {
    id: "business",
    icon: Briefcase,
    title: "Business Advisory",
    tagline: "Structuring · Working Capital · Growth Strategy",
    law: "Companies Act 2013 | MSME Act | Startup India Framework",
    pricing: "from ₹5,000 / engagement",
    description:
      "Strategic advisory combining financial analysis with business thinking — identifying where money is leaking, how to structure for tax efficiency, and which benchmarks to track for sustainable growth.",
    includes: [
      "Business structure optimisation (Proprietorship / LLP / Pvt Ltd)",
      "Working capital and cash flow analysis",
      "Cost centre analysis and profitability mapping",
      "Financial projections and budgeting",
      "Due diligence for acquisition or investment",
      "MSME registration and scheme advisory",
      "Growth strategy and financial benchmarking",
    ],
    whoFor:
      "Startups, SMEs, family businesses, entrepreneurs planning expansion, and businesses seeking investment or preparing for acquisition.",
    cta: "Enquire Now",
  },
];

/* ─── Accordion component ────────────────────────────────────────────────── */
export default function ServicesAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  // Auto-open if URL has a hash anchor (e.g. /services#gst)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) setOpenId(hash);
  }, []);

  const toggle = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-2">
      {services.map((svc, idx) => {
        const isOpen = openId === svc.id;
        const keyAreas = "keyAreas" in svc ? (svc as typeof svc & { keyAreas: string[] }).keyAreas : undefined;

        return (
          <div
            key={svc.id}
            id={svc.id}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden scroll-mt-24"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            {/* ── Header row (always visible) ── */}
            <button
              onClick={() => toggle(svc.id)}
              className="w-full flex items-center gap-4 px-5 py-4 lg:px-6 text-left
                         hover:bg-gray-50 transition-colors group"
            >
              {/* Number */}
              <span className="hidden sm:block text-xs font-bold text-gold/60 w-6 flex-shrink-0 tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                <svc.icon size={18} className="text-primary" />
              </div>

              {/* Title + tagline */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <span className="font-bold text-dark text-sm sm:text-base">{svc.title}</span>
                  {keyAreas?.map((area) => (
                    <span
                      key={area}
                      className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:inline-block"
                      style={{ background: "#FEF9EC", color: "#92680A", border: "1px solid #F0C842" }}
                    >
                      ★ {area}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted truncate">{svc.tagline}</p>
              </div>

              {/* Price */}
              <span className="hidden md:flex items-center gap-1 text-xs font-semibold text-gold flex-shrink-0">
                <IndianRupee size={11} />
                {svc.pricing}
              </span>

              {/* Chevron */}
              <ChevronDown
                size={16}
                className={`text-muted flex-shrink-0 transition-transform duration-200
                            ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* ── Expanded body ── */}
            {isOpen && (
              <div className="border-t border-gray-100 p-5 lg:p-7 bg-background">
                <div className="flex flex-col lg:flex-row gap-7">

                  {/* Left: meta + description + CTA */}
                  <div className="lg:w-2/5 space-y-4">

                    {/* Law & price row */}
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/8
                                      rounded-full text-primary text-xs font-medium">
                        <Scale size={10} />
                        {svc.law}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm">
                      <IndianRupee size={13} className="text-gold flex-shrink-0" />
                      <span className="text-gold font-semibold">{svc.pricing}</span>
                    </div>

                    {/* Key area badges (full labels) */}
                    {keyAreas && (
                      <div className="flex flex-wrap gap-2">
                        {keyAreas.map((area) => (
                          <span
                            key={area}
                            className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: "#FEF9EC", color: "#92680A", border: "1px solid #F0C842" }}
                          >
                            ★ {area}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-muted text-sm leading-relaxed">{svc.description}</p>

                    <div className="flex items-start gap-2 text-sm text-muted">
                      <Users size={13} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-dark">Who It&apos;s For: </span>
                        {svc.whoFor}
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      className="btn-gold gap-2 w-full justify-center text-sm"
                    >
                      {svc.cta} <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Right: What's included */}
                  <div className="lg:w-3/5 bg-white rounded-xl p-5 border border-gray-100">
                    <h3 className="font-semibold text-dark text-xs uppercase tracking-widest mb-4
                                   flex items-center gap-2">
                      <Building2 size={13} className="text-gold" />
                      What&apos;s Included
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {svc.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs sm:text-sm text-muted">
                          <CheckCircle size={13} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
