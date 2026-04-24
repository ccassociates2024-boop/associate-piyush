import type { Metadata } from "next";
import Link from "next/link";
import {
  RefreshCw, Search, Calculator, ClipboardCheck, BarChart3, Briefcase,
  CheckCircle, ArrowRight, Scale, Users, Building2, IndianRupee
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tax & Finance Services",
  description:
    "Comprehensive tax and finance services in Pune — GST Reconciliation, Forensic Accounting, Income Tax Advisory, TDS Compliance, Audit & Assurance, Business Advisory. Pan India. Call +91 75073 54141.",
  keywords: [
    "GST reconciliation pune",
    "forensic accounting pune",
    "income tax advisory pune",
    "TDS compliance pune",
    "audit assurance pune",
    "business advisory pune",
    "tax services pune",
    "Piyush Nimse services",
  ],
  alternates: {
    canonical: "https://associatepiyush.in/services",
  },
  openGraph: {
    title: "Tax & Finance Services | Associate Piyush",
    description:
      "GST Reconciliation, Forensic Accounting, Income Tax, TDS & more. Expert services by Piyush Nimse, Pune.",
    url: "https://associatepiyush.in/services",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tax Services - Associate Piyush" }],
  },
};

const services = [
  {
    id: "gst",
    icon: RefreshCw,
    title: "GST Reconciliation",
    law: "Sec 16(2) CGST Act, 2017 | GSTR-2A/2B Matching",
    pricing: "Starting from ₹3,500 / month",
    description:
      "GST Input Tax Credit (ITC) reconciliation is critical for every registered business. A mismatch between your purchase register and GSTR-2A/2B can lead to ITC reversal, penalties, and scrutiny notices from the GST department. Our systematic reconciliation process ensures that every rupee of ITC you're entitled to is claimed, and every discrepancy is resolved before the annual return filing.",
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
    cta: "Enquire Now",
  },
  {
    id: "forensic",
    icon: Search,
    title: "Forensic Accounting",
    law: "Companies Act 2013 | PMLA | IPC Provisions",
    pricing: "Custom quote — based on scope",
    description:
      "Forensic accounting merges accounting expertise with investigative skills to uncover financial irregularities, fraud, and misappropriation. Whether you suspect vendor fraud, employee embezzlement, or need evidence for litigation, our forensic investigation follows a rigorous, court-admissible methodology. We analyze transaction patterns, trace fund flows, and document findings that can withstand legal scrutiny.",
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
    cta: "Enquire Now",
  },
  {
    id: "income-tax",
    icon: Calculator,
    title: "Income Tax Advisory",
    law: "Income Tax Act, 1961 | Finance Act 2025 | AY 2025-26",
    pricing: "ITR filing from ₹1,500 · Advisory from ₹5,000",
    description:
      "Navigating India's complex income tax landscape requires not just compliance but strategic planning. We provide end-to-end income tax services from ITR preparation to representing clients before tax authorities. Our analysis covers old vs new regime comparison, deduction optimization, capital gains planning, and advance tax computation to minimize your tax liability within legal bounds.",
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
    cta: "Enquire Now",
  },
  {
    id: "tds",
    icon: ClipboardCheck,
    title: "TDS Compliance",
    law: "Sec 192–194N, Income Tax Act | Form 24Q, 26Q, 27Q",
    pricing: "Starting from ₹2,500 / quarter",
    description:
      "TDS (Tax Deducted at Source) compliance involves timely deduction, deposit, and return filing across multiple sections. Defaults attract interest under Sec 201(1A) and penalties under Sec 271C. Our TDS management service ensures zero defaults — from rate determination to TRACES reconciliation and correction filing.",
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
    cta: "Enquire Now",
  },
  {
    id: "audit",
    icon: BarChart3,
    title: "Audit & Assurance",
    law: "Companies Act 2013 | SA (Standards on Auditing) | ICAI Guidelines",
    pricing: "Statutory audit from ₹15,000 · Tax audit from ₹8,000",
    description:
      "Our audit and assurance services go beyond tick-box compliance. We conduct risk-based audits that identify control weaknesses, operational inefficiencies, and compliance gaps. The management letter accompanying every audit provides practical, prioritized recommendations that add real business value beyond the statutory requirement.",
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
    cta: "Enquire Now",
  },
  {
    id: "business",
    icon: Briefcase,
    title: "Business Advisory",
    law: "Companies Act 2013 | MSME Act | Startup India Framework",
    pricing: "Virtual CFO from ₹8,000 / month",
    description:
      "Beyond compliance, we help businesses grow profitably. Our business advisory service combines financial analysis with strategic thinking — identifying where your business is leaking money, how to structure it for tax efficiency, and what financial benchmarks to track for sustainable growth. We work as a virtual CFO for SMEs that need senior financial guidance without the full-time cost.",
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
    cta: "Enquire Now",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">What We Offer</p>
            <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
            <p className="text-blue-200 text-lg leading-relaxed">
              Comprehensive tax and finance services built for Indian businesses. Each engagement is handled with precision, confidentiality, and deep domain expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {services.map((service, idx) => (
              <div
                key={service.id}
                id={service.id}
                className="bg-white rounded-card shadow-card border border-gray-100 overflow-hidden scroll-mt-24"
              >
                <div className="p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left */}
                    <div className="lg:w-1/3">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <service.icon size={24} className="text-primary" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gold uppercase tracking-wide mb-0.5">
                            Service {String(idx + 1).padStart(2, "0")}
                          </div>
                          <h2 className="text-xl font-bold text-dark">{service.title}</h2>
                        </div>
                      </div>

                      {/* Law badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 rounded-full text-primary text-xs font-medium mb-3">
                        <Scale size={11} />
                        {service.law}
                      </div>

                      {/* Pricing signal */}
                      <div className="flex items-center gap-1.5 mb-4 text-sm">
                        <IndianRupee size={13} className="text-gold flex-shrink-0" />
                        <span className="text-gold font-semibold">{service.pricing}</span>
                      </div>

                      <p className="text-muted text-sm leading-relaxed">{service.description}</p>

                      {/* Who it's for */}
                      <div className="mt-5 flex items-start gap-2 text-sm text-muted">
                        <Users size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-dark">Who It&apos;s For: </span>
                          {service.whoFor}
                        </div>
                      </div>

                      <Link href="/contact" className="btn-gold gap-2 mt-6 w-full justify-center">
                        {service.cta} <ArrowRight size={15} />
                      </Link>
                    </div>

                    {/* Right: Includes */}
                    <div className="lg:w-2/3 bg-background rounded-lg p-6">
                      <h3 className="font-semibold text-dark text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Building2 size={14} className="text-gold" />
                        What&apos;s Included
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {service.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-muted">
                            <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
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
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Not sure which service you need?
          </h2>
          <p className="text-blue-200 mb-6">
            Get a free 30-minute consultation call. We&apos;ll assess your situation and recommend the right approach.
          </p>
          <Link href="/contact" className="btn-gold gap-2">
            Schedule a Free Call <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
