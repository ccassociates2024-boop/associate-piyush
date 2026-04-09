import Link from "next/link";
import {
  FileSpreadsheet,
  Search,
  Calculator,
  ClipboardCheck,
  BarChart3,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Users,
  MapPin,
  Calendar,
  FileText,
  RefreshCw,
  Clock,
  TrendingUp,
  Merge,
  Minimize2,
  FileOutput,
  Table,
  Database,
} from "lucide-react";

const services = [
  {
    icon: RefreshCw,
    title: "GST Reconciliation",
    desc: "Accurate GSTR-2A/2B matching, ITC eligibility analysis, and discrepancy resolution under Sec 16(2) CGST Act.",
    href: "/services#gst",
  },
  {
    icon: Search,
    title: "Forensic Accounting",
    desc: "Financial fraud detection, transaction trail analysis, and investigative accounting for legal proceedings.",
    href: "/services#forensic",
  },
  {
    icon: Calculator,
    title: "Income Tax Advisory",
    desc: "ITR filing, tax planning, scrutiny handling, and regime optimization for individuals and businesses.",
    href: "/services#income-tax",
  },
  {
    icon: ClipboardCheck,
    title: "TDS Compliance",
    desc: "Section 192–194N TDS computation, return filing, 26AS reconciliation, and default rectification.",
    href: "/services#tds",
  },
  {
    icon: BarChart3,
    title: "Audit & Assurance",
    desc: "Statutory, internal, and compliance audits with actionable findings and management letter.",
    href: "/services#audit",
  },
  {
    icon: Briefcase,
    title: "Business Advisory",
    desc: "Business structuring, cost optimization, financial planning, and growth strategy for SMEs.",
    href: "/services#business",
  },
];

const tools = [
  { icon: FileText, label: "GST Invoice Generator", href: "/tools/gst-invoice", badge: "Popular" },
  { icon: Calculator, label: "TDS Calculator", href: "/tools/tds-calculator", badge: "" },
  { icon: BarChart3, label: "ITR Tax Estimator", href: "/tools/itr-estimator", badge: "New" },
  { icon: FileSpreadsheet, label: "GSTR-2A Recon", href: "/tools/gstr2a-recon", badge: "" },
  { icon: Clock, label: "GST Late Fee Calc", href: "/tools/gst-late-fee", badge: "" },
  { icon: RefreshCw, label: "26AS TDS Recon", href: "/tools/26as-recon", badge: "" },
  { icon: TrendingUp, label: "Advance Tax Calc", href: "/tools/advance-tax", badge: "" },
  { icon: Merge, label: "PDF Merge", href: "/tools/pdf-merge", badge: "" },
  { icon: Minimize2, label: "PDF Compress", href: "/tools/pdf-compress", badge: "" },
  { icon: FileOutput, label: "Word to PDF", href: "/tools/word-to-pdf", badge: "" },
];

const testimonials = [
  {
    name: "Rajesh Mehta",
    role: "Director, Mehta Textiles Pvt. Ltd., Pune",
    text: "Associate Piyush resolved our 3-year GST ITC mismatch within a week. The reconciliation report was meticulous and helped us claim ₹4.2 lakhs of blocked credit. Highly professional service.",
    stars: 5,
  },
  {
    name: "Priya Sharma",
    role: "CFO, TechBridge Solutions, Bangalore",
    text: "We engaged Associate Piyush for a forensic audit after detecting irregularities in vendor payments. The investigation was thorough, confidential, and the findings report held up in legal proceedings.",
    stars: 5,
  },
  {
    name: "Suresh Patil",
    role: "Proprietor, Patil Agro Exports, Nasik",
    text: "Switched from old to new tax regime after their detailed comparison. Saved ₹1.8 lakhs in taxes this year. The ITR estimator tool on the website gave me confidence before the consultation.",
    stars: 5,
  },
];

const stats = [
  { value: "500+", label: "Cases Handled" },
  { value: "100%", label: "GST Compliance" },
  { value: "Pan India", label: "Service Reach" },
  { value: "Since 2020", label: "Years of Trust" },
];

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/8 rounded-full text-primary text-xs font-semibold mb-6">
                <MapPin size={12} />
                Pune, Maharashtra — Pan India Services
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-dark leading-tight text-balance mb-5">
                Precision in Every Number.{" "}
                <span className="text-primary">Compliance</span> in Every Step.
              </h1>
              <p className="text-lg text-muted leading-relaxed mb-8 max-w-xl">
                Expert Tax Advisory, GST Reconciliation & Forensic Accounting Services for Businesses Across India.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/services" className="btn-primary gap-2">
                  Explore Services <ArrowRight size={16} />
                </Link>
                <Link href="/tools" className="btn-outline gap-2">
                  Try Free Tools <Calculator size={16} />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-5 text-sm text-muted">
                {["Confidential", "Pan India", "Quick Turnaround"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AP Avatar */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border-4 border-gold bg-primary/8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl lg:text-7xl font-bold text-primary mb-2">AP</div>
                    <div className="text-sm font-medium text-muted">Tax & Finance</div>
                    <div className="text-sm font-medium text-muted">Consultant</div>
                  </div>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border border-gold px-4 py-2 rounded-full shadow-card">
                  <span className="text-xs font-semibold text-dark">📍 Pune, Maharashtra</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-gold mb-1">{s.value}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle mx-auto">
              Comprehensive tax and finance solutions tailored for Indian businesses.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <div key={s.title} className="card-hover group">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <s.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-semibold text-dark text-base mb-2">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-4">{s.desc}</p>
                <Link
                  href={s.href}
                  className="text-primary text-sm font-medium hover:text-primary-600 flex items-center gap-1 group/link"
                >
                  Learn More <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services" className="btn-primary gap-2">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Free Tools Preview */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full text-green-700 text-xs font-semibold mb-4">
              <Shield size={12} />
              100% Free — No Login Required — Runs in Your Browser
            </div>
            <h2 className="section-title">Free Tax & Finance Tools</h2>
            <p className="section-subtitle mx-auto">
              Professional-grade tools built for Indian tax compliance. Your data never leaves your device.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-10">
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="card group hover:shadow-card-hover hover:border-primary/30 transition-all duration-200 relative flex flex-col items-center text-center p-4"
              >
                {t.badge && (
                  <span className="absolute -top-2 -right-2 bg-gold text-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {t.badge}
                  </span>
                )}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <t.icon size={18} className="text-primary" />
                </div>
                <span className="text-xs font-medium text-dark leading-tight">{t.label}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/tools" className="btn-outline gap-2">
              View All 12 Tools <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Client Testimonials</h2>
            <p className="section-subtitle mx-auto">
              Trusted by businesses across India for precision and reliability.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card border-t-2 border-t-gold">
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-muted text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-dark text-sm">{t.name}</div>
                  <div className="text-muted text-xs mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Ready to resolve your tax matter?
          </h2>
          <p className="text-blue-200 text-lg mb-2">
            Confidential | Quick Turnaround | Pan India
          </p>
          <p className="text-blue-300 text-sm mb-8">
            Get expert guidance tailored to your specific situation.
          </p>
          <Link href="/contact" className="btn-gold gap-2">
            Get in Touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
