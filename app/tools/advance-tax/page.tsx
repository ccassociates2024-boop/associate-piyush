"use client";

import { useState, useMemo } from "react";
import { TrendingUp, ArrowLeft, AlertCircle, CheckCircle, Info } from "lucide-react";
import Link from "next/link";

// ── FY-specific installment schedules ─────────────────────────────────────────
const FY_OPTIONS = [
  {
    value: "2026-27",
    label: "FY 2026-27 (Current)",
    installments: [
      { label: "1st Installment", dueDate: "15 Jun 2026", percent: 15 },
      { label: "2nd Installment", dueDate: "15 Sep 2026", percent: 45 },
      { label: "3rd Installment", dueDate: "15 Dec 2026", percent: 75 },
      { label: "4th Installment", dueDate: "15 Mar 2027", percent: 100 },
    ],
    newSlabYear: "new25", // Finance Act 2025 slabs
    rebateLimit: 1200000,
  },
  {
    value: "2025-26",
    label: "FY 2025-26",
    installments: [
      { label: "1st Installment", dueDate: "15 Jun 2025", percent: 15 },
      { label: "2nd Installment", dueDate: "15 Sep 2025", percent: 45 },
      { label: "3rd Installment", dueDate: "15 Dec 2025", percent: 75 },
      { label: "4th Installment", dueDate: "15 Mar 2026", percent: 100 },
    ],
    newSlabYear: "new25", // Finance Act 2025 slabs (0-4L nil, rebate ₹12L)
    rebateLimit: 1200000,
  },
  {
    value: "2024-25",
    label: "FY 2024-25",
    installments: [
      { label: "1st Installment", dueDate: "15 Jun 2024", percent: 15 },
      { label: "2nd Installment", dueDate: "15 Sep 2024", percent: 45 },
      { label: "3rd Installment", dueDate: "15 Dec 2024", percent: 75 },
      { label: "4th Installment", dueDate: "15 Mar 2025", percent: 100 },
    ],
    newSlabYear: "new24", // FY 2024-25 slabs (0-3L nil, rebate ₹7L)
    rebateLimit: 700000,
  },
];

type AgeCategory = "individual" | "senior" | "supersenior";

// ── Tax computation (FY-aware) ─────────────────────────────────────────────────
function calcNewRegimeTax(income: number, slabYear: string, rebateLimit: number): number {
  if (income <= 0) return 0;
  let tax = 0;
  if (slabYear === "new25") {
    // Finance Act 2025: effective FY 2025-26 & 2026-27
    const slabs: [number, number, number][] = [
      [0, 400000, 0], [400000, 800000, 0.05], [800000, 1200000, 0.10],
      [1200000, 1600000, 0.15], [1600000, 2000000, 0.20],
      [2000000, 2400000, 0.25], [2400000, Infinity, 0.30],
    ];
    for (const [l, h, r] of slabs) if (income > l) tax += (Math.min(income, h) - l) * r;
    // 87A rebate: zero tax if income ≤ ₹12L
    if (income <= rebateLimit) tax = 0;
    // Marginal relief: income 12L–12.75L
    else if (income <= 1275000) tax = Math.min(tax, income - rebateLimit);
  } else {
    // FY 2024-25 new regime slabs
    const slabs: [number, number, number][] = [
      [0, 300000, 0], [300000, 700000, 0.05], [700000, 1000000, 0.10],
      [1000000, 1200000, 0.15], [1200000, 1500000, 0.20], [1500000, Infinity, 0.30],
    ];
    for (const [l, h, r] of slabs) if (income > l) tax += (Math.min(income, h) - l) * r;
    if (income <= rebateLimit) tax = 0; // rebate ≤ ₹7L
  }
  return tax;
}

function calcOldRegimeTax(income: number, age: AgeCategory): number {
  if (income <= 0) return 0;
  const ex = age === "supersenior" ? 500000 : age === "senior" ? 300000 : 250000;
  if (income <= ex) return 0;
  let tax = 0;
  tax += (Math.min(income, 500000) - ex) * 0.05;
  if (income > 500000) tax += (Math.min(income, 1000000) - 500000) * 0.20;
  if (income > 1000000) tax += (income - 1000000) * 0.30;
  // 87A rebate for old regime: if income ≤ ₹5L
  if (income <= 500000) tax = Math.max(0, tax - 12500);
  return tax;
}

function calcSurcharge(income: number, tax: number, isNew: boolean): number {
  let sr = 0;
  if (income > 50000000)      sr = isNew ? 0.25 : 0.37;
  else if (income > 20000000) sr = 0.25;
  else if (income > 10000000) sr = 0.15;
  else if (income > 5000000)  sr = 0.10;
  return tax * sr;
}

