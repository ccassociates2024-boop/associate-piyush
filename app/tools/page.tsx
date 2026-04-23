import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText, Calculator, BarChart3, FileSpreadsheet, Clock, RefreshCw,
  TrendingUp, Merge, Minimize2, FileOutput, Database, Table, Shield, ArrowRight,
  Landmark, ScrollText, LayoutDashboard, Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Tax & Finance Tools",
  description:
    "15 free professional-grade tax and finance tools for Indian businesses — GST Invoice Generator, TDS Calculator, ITR Estimator (FY 2026-27), GSTR-2A Reconciliation, PDF Merge & more. 100% browser-based, no data stored.",
  keywords: [
    "free GST invoice generator", "TDS calculator india", "ITR estimator 2026-27",
    "GSTR-2A reconciliation tool", "advance tax calculator", "GST late fee calculator",
    "26AS reconciliation", "free tax tools india", "PDF merge online", "word to pdf converter",
  ],
  alternates: { canonical: "https://associate-piyush-bduu.vercel.app/tools" },
  openGraph: {
    title: "Free Tax & Finance Tools | Associate Piyush",
    description: "15 free browser-based tools: GST Invoice, TDS Calculator, ITR Estimator, PDF tools & more. No signup needed.",
    url: "https://associate-piyush-bduu.vercel.app/tools",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Tax Tools - Associate Piyush" }],
  },
};

const tools = [
  {
    icon: LayoutDashboard, emoji: "📊",
    label: "Personal Finance Dashboard",
    desc: "Track income, expenses, investments, EMIs, tax & goals. Free personal CFO tool. No login, 100% private.",
    href: "/tools/dashboard",
    badge: "New", badgeGold: false,
    category: "Finance",
  },
  {
    icon: FileText, emoji: "🧾",
    label: "GST Invoice Generator",
    desc: "Generate professional GST-compliant PDF invoices with CGST/SGST/IGST auto-calculation.",
    href: "/tools/gst-invoice",
    badge: "Popular", badgeGold: true,
    category: "GST",
  },
  {
    icon: Calculator, emoji: "🔢",
    label: "TDS Calculator",
    desc: "Calculate TDS rates for Sec 192–194N payments. Get section, rate, amount, and due dates.",
    href: "/tools/tds-calculator",
    badge: "", badgeGold: false,
    category: "TDS",
  },
  {
    icon: BarChart3, emoji: "📈",
    label: "ITR Tax Estimator",
    desc: "Estimate income tax under Old vs New regime with full slab comparison for FY 2025-26.",
    href: "/tools/itr-estimator",
    badge: "New", badgeGold: false,
    category: "Income Tax",
  },
  {
    icon: FileSpreadsheet, emoji: "📋",
    label: "GSTR-2A Reconciliation",
    desc: "Upload Purchase Register + GSTR-2A/2B to find matched, unmatched, and missing invoices.",
    href: "/tools/gstr2a-recon",
    badge: "", badgeGold: false,
    category: "GST",
  },
  {
    icon: Clock, emoji: "⏰",
    label: "GST Late Fee Calculator",
    desc: "Calculate GST late fee (₹50/day) and 18% interest for delayed GSTR filings.",
    href: "/tools/gst-late-fee",
    badge: "", badgeGold: false,
    category: "GST",
  },
  {
    icon: RefreshCw, emoji: "🔄",
    label: "26AS TDS Reconciliation",
    desc: "Match Form 26AS TDS data against your books to identify mismatches and missing entries.",
    href: "/tools/26as-recon",
    badge: "", badgeGold: false,
    category: "TDS",
  },
  {
    icon: TrendingUp, emoji: "📉",
    label: "Advance Tax Calculator",
    desc: "Compute advance tax installments with Sec 234C interest for missed payment deadlines.",
    href: "/tools/advance-tax",
    badge: "", badgeGold: false,
    category: "Income Tax",
  },
  {
    icon: ScrollText, emoji: "📝",
    label: "Notice Reply Generator",
    desc: "Generate professional reply drafts for Sec 143(1), 148A, 139(9), 245, 156 & 131 notices in 60 seconds.",
    href: "/tools/notice-reply",
    badge: "New", badgeGold: false,
    category: "Income Tax",
  },
  {
    icon: Landmark, emoji: "💰",
    label: "Capital Gains Tax Calculator",
    desc: "Calculate STCG & LTCG on equity, mutual funds, and property with indexation for FY 2026-27.",
    href: "/tools/capital-gains",
    badge: "New", badgeGold: false,
    category: "Income Tax",
  },
  {
    icon: Merge, emoji: "📑",
    label: "PDF Merge",
    desc: "Drag, drop, reorder, and merge multiple PDF files into one. No size limit worries.",
    href: "/tools/pdf-merge",
    badge: "", badgeGold: false,
    category: "PDF",
  },
  {
    icon: Minimize2, emoji: "🗜️",
    label: "PDF Compress",
    desc: "Compress PDF file size with quality control slider. See before/after size comparison.",
    href: "/tools/pdf-compress",
    badge: "", badgeGold: false,
    category: "PDF",
  },
  {
    icon: FileOutput, emoji: "📄",
    label: "Word to PDF",
    desc: "Convert .docx files to PDF instantly in your browser. No upload to servers.",
    href: "/tools/word-to-pdf",
    badge: "", badgeGold: false,
    category: "PDF",
  },
  {
    icon: Database, emoji: "🏦",
    label: "Bank Statement to Excel",
    desc: "Extract transactions from PDF bank statements to structured Excel with debit/credit columns.",
    href: "/tools/bank-statement",
    badge: "Advanced", badgeGold: false,
    category: "Finance",
  },
  {
    icon: Table, emoji: "📒",
    label: "Tally Ledger to Excel",
    desc: "Convert Tally Prime ledger exports (.xlsx/.xml/.csv) to structured Excel with forensic flags.",
    href: "/tools/tally-ledger",
    badge: "Advanced", badgeGold: false,
    category: "Finance",
  },
];

