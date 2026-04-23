"use client";

import { useState } from "react";
import {
  Phone, Mail, Clock, MapPin, MessageCircle,
  Shield, CheckCircle, ArrowRight, Send,
} from "lucide-react";

const PHONE = "+91 75073 54141";
const PHONE_RAW = "917507354141";
const EMAIL = "associate.piyush.nimse@gmail.com";
const WA_BASE = `https://wa.me/${PHONE_RAW}`;
const WA_QUICK = `${WA_BASE}?text=${encodeURIComponent(
  "Hello Associate Piyush, I need tax consultation. Please get back to me."
)}`;

const SERVICES = [
  "GST Reconciliation", "Income Tax Filing (ITR)", "TDS Compliance",
  "Forensic Accounting", "Tax Notice Reply", "Audit & Assurance",
  "Business Advisory", "Capital Gains Tax", "Other",
];

const INFO_CARDS = [
  { icon: Phone,         label: "Call Directly",   value: PHONE,              sub: "Mon–Sat, 10 AM – 7 PM IST",   href: "tel:+917507354141",   iconBg: "rgba(10,22,40,0.6)",    iconColor: "#C9A84C", external: false },
  { icon: MessageCircle, label: "WhatsApp",         value: "Chat Instantly",   sub: PHONE,                          href: WA_QUICK,              iconBg: "rgba(37,211,102,0.15)", iconColor: "#25D366", external: true  },
  { icon: Mail,          label: "Email",            value: EMAIL,              sub: "Response within 24 hours",     href: `mailto:${EMAIL}`,     iconBg: "rgba(201,168,76,0.15)", iconColor: "#C9A84C", external: false },
  { icon: MapPin,        label: "Location",         value: "Pune, Maharashtra",sub: "Pan India Services",           href: undefined,             iconBg: "rgba(10,22,40,0.6)",    iconColor: "#C9A84C", external: false },
  { icon: Clock,         label: "Working Hours",    value: "Mon–Sat: 10 AM – 7 PM", sub: "Indian Standard Time",  href: undefined,             iconBg: "rgba(10,22,40,0.6)",    iconColor: "#C9A84C", external: false },
];

