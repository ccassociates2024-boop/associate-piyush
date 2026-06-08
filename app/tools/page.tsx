import type { Metadata } from "next";
import { Shield } from "lucide-react";
import ToolsGrid from "./ToolsGrid";

export const metadata: Metadata = {
  title: "Free Tax & Finance Tools",
  description:
    "17 free professional-grade tax and finance tools for Indian businesses — GST Invoice Generator, TDS Calculator, ITR Estimator (FY 2026-27), GSTR-2A Reconciliation, Multi-Bank PDF to Excel & more. 100% browser-based, no data stored.",
  keywords: [
    "free GST invoice generator",
    "TDS calculator india",
    "ITR estimator 2026-27",
    "GSTR-2A reconciliation tool",
    "advance tax calculator",
    "GST late fee calculator",
    "26AS reconciliation",
    "free tax tools india",
    "PDF merge online",
    "word to pdf converter",
  ],
  alternates: {
    canonical: "https://associatepiyush.co.in/tools",
  },
  openGraph: {
    title: "Free Tax & Finance Tools | Associate Piyush",
    description:
      "17 free browser-based tools: GST Invoice, TDS Calculator, ITR Estimator, PDF tools & more. No signup needed.",
    url: "https://associatepiyush.co.in/tools",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Tax Tools - Associate Piyush" }],
  },
};

export default function ToolsPage() {
  return (
    <div className="pt-16">

      {/* Hero */}
      <section style={{ background: "var(--ap-surface)", borderBottom: "1px solid var(--ap-border)" }}
               className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2"
             style={{ color: "var(--ap-gold)" }}>Free Tools</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--ap-text)" }}>
            Tax &amp; Finance Tools
          </h1>
          <p className="text-sm leading-relaxed max-w-xl mb-5" style={{ color: "var(--ap-text-muted)" }}>
            15+ professional-grade tools built for Indian tax compliance. No login, no data stored — everything runs in your browser.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
               style={{ background: "rgba(22,163,74,0.08)", color: "#16A34A", border: "1px solid rgba(22,163,74,0.15)" }}>
            <Shield size={11} /> 100% Private — Your data never leaves your device
          </div>
        </div>
      </section>

      {/* Tools Grid (client — has category filter) */}
      <section className="py-8" style={{ background: "var(--ap-bg)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ToolsGrid />
        </div>
      </section>

      {/* Bottom disclaimer */}
      <section className="py-8 border-t ap-divider" style={{ background: "var(--ap-surface)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs" style={{ color: "var(--ap-text-muted)" }}>
            <strong style={{ color: "var(--ap-text-2)" }}>Disclaimer:</strong> All tool results are indicative only. Always consult a qualified tax professional for final decisions. Associate Piyush is not liable for any decisions made based on tool outputs. © 2026 Associate Piyush, Pune.
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--ap-text-muted)" }}>
            Capital Gains tool does not account for Sec 54/54F/54EC reinvestment exemptions, STT paid grandfathering (pre-31 Jan 2018 equity), or partial sale scenarios. Updated for Income-tax Act, 2025.
          </p>
        </div>
      </section>

    </div>
  );
}
