"use client";
import { MessageCircle, Phone, Mail } from "lucide-react";

const partners = [
  {
    initials: "PN",
    name: "Piyush Nimse",
    role: "Founding Partner — Tax & Finance",
    qualification: "Tax & Finance Consultant",
    description:
      "Specialises in Income Tax advisory, GST reconciliation, TDS compliance, forensic accounting, and handling tax notices & assessments. 950+ cases handled across India.",
    phone: "+91 75073 54141",
    phoneRaw: "917507354141",
    email: "associate.piyush.nimse@gmail.com",
    expertise: ["Income Tax", "GST", "TDS", "Forensic Accounting", "Tax Notices"],
    accentClass: "bg-purple-600",
  },
  {
    initials: "SBC",
    name: "C.A. Sourabh Bhimrao Chavan",
    role: "Partner — Audit, Advisory & Litigation",
    qualification: "Chartered Accountant (ACA)",
    description:
      "7+ years of experience in CA firm practice. Expert in Income Tax, GST compliance, statutory & internal audits, financial consultation, and financial litigation — serving businesses and individuals across India.",
    phone: "+91 84214 65966",
    phoneRaw: "918421465966",
    email: "ccassociates2024@gmail.com",
    expertise: ["CA Firm", "Income Tax", "GST", "Audit", "Financial Litigation", "Financial Consultant"],
    accentClass: "bg-amber-500",
  },
];

export default function Team() {
  return (
    <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
      {partners.map((p) => (
        <div
          key={p.initials}
          className="bg-white rounded-2xl border border-purple-100 p-6
                     hover:shadow-lg hover:shadow-purple-100/60 hover:-translate-y-1
                     transition-all duration-200 flex flex-col"
        >
          {/* Avatar */}
          <div className={`w-14 h-14 rounded-2xl ${p.accentClass} flex items-center justify-center mb-4`}>
            <span className="text-sm font-bold text-white tracking-tight">{p.initials}</span>
          </div>

          {/* Gold accent */}
          <div className="w-8 h-0.5 bg-amber-400 mb-3" />

          {/* Name & Role */}
          <h3 className="text-base font-semibold text-[#26215C]">{p.name}</h3>
          <p className="text-sm text-purple-600 font-medium mb-1">{p.role}</p>

          {/* Credential badge */}
          <span className="inline-block text-xs bg-purple-50 text-purple-800 border
                           border-purple-100 rounded-lg px-2 py-0.5 mb-3">
            {p.qualification}
          </span>

          {/* Description */}
          <p className="text-sm text-[#7F77DD] leading-relaxed mb-4">{p.description}</p>

          {/* Expertise tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {p.expertise.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold uppercase tracking-wide
                           bg-purple-50 text-purple-700 border border-purple-100
                           rounded-md px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-auto space-y-2 text-xs text-[#7F77DD]">
            <a
              href={`tel:${p.phoneRaw}`}
              className="flex items-center gap-1.5 hover:text-purple-600 transition-colors"
            >
              <Phone size={12} /> {p.phone}
            </a>
            <a
              href={`mailto:${p.email}`}
              className="flex items-center gap-1.5 hover:text-purple-600 transition-colors"
            >
              <Mail size={12} /> {p.email}
            </a>
            <a
              href={`https://wa.me/${p.phoneRaw}?text=Hello%2C%20I%20need%20consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1.5 bg-green-50 text-green-700
                         border border-green-200 rounded-lg px-3 py-1.5 font-medium
                         hover:bg-green-100 transition-colors"
            >
              <MessageCircle size={12} /> WhatsApp
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