const categories = ["All", "GST", "TDS", "Income Tax", "PDF", "Finance"];

const categoryColors: Record<string, string> = {
  GST: "#10B981", TDS: "#6366F1", "Income Tax": "#F59E0B",
  PDF: "#EC4899", Finance: "#3B82F6",
};

export default function ToolsPage() {
  return (
    <div className="pt-[60px]" style={{ background: "var(--ap-bg)" }}>

      {/* Hero */}
      <section className="relative overflow-hidden py-20" style={{ background: "linear-gradient(135deg, #050A14 0%, #0A1628 60%, #0F1E35 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ background: "radial-gradient(circle, #1E50C8, transparent)" }} />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-[100px] opacity-15" style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C" }}>
            <Sparkles size={12} />
            100% Free · Browser-Based · No Signup
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5">
            Free Tax &amp; Finance<br />
            <span style={{ color: "#C9A84C" }}>Tools</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            15 professional-grade tools built for Indian tax compliance and finance workflows. Free forever. Your data never leaves your browser.
          </p>

          {/* Privacy badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80" }}>
            <Shield size={14} />
            All tools run 100% in your browser. No data is sent to any server. Ever.
          </div>
        </div>
      </section>

      {/* Category pills - static display */}
      <div className="sticky top-[60px] z-30 py-3" style={{ background: "var(--ap-nav)", borderBottom: "1px solid var(--ap-border)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            {categories.map((cat) => (
              <span key={cat} className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-default"
                style={{
                  background: cat === "All" ? "rgba(201,168,76,0.15)" : "var(--ap-glass)",
                  border: `1px solid ${cat === "All" ? "rgba(201,168,76,0.4)" : "var(--ap-border)"}`,
                  color: cat === "All" ? "#C9A84C" : "var(--ap-text-muted)",
                }}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="dock-item relative flex flex-col p-5 rounded-2xl group"
                style={{
                  background: "var(--ap-surface)",
                  border: "1px solid var(--ap-border)",
                  transition: "all 0.2s",
                }}
              >
                {tool.badge && (
                  <span className="absolute -top-2 -right-2 text-[9px] font-bold px-2 py-0.5 rounded-full z-10"
                    style={tool.badgeGold
                      ? { background: "#C9A84C", color: "#0A1628" }
                      : { background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.4)", color: "#818CF8" }
                    }>
                    {tool.badge}
                  </span>
                )}

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-2xl transition-transform group-hover:scale-110">
                  {tool.emoji}
                </div>

                {/* Category dot */}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: categoryColors[tool.category] || "#C9A84C" }} />
                  <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "var(--ap-text-muted)" }}>
                    {tool.category}
                  </span>
                </div>

                <h3 className="font-semibold text-sm leading-tight mb-2" style={{ color: "var(--ap-text)" }}>{tool.label}</h3>
                <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--ap-text-muted)" }}>{tool.desc}</p>

                <div className="mt-3 flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2" style={{ color: "#C9A84C" }}>
                  Open <ArrowRight size={11} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10" style={{ background: "var(--ap-surface)", borderTop: "1px solid var(--ap-border)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs" style={{ color: "var(--ap-text-muted)" }}>
            <strong style={{ color: "var(--ap-text)" }}>Disclaimer:</strong> All tool results are indicative only. Always consult a qualified tax professional for final decisions. Associate Piyush is not liable for any decisions made based on tool outputs.
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--ap-text-muted)" }}>
            Capital Gains tool does not account for Sec 54/54F/54EC reinvestment exemptions or pre-31 Jan 2018 equity grandfathering. Updated for Income-tax Act, 2025.
          </p>
        </div>
      </section>
    </div>
  );
}