const TRUST = [
  "Response within 2 hours",
  "Confidential consultation",
  "Pan India service",
  "Since 2025",
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const text =
      `*New Inquiry — Associate Piyush*\n\n` +
      `Name: ${form.name || "—"}\n` +
      `Email: ${form.email || "—"}\n` +
      `Phone: ${form.phone || "—"}\n` +
      `Service: ${form.service || "Tax Consultation"}\n\n` +
      (form.message ? `Message: ${form.message}` : "");
    window.open(`${WA_BASE}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid var(--ap-border)",
    background: "var(--ap-surface-2)",
    color: "var(--ap-text)",
    fontSize: 14,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 6,
    color: "var(--ap-text-muted)",
  };

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── LEFT: Contact Info ── */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--ap-text)" }}>Contact Information</h2>

            {INFO_CARDS.map(({ icon: Icon, label, value, sub, href, iconBg, iconColor, external }) => {
              const inner = (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: iconBg }}>
                    <Icon size={18} style={{ color: iconColor }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--ap-text-muted)" }}>{label}</div>
                    <div className="text-sm font-semibold truncate" style={{ color: "var(--ap-text)" }}>{value}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--ap-text-muted)" }}>{sub}</div>
                  </div>
                </div>
              );

              return href ? (
                <a key={label} href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="block p-4 rounded-2xl transition-all hover:scale-[1.01]"
                  style={{ background: "var(--ap-surface)", border: "1px solid var(--ap-border)" }}>
                  {inner}
                </a>
              ) : (
                <div key={label} className="p-4 rounded-2xl"
                  style={{ background: "var(--ap-surface)", border: "1px solid var(--ap-border)" }}>
                  {inner}
                </div>
              );
            })}

            {/* WhatsApp CTA */}
            <a href={WA_QUICK} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 font-semibold rounded-xl px-5 py-4 transition-all hover:scale-[1.01] mt-2"
              style={{ background: "#25D366", color: "#fff" }}>
              <div className="flex items-center gap-3">
                <MessageCircle size={22} />
                <div className="text-left">
                  <div className="text-sm font-bold">Chat on WhatsApp</div>
                  <div className="text-xs opacity-80">{PHONE}</div>
                </div>
              </div>
              <ArrowRight size={18} />
            </a>

            {/* Email CTA */}
            <a href={`mailto:${EMAIL}`}
              className="flex items-center gap-3 rounded-xl px-5 py-4 transition-all hover:scale-[1.01]"
              style={{ background: "var(--ap-surface)", border: "1px solid rgba(201,168,76,0.3)" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(201,168,76,0.12)" }}>
                <Mail size={18} style={{ color: "#C9A84C" }} />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--ap-text-muted)" }}>Email Us</div>
                <div className="text-sm font-semibold break-all" style={{ color: "var(--ap-text)" }}>{EMAIL}</div>
              </div>
            </a>

            {/* Confidentiality */}
            <div className="p-4 rounded-2xl text-xs" style={{ background: "var(--ap-surface)", border: "1px solid var(--ap-border)", color: "var(--ap-text-muted)" }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Shield size={13} style={{ color: "#C9A84C", flexShrink: 0 }} />
                <span className="font-semibold" style={{ color: "var(--ap-text)" }}>Confidentiality Notice</span>
              </div>
              All client information is handled with strict confidentiality and is never shared with any third party.
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl p-6 sm:p-8"
              style={{ background: "var(--ap-surface)", border: "1px solid var(--ap-border)" }}>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#25D366" }}>
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight" style={{ color: "var(--ap-text)" }}>
                    Quick WhatsApp Inquiry
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--ap-text-muted)" }}>
                    Sends directly to Associate Piyush — responds within 2 business days
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl p-4 mb-6 text-xs font-mono leading-relaxed"
                style={{ background: "rgba(37,211,102,0.07)", border: "1px solid rgba(37,211,102,0.2)", color: "#4ADE80" }}>
                <div className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ opacity: 0.7 }}>Message Preview (example)</div>
                <div className="whitespace-pre-line opacity-90">{
                  `*New Inquiry — Associate Piyush*\n\nName: Sunil Yadav\nEmail: sunil@example.com\nPhone: +91 98765 43210\nService: Income Tax Filing\n\nMessage: I need to file ITR for FY 2026-27.`
                }</div>
              </div>

              <form onSubmit={handleWhatsApp} className="space-y-4">
                <div>
                  <label style={labelStyle}>Your Name <span style={{ color: "#f87171" }}>*</span></label>
                  <input type="text" style={inputStyle} placeholder="e.g. Piyush Nimse"
                    value={form.name} onChange={(e) => set("name", e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Email Address <span style={{ color: "#f87171" }}>*</span></label>
                  <input type="email" style={inputStyle} placeholder="e.g. you@example.com"
                    value={form.email} onChange={(e) => set("email", e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Phone / WhatsApp</label>
                  <input type="tel" style={inputStyle} placeholder="+91 XXXXX XXXXX"
                    value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Service Needed</label>
                  <select style={inputStyle} value={form.service} onChange={(e) => set("service", e.target.value)}>
                    <option value="">Select a service...</option>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Brief Message</label>
                  <textarea style={{ ...inputStyle, height: 112, resize: "none" }}
                    placeholder="e.g. I need help with GST reconciliation for FY 2024-25. We have ITC mismatch issues."
                    value={form.message} onChange={(e) => set("message", e.target.value)} />
                </div>

                <button type="submit"
                  className="flex items-center justify-center gap-2 w-full font-bold rounded-xl py-4 text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: "#25D366", color: "#fff" }}>
                  <Send size={16} />
                  Send via WhatsApp →
                </button>
                <p className="text-xs text-center" style={{ color: "var(--ap-text-muted)" }}>
                  Confidential. No spam. We respond within 2 business days.
                </p>
              </form>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2 mt-6 pt-6" style={{ borderTop: "1px solid var(--ap-border)" }}>
                {TRUST.map((t) => (
                  <div key={t} className="flex items-center gap-2 text-xs" style={{ color: "var(--ap-text-muted)" }}>
                    <CheckCircle size={13} style={{ color: "#4ADE80", flexShrink: 0 }} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              {/* Direct links */}
              <div className="mt-5 pt-5 space-y-2" style={{ borderTop: "1px solid var(--ap-border)" }}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ap-text-muted)" }}>Or reach us directly</div>
                <a href={`tel:+${PHONE_RAW}`} className="flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: "#C9A84C" }}>
                  <Phone size={14} /> {PHONE}
                </a>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-sm font-medium hover:underline break-all" style={{ color: "#C9A84C" }}>
                  <Mail size={14} /> {EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
