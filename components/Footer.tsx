import Link from "next/link";
import { MapPin, Mail, Phone, Shield } from "lucide-react";

const services = [
  { label: "GST Reconciliation", href: "/services#gst" },
  { label: "Forensic Accounting", href: "/services#forensic" },
  { label: "Income Tax Advisory", href: "/services#income-tax" },
  { label: "TDS Compliance", href: "/services#tds" },
  { label: "Audit & Assurance", href: "/services#audit" },
  { label: "Business Advisory", href: "/services#business" },
];

const quickLinks = [
  { label: "Services", href: "/services" },
  { label: "Free Tools", href: "/tools" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const tools = [
  { label: "GST Invoice Generator", href: "/tools/gst-invoice" },
  { label: "TDS Calculator", href: "/tools/tds-calculator" },
  { label: "ITR Tax Estimator", href: "/tools/itr-estimator" },
  { label: "Advance Tax Calculator", href: "/tools/advance-tax" },
  { label: "GST Late Fee Calculator", href: "/tools/gst-late-fee" },
  { label: "Capital Gains Calculator", href: "/tools/capital-gains" },
  { label: "PDF Merge", href: "/tools/pdf-merge" },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-white text-sm">Associate</span>
                <span className="font-bold text-blue-300 text-sm -mt-0.5">
                  Piyush<span className="text-gold ml-0.5">.</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Expert Tax Advisory, GST Reconciliation & Forensic Accounting Services for businesses across India.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gold flex-shrink-0" />
                <span>Pune, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gold flex-shrink-0" />
                <a href="mailto:contact@associatepiyush.in" className="hover:text-white transition-colors">
                  contact@associatepiyush.in
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 mb-6">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Free Tools */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Free Tools</h3>
            <ul className="space-y-2">
              {tools.map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tools" className="text-gold hover:text-gold-300 text-sm font-medium transition-colors">
                  View All 13 Tools →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Privacy badge */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield size={12} className="text-green-400" />
            <span>All tools run 100% in your browser. No data is sent to any server.</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© 2026 Associate Piyush. All rights reserved. Pune, Maharashtra.</p>
            <p className="text-center md:text-right max-w-lg">
              <strong className="text-gray-400">Disclaimer:</strong> Information on this website is for general guidance only and does not constitute legal or financial advice. Results from tools are indicative. Always consult a qualified professional for final decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
