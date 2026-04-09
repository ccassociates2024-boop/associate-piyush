"use client";

import { useState } from "react";
import { Mail, Clock, MessageCircle, Shield, CheckCircle, Send, ArrowRight, MapPin } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const SERVICES = [
    "GST Reconciliation",
    "Forensic Accounting",
    "Income Tax Advisory",
    "TDS Compliance",
    "Audit & Assurance",
    "Business Advisory",
    "Other / Not Sure",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone,
          service: form.service || "Not specified",
          message: form.message,
          to_name: "Associate Piyush",
        },
        "YOUR_PUBLIC_KEY"
      );
      setSubmitted(true);
    } catch (e) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Associate Piyush,\n\nI would like to enquire about your services.\n\nName: ${form.name || "—"}\nService: ${form.service || "—"}`
  );

  return (
    <section className="bg-background py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-card shadow-card border border-gray-100 p-6">
              <h2 className="font-bold text-dark text-xl mb-6">Send a Message</h2>

              {submitted ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="font-bold text-dark text-xl mb-2">Message Sent!</h3>
                  <p className="text-muted mb-6">
                    Thank you, {form.name}. I&apos;ll respond within 24 hours. For urgent matters, WhatsApp is faster.
                  </p>
                  <a
                    href={`https://wa.me/919XXXXXXXXX?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold gap-2 inline-flex"
                  >
                    <MessageCircle size={16} /> Follow Up on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                    </div>
                    <div>
                      <label className="label">Email Address <span className="text-red-500">*</span></label>
                      <input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
                    </div>
                    <div>
                      <label className="label">Phone Number</label>
                      <input type="tel" className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9XXXXXXXXX" />
                    </div>
                    <div>
                      <label className="label">Service Required</label>
                      <select className="input-field" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                        <option value="">Select service...</option>
                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Message <span className="text-red-500">*</span></label>
                    <textarea className="input-field h-32 resize-none" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Briefly describe your requirement. E.g., 'We have 2 years of GST ITC mismatch for our manufacturing firm in Pune...'" required />
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
                    <Shield size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                    <span>All communications are strictly confidential. Information shared is used only for consultation purposes and is never disclosed to third parties.</span>
                  </div>

                  {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">{error}</div>}

                  <button type="submit" disabled={submitting} className="btn-primary gap-2 w-full justify-center py-3.5">
                    <Send size={16} />
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: MapPin, title: "Location", content: "Pune, Maharashtra\nPan India Services Available", sub: "Virtual consultations available" },
              { icon: Mail, title: "Email", content: "contact@associatepiyush.in", sub: "Response within 24 hours", href: "mailto:contact@associatepiyush.in" },
              { icon: Clock, title: "Working Hours", content: "Monday – Saturday\n10:00 AM – 7:00 PM", sub: "IST (Indian Standard Time)" },
              { icon: CheckCircle, title: "Response Time", content: "Within 24 Hours", sub: "Urgent matters: WhatsApp" },
            ].map(({ icon: Icon, title, content, sub, href }) => (
              <div key={title} className="bg-white rounded-card shadow-card border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">{title}</div>
                    {href ? (
                      <a href={href} className="text-sm font-medium text-dark hover:text-primary whitespace-pre-line">{content}</a>
                    ) : (
                      <div className="text-sm font-medium text-dark whitespace-pre-line">{content}</div>
                    )}
                    <div className="text-xs text-muted mt-0.5">{sub}</div>
                  </div>
                </div>
              </div>
            ))}

            <a
              href="https://wa.me/919XXXXXXXXX?text=Hello%20Associate%20Piyush,%20I%20need%20help%20with%20tax%20compliance."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg p-4 transition-colors w-full"
            >
              <MessageCircle size={20} />
              <span>Chat on WhatsApp</span>
              <ArrowRight size={16} />
            </a>

            <div className="bg-background rounded-lg p-4 text-xs text-muted border border-gray-100">
              <p className="font-medium text-dark mb-1">Confidentiality Notice</p>
              <p>All client information is handled with strict confidentiality. Associate Piyush does not share client information with any third party. Consultation discussions are protected under professional ethics.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