export default function AdvanceTaxPage() {
  const [form, setForm] = useState({
    fy: "2026-27",
    regime: "new",
    age: "individual" as AgeCategory,
    salary: "",
    business: "",
    capitalGains: "",
    other: "",
    tdsDeducted: "",
    existingAdvTax: "",
  });

  const fyData = FY_OPTIONS.find(f => f.value === form.fy) || FY_OPTIONS[0];

  const result = useMemo(() => {
    const totalIncome =
      (parseFloat(form.salary) || 0) +
      (parseFloat(form.business) || 0) +
      (parseFloat(form.capitalGains) || 0) +
      (parseFloat(form.other) || 0);

    const baseTax = form.regime === "new"
      ? calcNewRegimeTax(totalIncome, fyData.newSlabYear, fyData.rebateLimit)
      : calcOldRegimeTax(totalIncome, form.age);

    const surcharge = calcSurcharge(totalIncome, baseTax, form.regime === "new");
    const withCess = (baseTax + surcharge) * 1.04;

    const tdsDeducted = parseFloat(form.tdsDeducted) || 0;
    const existingAdvTax = parseFloat(form.existingAdvTax) || 0;
    const netTaxLiability = Math.max(0, withCess - tdsDeducted - existingAdvTax);
    const advanceTaxRequired = netTaxLiability > 10000;

    const installments = fyData.installments.map((inst, i) => {
      const requiredCumulative = (netTaxLiability * inst.percent) / 100;
      const previousCumulative = i === 0 ? 0 : (netTaxLiability * fyData.installments[i - 1].percent) / 100;
      const amountDue = requiredCumulative - previousCumulative;
      return { ...inst, cumulativePercent: inst.percent, cumulativeAmount: requiredCumulative, amountDue };
    });

    return { totalIncome, baseTax, surcharge, withCess, tdsDeducted, netTaxLiability, advanceTaxRequired, installments };
  }, [form, fyData]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(n));

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted hover:text-dark mb-6">
          <ArrowLeft size={15} /> Back to Tools
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
            <TrendingUp className="text-primary" size={22} /> Advance Tax Calculator
          </h1>
          <p className="text-muted text-sm mt-1">Calculate advance tax installments with Sec 234C interest for missed payment deadlines. Updated for Finance Act 2025.</p>
        </div>

        <div className="flex items-start gap-2 bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 mb-5 text-xs text-dark">
          <Info size={13} className="text-gold flex-shrink-0 mt-0.5" />
          <span><strong>Advance Tax is mandatory</strong> if net tax liability exceeds ₹10,000 for the year (Sec 208). Failure to pay attracts interest u/s 234C (1% per month on shortfall per installment).</span>
        </div>

        <div className="bg-white rounded-card shadow-card border border-gray-100 p-6 mb-5">
          <h2 className="font-semibold text-dark mb-5 pb-2 border-b border-gray-100">Income & Tax Details</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Financial Year</label>
              <select className="input-field" value={form.fy} onChange={e => setForm({ ...form, fy: e.target.value })}>
                {FY_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Tax Regime</label>
              <select className="input-field" value={form.regime} onChange={e => setForm({ ...form, regime: e.target.value })}>
                <option value="new">New Regime (Default)</option>
                <option value="old">Old Regime</option>
              </select>
            </div>

            {form.regime === "old" && (
              <div className="sm:col-span-2">
                <label className="label">Age Category <span className="text-muted font-normal">(affects basic exemption)</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { v: "individual", label: "Individual", sub: "Below 60 yrs — ₹2.5L exempt" },
                    { v: "senior", label: "Senior Citizen", sub: "60–80 yrs — ₹3L exempt" },
                    { v: "supersenior", label: "Super Senior", sub: "80+ yrs — ₹5L exempt" },
                  ] as { v: AgeCategory; label: string; sub: string }[]).map(({ v, label, sub }) => (
                    <button key={v} onClick={() => setForm({ ...form, age: v })}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${form.age === v ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className="text-xs font-semibold text-dark">{label}</div>
                      <div className="text-[10px] text-muted mt-0.5">{sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="label">Estimated Salary Income (₹)</label>
              <input type="number" className="input-field" value={form.salary}
                onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="0" min="0" />
            </div>
            <div>
              <label className="label">Business / Profession Income (₹)</label>
              <input type="number" className="input-field" value={form.business}
                onChange={e => setForm({ ...form, business: e.target.value })} placeholder="0" min="0" />
              <p className="text-xs text-muted mt-1">For presumptive income u/s 44AD/44ADA, advance tax is due in one installment by 15 Mar</p>
            </div>
            <div>
              <label className="label">Capital Gains (₹)</label>
              <input type="number" className="input-field" value={form.capitalGains}
                onChange={e => setForm({ ...form, capitalGains: e.target.value })} placeholder="0" min="0" />
              <p className="text-xs text-muted mt-1">Clubbed with normal income for advance tax estimation. Use ITR Estimator for exact STCG/LTCG tax.</p>
            </div>
            <div>
              <label className="label">Other Income (₹)</label>
              <input type="number" className="input-field" value={form.other}
                onChange={e => setForm({ ...form, other: e.target.value })} placeholder="0" min="0" />
            </div>
            <div>
              <label className="label">TDS Already Deducted (₹)</label>
              <input type="number" className="input-field" value={form.tdsDeducted}
                onChange={e => setForm({ ...form, tdsDeducted: e.target.value })} placeholder="0" min="0" />
            </div>
            <div>
              <label className="label">Advance Tax Already Paid (₹)</label>
              <input type="number" className="input-field" value={form.existingAdvTax}
                onChange={e => setForm({ ...form, existingAdvTax: e.target.value })} placeholder="0" min="0" />
            </div>
          </div>
        </div>

        {/* Tax Summary */}
        <div className="bg-white rounded-card shadow-card border border-gray-100 p-6 mb-5">
          <h2 className="font-semibold text-dark mb-5 pb-2 border-b border-gray-100">Tax Summary</h2>
          <div className="grid grid-cols-2 gap-3 text-sm mb-5">
            {[
              { label: "Estimated Gross Income", value: `₹${fmt(result.totalIncome)}` },
              { label: `Income Tax (${form.regime === "new" ? "New" : "Old"} Regime, before surcharge & cess)`, value: `₹${fmt(result.baseTax)}` },
              ...(result.surcharge > 0 ? [{ label: "Surcharge", value: `₹${fmt(result.surcharge)}` }] : []),
              { label: "Tax + Surcharge + 4% Cess", value: `₹${fmt(result.withCess)}` },
              { label: "Less: TDS Deducted", value: `− ₹${fmt(result.tdsDeducted)}` },
              { label: "Net Advance Tax Required", value: `₹${fmt(result.netTaxLiability)}`, bold: true },
            ].map(({ label, value, bold }) => (
              <div key={label} className={`flex justify-between p-3 bg-background rounded-lg ${bold ? "col-span-2 border-2 border-primary/20" : ""}`}>
                <span className="text-muted text-xs sm:text-sm">{label}</span>
                <span className={bold ? "font-bold text-primary text-base" : "font-medium text-dark"}>{value}</span>
              </div>
            ))}
          </div>

          {!result.advanceTaxRequired ? (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle size={16} />
              <span>Net tax liability ≤ ₹10,000. <strong>Advance tax not required</strong> under Sec 208.</span>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-dark mb-3 text-sm">Installment Schedule — {form.fy}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="text-left py-2.5 px-3 font-medium text-xs">Installment</th>
                      <th className="text-left py-2.5 px-3 font-medium text-xs">Due Date</th>
                      <th className="text-right py-2.5 px-3 font-medium text-xs">Cumul. %</th>
                      <th className="text-right py-2.5 px-3 font-medium text-xs">Amount Due (₹)</th>
                      <th className="text-right py-2.5 px-3 font-medium text-xs">Cumulative (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.installments.map((inst, i) => (
                      <tr key={inst.label} className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-background" : "bg-white"}`}>
                        <td className="py-2.5 px-3 font-medium text-xs">{inst.label}</td>
                        <td className="py-2.5 px-3 text-primary font-semibold text-xs">{inst.dueDate}</td>
                        <td className="py-2.5 px-3 text-right text-xs">{inst.cumulativePercent}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-xs">₹{fmt(inst.amountDue)}</td>
                        <td className="py-2.5 px-3 text-right text-muted text-xs">₹{fmt(inst.cumulativeAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2 text-xs text-amber-800">
                  <AlertCircle size={13} className="mt-0.5 flex-shrink-0 text-amber-600" />
                  <div>
                    <strong>Sec 234C Interest:</strong> If you miss or short-pay an installment, interest at <strong>1% per month</strong> is levied on the shortfall for 3 months (or 1 month for last installment).
                    Note: Presumptive income taxpayers (44AD/44ADA) pay entire advance tax by 15th March only.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <p className="tool-disclaimer">
          This is an estimate only. Actual tax depends on deductions, exemptions, and specific capital gain characterisation. Always verify with a qualified CA. Associate Piyush is not liable for decisions made on tool output. © 2026 Associate Piyush, Pune.
        </p>
      </div>
    </div>
  );
}
