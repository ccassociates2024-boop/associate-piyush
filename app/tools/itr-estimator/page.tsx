"use client";

import { useState, useMemo } from "react";
import { BarChart3, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

const STEPS = ["Basic Info", "Income Details", "Deductions (Old)", "Results"];

type Regime = "old" | "new" | "both";
type TaxpayerType = "individual" | "huf" | "senior" | "supersenior";

function calcNewRegimeTax(income: number): number {
  let tax = 0;
  const slabs = [
    [0, 300000, 0],
    [300000, 700000, 0.05],
    [700000, 1000000, 0.10],
    [1000000, 1200000, 0.15],
    [1200000, 1500000, 0.20],
    [1500000, Infinity, 0.30],
  ];
  for (const [low, high, rate] of slabs) {
    if (income > low) {
      tax += (Math.min(income, high) - low) * rate;
    }
  }
  // Rebate u/s 87A: if income ≤ 7L, tax = 0
  if (income <= 700000) tax = 0;
  return tax;
}

function calcOldRegimeTax(income: number, type: TaxpayerType): number {
  let tax = 0;
  const exemption = type === "senior" ? 300000 : type === "supersenior" ? 500000 : 250000;
  const taxable = Math.max(0, income - exemption);
  if (taxable <= 0) return 0;

  let remaining = taxable;
  // 5% up to 2.5L (after basic exemption)
  const slab1 = Math.min(remaining, 250000);
  tax += slab1 * 0.05;
  remaining -= slab1;
  if (remaining > 0) {
    // 20% up to 5L after basic
    const slab2 = Math.min(remaining, 500000);
    tax += slab2 * 0.20;
    remaining -= slab2;
  }
  if (remaining > 0) {
    tax += remaining * 0.30;
  }

  // Rebate u/s 87A: if income ≤ 5L, rebate up to ₹12,500
  if (income <= 500000) {
    tax = Math.max(0, tax - 12500);
  }
  return tax;
}

function addSurchargeAndCess(tax: number, income: number): number {
  let surcharge = 0;
  if (income > 50000000) surcharge = tax * 0.37;
  else if (income > 20000000) surcharge = tax * 0.25;
  else if (income > 10000000) surcharge = tax * 0.15;
  else if (income > 5000000) surcharge = tax * 0.10;
  const cess = (tax + surcharge) * 0.04;
  return tax + surcharge + cess;
}

export default function ITREstimatorPage() {
  const [step, setStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState({
    taxpayerType: "individual" as TaxpayerType,
    fy: "2025-26",
    regime: "both" as Regime,
  });
  const [income, setIncome] = useState({
    salary: "", houseProperty: "", business: "",
    stcg: "", ltcg: "", other: "",
  });
  const [deductions, setDeductions] = useState({
    c80: "", c80CCD1B: "", c80D: "", c80G: "",
    hra: "", standardDed: "50000", interestHomeLoan: "",
  });

  const calcResults = useMemo(() => {
    const totalIncome =
      (parseFloat(income.salary) || 0) +
      (parseFloat(income.houseProperty) || 0) +
      (parseFloat(income.business) || 0) +
      (parseFloat(income.stcg) || 0) +
      (parseFloat(income.ltcg) || 0) +
      (parseFloat(income.other) || 0);

    const totalDeductions =
      Math.min(parseFloat(deductions.c80) || 0, 150000) +
      Math.min(parseFloat(deductions.c80CCD1B) || 0, 50000) +
      (parseFloat(deductions.c80D) || 0) +
      (parseFloat(deductions.c80G) || 0) +
      (parseFloat(deductions.hra) || 0) +
      (parseFloat(deductions.standardDed) || 0) +
      (parseFloat(deductions.interestHomeLoan) || 0);

    // Old regime
    const oldTaxableIncome = Math.max(0, totalIncome - totalDeductions);
    const oldBaseTax = calcOldRegimeTax(oldTaxableIncome, basicInfo.taxpayerType);
    const oldTotalTax = addSurchargeAndCess(oldBaseTax, oldTaxableIncome);

    // New regime (standard deduction ₹75,000 only)
    const newTaxableIncome = Math.max(0, totalIncome - 75000);
    const newBaseTax = calcNewRegimeTax(newTaxableIncome);
    const newTotalTax = addSurchargeAndCess(newBaseTax, newTaxableIncome);

    return {
      totalIncome,
      totalDeductions,
      oldTaxableIncome,
      oldTotalTax,
      newTaxableIncome,
      newTotalTax,
      savings: Math.abs(oldTotalTax - newTotalTax),
      betterRegime: oldTotalTax < newTotalTax ? "old" : "new",
    };
  }, [income, deductions, basicInfo]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const fmtCrore = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${fmt(n)}`;
  };

  const isResultStep = step === 3;

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted hover:text-dark mb-6">
          <ArrowLeft size={15} /> Back to Tools
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
            <BarChart3 className="text-primary" size={22} /> ITR Tax Estimator
          </h1>
          <p className="text-muted text-sm mt-1">Estimate income tax under Old vs New tax regime for FY 2025-26.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  i === step
                    ? "bg-primary text-white"
                    : i < step
                    ? "bg-green-100 text-green-700 cursor-pointer"
                    : "bg-gray-100 text-muted cursor-default"
                }`}
              >
                {i < step ? <CheckCircle size={12} /> : <span>{i + 1}</span>}
                {s}
              </button>
              {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-card shadow-card border border-gray-100 p-6">
          {/* Step 1: Basic Info */}
          {step === 0 && (
            <div>
              <h2 className="font-semibold text-dark mb-5 pb-2 border-b border-gray-100">Basic Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Taxpayer Type</label>
                  <select className="input-field" value={basicInfo.taxpayerType} onChange={e => setBasicInfo({ ...basicInfo, taxpayerType: e.target.value as TaxpayerType })}>
                    <option value="individual">Individual (Below 60)</option>
                    <option value="senior">Senior Citizen (60–80 yrs)</option>
                    <option value="supersenior">Super Senior (80+ yrs)</option>
                    <option value="huf">HUF</option>
                  </select>
                </div>
                <div>
                  <label className="label">Financial Year</label>
                  <select className="input-field" value={basicInfo.fy} onChange={e => setBasicInfo({ ...basicInfo, fy: e.target.value })}>
                    <option value="2025-26">FY 2025-26 (AY 2026-27)</option>
                    <option value="2024-25">FY 2024-25 (AY 2025-26)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Tax Regime</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { v: "old", label: "Old Regime", sub: "With deductions" },
                      { v: "new", label: "New Regime", sub: "FY 2025-26 default" },
                      { v: "both", label: "Compare Both", sub: "Recommended" },
                    ].map(({ v, label, sub }) => (
                      <button
                        key={v}
                        onClick={() => setBasicInfo({ ...basicInfo, regime: v as Regime })}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          basicInfo.regime === v
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-sm font-semibold text-dark">{label}</div>
                        <div className="text-xs text-muted mt-0.5">{sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Income */}
          {step === 1 && (
            <div>
              <h2 className="font-semibold text-dark mb-5 pb-2 border-b border-gray-100">Income Details (FY {basicInfo.fy})</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { k: "salary", label: "Gross Salary (before std. deduction)", hint: "CTC before any deductions" },
                  { k: "houseProperty", label: "Income from House Property", hint: "Net Annual Value (NAV). Enter negative for self-occupied with home loan" },
                  { k: "business", label: "Business / Profession Income", hint: "Net profit after business expenses" },
                  { k: "stcg", label: "Short-Term Capital Gains (STCG)", hint: "STCG taxable at slab rates" },
                  { k: "ltcg", label: "Long-Term Capital Gains (LTCG)", hint: "LTCG above ₹1L taxed at 10% (equity)" },
                  { k: "other", label: "Other Income", hint: "Interest, dividends, gifts, etc." },
                ].map(({ k, label, hint }) => (
                  <div key={k}>
                    <label className="label">{label}</label>
                    <input
                      type="number"
                      className="input-field"
                      value={(income as any)[k]}
                      onChange={e => setIncome({ ...income, [k]: e.target.value })}
                      placeholder="0"
                      min="0"
                    />
                    <p className="text-xs text-muted mt-1">{hint}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-primary/5 rounded-lg text-sm">
                <span className="text-muted">Total Gross Income: </span>
                <span className="font-bold text-primary">{fmtCrore(calcResults.totalIncome)}</span>
              </div>
            </div>
          )}

          {/* Step 3: Deductions */}
          {step === 2 && (
            <div>
              <h2 className="font-semibold text-dark mb-1 pb-2 border-b border-gray-100">Deductions (Old Regime Only)</h2>
              <p className="text-xs text-muted mb-4">These deductions only apply under the Old Tax Regime. Under the New Regime, only ₹75,000 standard deduction is allowed.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { k: "standardDed", label: "Standard Deduction (80TTA)", max: "₹50,000 for salaried", hint: "Auto: ₹50,000 for salaried" },
                  { k: "c80", label: "Section 80C (LIC, PPF, ELSS, etc.)", max: "Max ₹1,50,000", hint: "PF, LIC premium, ELSS, tuition fees" },
                  { k: "c80CCD1B", label: "Sec 80CCD(1B) — NPS", max: "Max ₹50,000", hint: "Additional NPS contribution" },
                  { k: "c80D", label: "Sec 80D — Health Insurance", max: "₹25,000–₹1L", hint: "Self + family + parents premium" },
                  { k: "c80G", label: "Sec 80G — Donations", max: "50%/100% of donation", hint: "Eligible charity donations" },
                  { k: "hra", label: "HRA Exemption (Sec 10(13A))", max: "Calculated separately", hint: "From Form 16 / employer certificate" },
                  { k: "interestHomeLoan", label: "Sec 24(b) — Home Loan Interest", max: "Max ₹2,00,000 (self-occupied)", hint: "Interest on housing loan" },
                ].map(({ k, label, max, hint }) => (
                  <div key={k}>
                    <label className="label">{label} <span className="text-gold text-xs">({max})</span></label>
                    <input
                      type="number"
                      className="input-field"
                      value={(deductions as any)[k]}
                      onChange={e => setDeductions({ ...deductions, [k]: e.target.value })}
                      placeholder="0"
                      min="0"
                    />
                    <p className="text-xs text-muted mt-1">{hint}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-primary/5 rounded-lg text-sm">
                <span className="text-muted">Total Deductions (Old Regime): </span>
                <span className="font-bold text-primary">{fmtCrore(calcResults.totalDeductions)}</span>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 3 && (
            <div>
              <h2 className="font-semibold text-dark mb-5 pb-2 border-b border-gray-100">Tax Calculation Results — FY {basicInfo.fy}</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {/* Old Regime */}
                <div className={`p-5 rounded-lg border-2 ${calcResults.betterRegime === "old" ? "border-green-400 bg-green-50" : "border-gray-200 bg-background"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-dark">Old Tax Regime</h3>
                    {calcResults.betterRegime === "old" && (
                      <span className="badge bg-green-100 text-green-700">Recommended</span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Gross Income</span>
                      <span className="font-medium">₹{fmt(calcResults.totalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Total Deductions</span>
                      <span className="font-medium text-green-600">- ₹{fmt(calcResults.totalDeductions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Taxable Income</span>
                      <span className="font-medium">₹{fmt(calcResults.oldTaxableIncome)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-base">
                      <span>Total Tax Payable</span>
                      <span className="text-primary">₹{fmt(calcResults.oldTotalTax)}</span>
                    </div>
                    <div className="text-xs text-muted">(incl. surcharge + 4% cess)</div>
                  </div>
                </div>

                {/* New Regime */}
                <div className={`p-5 rounded-lg border-2 ${calcResults.betterRegime === "new" ? "border-green-400 bg-green-50" : "border-gray-200 bg-background"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-dark">New Tax Regime</h3>
                    {calcResults.betterRegime === "new" && (
                      <span className="badge bg-green-100 text-green-700">Recommended</span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Gross Income</span>
                      <span className="font-medium">₹{fmt(calcResults.totalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Std. Deduction</span>
                      <span className="font-medium text-green-600">- ₹75,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Taxable Income</span>
                      <span className="font-medium">₹{fmt(calcResults.newTaxableIncome)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-base">
                      <span>Total Tax Payable</span>
                      <span className="text-primary">₹{fmt(calcResults.newTotalTax)}</span>
                    </div>
                    <div className="text-xs text-muted">(incl. surcharge + 4% cess)</div>
                  </div>
                </div>
              </div>

              {/* Savings callout */}
              <div className={`p-4 rounded-lg border mb-5 ${calcResults.betterRegime === "old" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}>
                <div className="text-sm font-semibold text-dark">
                  Choose <span className="text-primary capitalize">{calcResults.betterRegime} Tax Regime</span> and save{" "}
                  <span className="text-green-600">₹{fmt(calcResults.savings)}</span> in taxes.
                </div>
                {calcResults.newTaxableIncome <= 700000 && (
                  <div className="text-xs text-green-700 mt-1">
                    Rebate u/s 87A applies under New Regime — Zero tax payable!
                  </div>
                )}
              </div>

              {/* Slab reference */}
              <div className="bg-background rounded-lg p-4">
                <h4 className="text-xs font-semibold text-dark mb-3 uppercase tracking-wide">New Regime Slabs — FY 2025-26</h4>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {[
                    ["0 – 3L", "NIL"], ["3L – 7L", "5%"], ["7L – 10L", "10%"],
                    ["10L – 12L", "15%"], ["12L – 15L", "20%"], ["Above 15L", "30%"],
                  ].map(([range, rate]) => (
                    <div key={range} className="flex justify-between p-2 bg-white rounded border border-gray-100">
                      <span className="text-muted">{range}</span>
                      <span className="font-semibold text-dark">{rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="btn-outline gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={15} /> Previous
            </button>
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary gap-2">
                {step === 2 ? "Calculate" : "Next"} <ChevronRight size={15} />
              </button>
            ) : (
              <button onClick={() => setStep(0)} className="btn-outline">Start Over</button>
            )}
          </div>
        </div>

        <p className="tool-disclaimer">
          Results are indicative only. Always consult a qualified tax professional for final decisions. Associate Piyush is not liable for any decisions made based on tool outputs. © 2026 Associate Piyush, Pune.
        </p>
      </div>
    </div>
  );
}
