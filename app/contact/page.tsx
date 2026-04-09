import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Associate Piyush for GST, Income Tax, TDS, Forensic Accounting consultations. Based in Pune, Maharashtra. Pan India services.",
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-blue-200 text-lg leading-relaxed">
              Have a tax matter or compliance requirement? Let&apos;s discuss how we can help. First consultation is free.
            </p>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
