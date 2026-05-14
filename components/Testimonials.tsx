const testimonials = [
  {
    name: "Vishwajit Surlikar",
    location: "Nigdi, Pune",
    role: "Owner, Vishwa Shooting Academy",
    service: "Income Tax & Financial Consultation",
    quote: "Piyush handles everything — income tax, insurance, loans, and all financial groundwork for setting up our shooting range. A true one-stop advisor.",
  },
  {
    name: "Yogesh Zaware",
    location: "Chakan",
    role: "Employee, Mahindra & Mahindra, Chakan",
    service: "Income Tax Notice",
    quote: "Got an income tax notice and had no idea what to do. Piyush dealt with it completely. Stress-free experience — highly recommended.",
  },
  {
    name: "Nirmala Sawant",
    location: "Pune",
    service: "TDS Refund on Property",
    quote: "TDS was deducted on my property purchase and I didn't know I could reclaim it. Piyush guided me through the entire refund process. Got it back!",
  },
  {
    name: "Pooja Satish Nimse",
    location: "Pune",
    role: "Proprietor, Sainath Transport",
    service: "Company Profile & Financial Consultation",
    quote: "Piyush helped us build our company profile and gave solid financial guidance to get Sainath Transport structured properly. Very professional.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {testimonials.map((t) => (
        <div
          key={t.name}
          className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm
                     hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100/60
                     transition-all duration-200"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center
                          justify-center text-sm font-semibold mb-3">
            {initials(t.name)}
          </div>

          {/* Stars */}
          <div className="text-gold-500 text-xs mb-2">★★★★★</div>

          {/* Quote */}
          <p className="text-sm text-[#26215C] leading-relaxed italic mb-3">
            &ldquo;{t.quote}&rdquo;
          </p>

          {/* Name + location */}
          <p className="text-sm font-semibold text-purple-800">{t.name}</p>
          {t.role && <p className="text-xs text-[#7F77DD] leading-snug">{t.role}</p>}
          {t.location && <p className="text-xs text-[#7F77DD]">{t.location}</p>}

          {/* Service badge */}
          <span className="inline-block mt-2 text-xs bg-purple-50 text-purple-600
                           rounded-md px-2 py-0.5">
            {t.service}
          </span>
        </div>
      ))}
    </div>
  );
}
