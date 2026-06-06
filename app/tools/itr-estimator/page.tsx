"use client";

import { useState, useMemo } from "react";
import { buildExcel } from "./buildExcel";
import {
  BarChart3, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle,
  Info, Download, ChevronDown, ChevronUp,
} from "lucide-react";
import Link from "next/link";

const STEPS = ["Basic Info", "Income Details", "Deductions (Old)", "Results"];
type Regime = "old" | "new" | "both";
type TaxpayerType = "individual" | "senior" | "supersenior" | "huf";
type FY = "2526" | "2627";

// ─────────────────────────────────────────────────────────────────────────────
// TAX ENGINE — FY 2025-26 & FY 2026-27 (Finance Act 2025 / Income-tax Act 2025)
// Verified against CBDT circulars & Finance Acts.
// ─────────────────────────────────────────────────────────────────────────────

// ── New Regime: raw slab tax (NO 87A here — applied separately) ──────────────
function newRegimeSlab(ti: number): number {
  if (ti <= 0) return 0;
  const slabs: [number, number, number][] = [
    [0, 400000, 0], [400000, 800000, 0.05], [800000, 1200000, 0.10],
    [1200000, 1600000, 0.15], [1600000, 2000000, 0.20],
    [2000000, 2400000, 0.25], [2400000, Infinity, 0.30],
  ];
  let tax = 0;
  for (const [lo, hi, r] of slabs) if (ti > lo) tax += (Math.min(ti, hi) - lo) * r;
  return tax;
}

// ── Old Regime: raw slab tax (NO 87A here) ───────────────────────────────────
// FIX (Bug 3): 5% slab is ALWAYS from exemption-limit to ₹5L (not a fixed 2.5L band)
function oldRegimeSlab(ti: number, type: TaxpayerType): number {
  if (ti <= 0) return 0;
  const ex = type === "supersenior" ? 500000 : type === "senior" ? 300000 : 250000;
  if (ti <= ex) return 0;
  let tax = 0;
  // 5% slab: from basic exemption up to ₹5L
  tax += Math.max(0, Math.min(ti, 500000) - ex) * 0.05;
  // 20% slab: ₹5L – ₹10L
  if (ti > 500000) tax += (Math.min(ti, 1000000) - 500000) * 0.20;
  // 30% slab: above ₹10L
  if (ti > 1000000) tax += (ti - 1000000) * 0.30;
  return tax;
}

// ── Compute full tax with capital gains properly separated ────────────────────
// FIX (Bug 1,2,4,5,6,7): Capital gains handled at flat rates, correct rebate & surcharge
export type TaxResult = {
  normalTaxable: number;
  ltcgTaxable: number; ltcgExempt: number; ltcgTax: number;
  stcgTax: number; cgTax: number;
  slabTax: number; rebate: number; marginalRelief: number;
  slabTaxFinal: number;
  surcharge: number; cess: number; total: number;
  rebateApplies: boolean; totalForRebate: number;
};

function computeTax(
  normalTaxable: number,    // salary + HP + business + other (EXCLUDING capital gains)
  stcg: number,             // STCG u/s 111A (equity/equity MF) — taxed @ 20% flat
  ltcg: number,             // LTCG u/s 112A (equity/equity MF) — ₹1.25L exempt + 12.5%
  type: TaxpayerType,
  isNew: boolean
): TaxResult {
  // Step 1: LTCG — apply ₹1,25,000 basic exemption u/s 112A
  const ltcgExempt   = Math.min(ltcg, 125000);           // FIX Bug 1
  const ltcgTaxable  = Math.max(0, ltcg - ltcgExempt);
  const ltcgTax      = ltcgTaxable * 0.125;              // 12.5% flat

  // Step 2: STCG u/s 111A — 20% flat (revised from 15% w.e.f. 23 July 2024)
  const stcgTax = stcg * 0.20;                           // FIX Bug 2
  const cgTax   = ltcgTax + stcgTax;

  // Step 3: Slab tax on NORMAL income only (not on capital gains)
  const slabTax = isNew
    ? newRegimeSlab(normalTaxable)
    : oldRegimeSlab(normalTaxable, type);

  // Step 4: 87A Rebate — only on SLAB tax, NOT on STCG/LTCG tax   FIX Bug 4
  // For new regime: total income (including CG) ≤ ₹12L → rebate up to ₹60,000
  // For old regime: normal taxable ≤ ₹5L → rebate up to ₹12,500
  const totalForRebate = normalTaxable + stcg + ltcgTaxable; // CG after exemption
  let rebate = 0;
  let rebateApplies = false;
  if (isNew) {
    if (totalForRebate <= 1200000) { rebate = Math.min(slabTax, 60000); rebateApplies = true; }
  } else {
    if (normalTaxable <= 500000) { rebate = Math.min(slabTax, 12500); rebateApplies = true; }
  }
  let slabTaxAfterRebate = Math.max(0, slabTax - rebate);

  // Step 5: Marginal Relief for new regime (FIX Bug 7)
  // Income just above ₹12L: tax should not exceed (income − ₹12,00,000)
  let marginalRelief = 0;
  if (isNew && !rebateApplies && totalForRebate > 1200000 && totalForRebate <= 1275000) {
    const cap = totalForRebate - 1200000;
    if (slabTaxAfterRebate > cap) { marginalRelief = slabTaxAfterRebate - cap; }
  }
  const slabTaxFinal = Math.max(0, slabTaxAfterRebate - marginalRelief);

  // Step 6: Surcharge — cap at 15% for STCG/LTCG portion   FIX Bug 6
  const totalIncome = normalTaxable + stcg + ltcgTaxable;
  let sr = 0;
  if (totalIncome > 50000000)      sr = isNew ? 0.25 : 0.37;
  else if (totalIncome > 20000000) sr = 0.25;
  else if (totalIncome > 10000000) sr = 0.15;
  else if (totalIncome > 5000000)  sr = 0.10;
  const srOnNormal = slabTaxFinal * sr;
  const srOnCG     = cgTax * Math.min(sr, 0.15);      // Cap at 15% for CG
  const surcharge  = srOnNormal + srOnCG;

  // Step 7: Health & Education Cess @ 4%
  const baseTax = slabTaxFinal + cgTax;
  const cess    = (baseTax + surcharge) * 0.04;

  return {
    normalTaxable, ltcgTaxable, ltcgExempt, ltcgTax,
    stcgTax, cgTax, slabTax, rebate, marginalRelief,
    slabTaxFinal, surcharge, cess,
    total: Math.round(baseTax + surcharge + cess),
    rebateApplies, totalForRebate,
  };
}

// ── Formatters ────────────────────────────────────────────────────────────────
const fmtN = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));
const fmtS = (n: number) => n >= 10000000 ? `₹${(n/10000000).toFixed(2)} Cr` : n >= 100000 ? `₹${(n/100000).toFixed(2)} L` : `₹${fmtN(n)}`;
const n = (s: string) => parseFloat(s) || 0;

const NEW_SLABS = [["0 – 4L","NIL"],["4L – 8L","5%"],["8L – 12L","10%"],["12L – 16L","15%"],["16L – 20L","20%"],["20L – 24L","25%"],["Above 24L","30%"]];
const OLD_SLABS = [["0 – 2.5L","NIL"],["2.5L – 5L","5%"],["5L – 10L","20%"],["Above 10L","30%"]];
const FY_LABELS: Record<FY, { label: string; short: string; ay: string; act: string }> = {
  "2526": { label: "FY 2025-26", short: "2025-26", ay: "2026-27", act: "Finance Act, 2025 (Budget Feb 2025)" },
  "2627": { label: "FY 2026-27", short: "2026-27", ay: "2027-28", act: "Income-tax Act, 2025 (effective 1 April 2026)" },
};

// ── (Excel export is in buildExcel.ts) ───────────────────────────────────────
export default function IncomeTaxEstimatorPage() {
  const [step, setStep]   = useState(0);
  const [fy, setFy]       = useState<FY>("2627");

  const [basicInfo, setBasicInfo] = useState({ taxpayerType: "individual" as TaxpayerType, regime: "both" as Regime });
  const [personalInfo, setPersonalInfo] = useState({ name: "", pan: "" });

  const [income, setIncome] = useState({ salary:"", houseProperty:"", business:"", stcg:"", ltcg:"", other:"" });
  const [ded, setDed]       = useState({ c80C:"", c80CCD1B:"", c80D:"", c80G:"", hra:"", interestHomeLoan:"" });

  // Salary breakdown for exemptions
  const [showSalDet, setShowSalDet] = useState(false);
  const [sal, setSal] = useState({
    basicDa:"", hraReceived:"", rentPm:"", metroCity:"yes",
    ltaReceived:"", ltaExempt:"",
    gratuityReceived:"", yearsService:"", lastBasicDa:"",
    leaveEncashment:"", avgSalary10m:"", leaveBalanceDays:"",
    numChildren:"2", eduAllowance:"", hostelAllowance:"",
  });

  // TDS & Advance Tax
  const [taxPaid, setTaxPaid] = useState({ tds:"", advanceTax:"", filingDelayMonths:"0" });

  // ── Computed exemptions ────────────────────────────────────────────────────
  const hraExempt = useMemo(() => {
    const basic = n(sal.basicDa), hraRec = n(sal.hraReceived), rentPm = n(sal.rentPm);
    if (sal.basicDa && sal.hraReceived && sal.rentPm) {
      const metro = sal.metroCity === "yes";
      return Math.max(0, Math.min(hraRec, basic * (metro ? 0.5 : 0.4), Math.max(0, rentPm * 12 - basic * 0.1)));
    }
    return n(ded.hra);
  }, [sal, ded.hra]);

  const ltaExempt    = Math.min(n(sal.ltaReceived), n(sal.ltaExempt));
  const gratuityEx   = useMemo(() => {
    const gr = n(sal.gratuityReceived), yrs = n(sal.yearsService), lb = n(sal.lastBasicDa);
    if (!gr) return 0;
    return Math.min(gr, 2000000, lb > 0 ? (lb / 26) * 15 * yrs : gr);
  }, [sal]);
  const leaveEx      = useMemo(() => {
    const lr = n(sal.leaveEncashment), avg = n(sal.avgSalary10m), days = n(sal.leaveBalanceDays);
    if (!lr) return 0;
    return Math.min(lr, 25000000, avg * 10, avg > 0 ? (avg / 30) * days : lr);
  }, [sal]);
  const children     = Math.min(parseInt(sal.numChildren) || 0, 2);
  const eduEx        = Math.min(n(sal.eduAllowance), children * 100 * 12);
  const hostelEx     = Math.min(n(sal.hostelAllowance), children * 300 * 12);
  const totalExemp   = hraExempt + ltaExempt + gratuityEx + leaveEx + eduEx + hostelEx;

  // ── Tax calculation ────────────────────────────────────────────────────────
  const results = useMemo(() => {
    const stcg    = n(income.stcg);
    const ltcg    = n(income.ltcg);
    // Normal income = everything EXCEPT STCG/LTCG (handled separately at flat rates)
    const normalGross = n(income.salary) + n(income.houseProperty) + n(income.business) + n(income.other);
    const gross   = normalGross + stcg + ltcg; // total gross for display

    const isSenior = basicInfo.taxpayerType === "senior" || basicInfo.taxpayerType === "supersenior";
    const max80D   = isSenior ? 50000 : 25000;
    // FIX Bug 5: hlInt is factored into HP income by the user (field hint updated below).
    // We still collect hlInt for the Excel computation export only — NOT double-deducted here.
    const hlInt    = Math.min(n(ded.interestHomeLoan), 200000);

    // OLD REGIME: deductions from normal income only
    const oldDedChVI = Math.min(n(ded.c80C), 150000) + Math.min(n(ded.c80CCD1B), 50000) +
      Math.min(n(ded.c80D), max80D) + n(ded.c80G);
    const oldDeductions = 50000 + oldDedChVI + hraExempt;  // Note: hlInt removed (Bug 5 fix)
    const oldNormalTaxable = Math.max(0, normalGross - oldDeductions);
    const oldRes = computeTax(oldNormalTaxable, stcg, ltcg, basicInfo.taxpayerType, false);

    // NEW REGIME: only ₹75,000 standard deduction on normal income
    const newNormalTaxable = Math.max(0, normalGross - 75000);
    const newRes = computeTax(newNormalTaxable, stcg, ltcg, basicInfo.taxpayerType, true);

    const savings = Math.abs(oldRes.total - newRes.total);
    const better  = oldRes.total <= newRes.total ? "old" : "new";

    return {
      gross, normalGross, stcg, ltcg,
      oldDeductions, oldNormalTaxable, oldDedChVI, hlInt,
      old: oldRes, newR: newRes,
      savings, better, isSenior, max80D,
    };
  }, [income, ded, basicInfo, hraExempt]);

  const fyInfo     = FY_LABELS[fy];
  const isLastStep = step === 3;

  function handleExport() {
    buildExcel({
      fy,
      fyLabel:  fyInfo.label,
      ayLabel:  fyInfo.ay,
      act:      fyInfo.act,
      name:     personalInfo.name,
      pan:      personalInfo.pan,
      type:     basicInfo.taxpayerType,
      gross:          n(income.salary),
      houseProperty:  n(income.houseProperty),
      business:       n(income.business),
      stcg:           n(income.stcg),
      ltcg:           n(income.ltcg),
      other:          n(income.other),
      hraExempt,
      ltaExempt,
      gratuityExempt: gratuityEx,
      leaveExempt:    leaveEx,
      eduExempt:      eduEx,
      hostelExempt:   hostelEx,
      oldDed:    results.oldDeductions,
      c80C:      n(ded.c80C),
      c80CCD:    n(ded.c80CCD1B),
      c80D:      n(ded.c80D),
      c80G:      n(ded.c80G),
      hlInterest: results.hlInt,
      old:  { taxable: results.old.normalTaxable, base: results.old.slabTaxFinal, surcharge: results.old.surcharge, cess: results.old.cess, total: results.old.total },
      newR: { taxable: results.newR.normalTaxable, base: results.newR.slabTaxFinal, surcharge: results.newR.surcharge, cess: results.newR.cess, total: results.newR.total },
      tds:          n(taxPaid.tds),
      advTax:       n(taxPaid.advanceTax),
      filingDelay:  parseInt(taxPaid.filingDelayMonths) || 0,
      salBreak: sal,
    });
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted hover:text-dark mb-6">
          <ArrowLeft size={15} /> Back to Tools
        </Link>

        <div className="mb-3">
          <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
            <BarChart3 className="text-primary" size={22} /> Income Tax Estimator
          </h1>
          <p className="text-muted text-sm mt-1">
            Compare Old vs New Tax Regime for <strong>{fyInfo.label}</strong> (Tax Year {fyInfo.short}). Export CA-style Tax Computation Sheet.
          </p>
        </div>

        {/* FY Selector */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-muted uppercase tracking-wide">Financial Year:</span>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(["2526","2627"] as FY[]).map(f => (
              <button key={f} onClick={() => setFy(f)}
                className={`px-4 py-1.5 text-xs font-semibold transition-colors ${fy === f ? "bg-primary text-white" : "bg-white text-muted hover:bg-gray-50"}`}>
                FY {f === "2526" ? "2025-26" : "2026-27"}
              </button>
            ))}
          </div>
          {fy === "2627" && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Current FY</span>}
          {fy === "2526" && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Previous FY</span>}
        </div>

        <div className="flex items-start gap-2 bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 mb-6 text-xs text-dark">
          <Info size={13} className="text-gold flex-shrink-0 mt-0.5" />
          {fy === "2627"
            ? <span><strong>Updated for Income-tax Act, 2025</strong> effective 1 April 2026. New regime default. 87A rebate: zero tax up to ₹12,00,000.</span>
            : <span><strong>FY 2025-26 (AY 2026-27)</strong> — Finance Act, 2025. New regime default. 87A rebate: zero tax up to ₹12,00,000.</span>}
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  i === step ? "bg-primary text-white" : i < step ? "bg-green-100 text-green-700 cursor-pointer" : "bg-gray-100 text-muted cursor-default"
                }`}>
                {i < step ? <CheckCircle size={12} /> : <span>{i+1}</span>}
                {s}
              </button>
              {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-card shadow-card border border-gray-100 p-6">

          {/* ── STEP 1: Basic Info ─────────────────────────────────────────── */}
          {step === 0 && (
            <div>
              <h2 className="font-semibold text-dark mb-5 pb-2 border-b border-gray-100">Basic Information</h2>
              <div className="space-y-5">
                {/* Personal info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name <span className="text-muted font-normal">(for Excel export)</span></label>
                    <input className="input-field" value={personalInfo.name} placeholder="e.g. Piyush Nimse"
                      onChange={e => setPersonalInfo({ ...personalInfo, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">PAN <span className="text-muted font-normal">(for Excel export)</span></label>
                    <input className="input-field" value={personalInfo.pan} placeholder="ABCDE1234F"
                      onChange={e => setPersonalInfo({ ...personalInfo, pan: e.target.value.toUpperCase() })} maxLength={10} />
                  </div>
                </div>

                <div>
                  <label className="label">Taxpayer Type</label>
                  <select className="input-field" value={basicInfo.taxpayerType}
                    onChange={e => setBasicInfo({ ...basicInfo, taxpayerType: e.target.value as TaxpayerType })}>
                    <option value="individual">Individual (Below 60 yrs)</option>
                    <option value="senior">Senior Citizen (60–80 yrs)</option>
                    <option value="supersenior">Super Senior (80+ yrs)</option>
                    <option value="huf">HUF</option>
                  </select>
                  <p className="text-xs text-muted mt-1">Affects basic exemption limit under Old Regime</p>
                </div>

                <div>
                  <label className="label">Tax Regime</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{v:"old",label:"Old Regime",sub:"With deductions"},{v:"new",label:"New Regime",sub:`Default ${fyInfo.label}`},{v:"both",label:"Compare Both",sub:"Recommended ✓"}].map(({v,label,sub}) => (
                      <button key={v} onClick={() => setBasicInfo({...basicInfo, regime: v as Regime})}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${basicInfo.regime===v ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
                        <div className="text-sm font-semibold text-dark">{label}</div>
                        <div className="text-xs text-muted mt-0.5">{sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Income ─────────────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h2 className="font-semibold text-dark mb-5 pb-2 border-b border-gray-100">Income Details — {fyInfo.label}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {k:"salary",        label:"Gross Salary / Pension",         hint:"Total salary before any exemptions"},
                  {k:"houseProperty", label:"Income from House Property",      hint:"Net HP income after 30% standard deduction & interest on loan. Self-occupied: enter negative interest (e.g. -160000). Max loss ₹2L."},
                  {k:"business",      label:"Business / Professional Income",  hint:"Net profit after all business expenses"},
                  {k:"stcg",          label:"STCG — Equity / Equity MF (u/s 111A)", hint:"Short-term capital gains on STT-paid equity shares & equity MFs — taxed @ 20% flat. For other STCG, add to Other Income."},
                  {k:"ltcg",          label:"LTCG — Equity / Equity MF (u/s 112A)", hint:"Long-term capital gains on equity — first ₹1,25,000 exempt, balance taxed @ 12.5% flat. For property LTCG, add to Other Income."},
                  {k:"other",         label:"Other Income",                    hint:"Interest, dividends, etc."},
                ].map(({k,label,hint}) => (
                  <div key={k}>
                    <label className="label">{label}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                      <input type="number" className="input-field pl-7"
                        value={(income as Record<string,string>)[k]}
                        onChange={e => setIncome({...income, [k]: e.target.value})}
                        placeholder="0" min="0" />
                    </div>
                    <p className="text-xs text-muted mt-1">{hint}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10 text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Gross Total Income</span>
                  <span className="font-bold text-primary text-base">{fmtS(results.gross)}</span>
                </div>
                {n(income.ltcg) > 0 && (
                  <div className="flex justify-between items-center text-xs border-t border-primary/10 pt-2">
                    <span className="text-green-700">Less: LTCG Exempt u/s 112A (up to ₹1,25,000)</span>
                    <span className="font-semibold text-green-700">− {fmtS(Math.min(n(income.ltcg), 125000))}</span>
                  </div>
                )}
                {n(income.ltcg) > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-dark font-medium">Total Income for Tax Computation</span>
                    <span className="font-bold text-dark">{fmtS(results.gross - Math.min(n(income.ltcg), 125000))}</span>
                  </div>
                )}
              </div>

              {/* Salary Breakdown for Exemptions */}
              <div className="mt-5 border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setShowSalDet(!showSalDet)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div>
                    <span className="font-semibold text-sm text-dark">Salary Breakdown for Exemptions & Excel Computation</span>
                    <p className="text-xs text-muted mt-0.5">HRA, LTA, Gratuity, Leave Encashment, Education/Hostel Allowance</p>
                  </div>
                  {showSalDet ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                </button>

                {showSalDet && (
                  <div className="p-4 space-y-5">

                    {/* HRA */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">HRA Exemption — Sec 10(13A)</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="label">Basic Salary + DA (Annual)</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                            <input type="number" className="input-field pl-7" value={sal.basicDa} onChange={e => setSal({...sal, basicDa: e.target.value})} placeholder="0" /></div>
                        </div>
                        <div>
                          <label className="label">HRA Received from Employer (Annual)</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                            <input type="number" className="input-field pl-7" value={sal.hraReceived} onChange={e => setSal({...sal, hraReceived: e.target.value})} placeholder="0" /></div>
                        </div>
                        <div>
                          <label className="label">Rent Paid (Per Month)</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                            <input type="number" className="input-field pl-7" value={sal.rentPm} onChange={e => setSal({...sal, rentPm: e.target.value})} placeholder="0" /></div>
                        </div>
                        <div>
                          <label className="label">City Type</label>
                          <select className="input-field" value={sal.metroCity} onChange={e => setSal({...sal, metroCity: e.target.value})}>
                            <option value="yes">Metro City (Delhi/Mumbai/Kolkata/Chennai)</option>
                            <option value="no">Non-Metro City</option>
                          </select>
                        </div>
                      </div>
                      {sal.basicDa && sal.hraReceived && sal.rentPm && (
                        <div className="mt-2 p-2 bg-green-50 rounded-lg text-xs text-green-800">
                          ✓ HRA Exempt (auto-computed): <strong>₹{fmtN(hraExempt)}</strong>
                        </div>
                      )}
                    </div>

                    {/* LTA */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">LTA Exemption — Sec 10(5)</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="label">LTA Received from Employer</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                            <input type="number" className="input-field pl-7" value={sal.ltaReceived} onChange={e => setSal({...sal, ltaReceived: e.target.value})} placeholder="0" /></div>
                        </div>
                        <div>
                          <label className="label">LTA Exemption Claimed</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                            <input type="number" className="input-field pl-7" value={sal.ltaExempt} onChange={e => setSal({...sal, ltaExempt: e.target.value})} placeholder="0" /></div>
                          <p className="text-xs text-muted mt-1">Actual travel cost for 2 journeys in 4-year block</p>
                        </div>
                      </div>
                    </div>

                    {/* Gratuity */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Gratuity Exemption — Sec 10(10)</p>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="label">Gratuity Received</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                            <input type="number" className="input-field pl-7" value={sal.gratuityReceived} onChange={e => setSal({...sal, gratuityReceived: e.target.value})} placeholder="0" /></div>
                        </div>
                        <div>
                          <label className="label">Years of Service</label>
                          <input type="number" className="input-field" value={sal.yearsService} onChange={e => setSal({...sal, yearsService: e.target.value})} placeholder="e.g. 10" />
                        </div>
                        <div>
                          <label className="label">Last Basic + DA (Monthly)</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                            <input type="number" className="input-field pl-7" value={sal.lastBasicDa} onChange={e => setSal({...sal, lastBasicDa: e.target.value})} placeholder="0" /></div>
                        </div>
                      </div>
                    </div>

                    {/* Leave Encashment */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Leave Encashment — Sec 10(10AA)</p>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="label">Leave Encashment Received</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                            <input type="number" className="input-field pl-7" value={sal.leaveEncashment} onChange={e => setSal({...sal, leaveEncashment: e.target.value})} placeholder="0" /></div>
                        </div>
                        <div>
                          <label className="label">Avg Salary (Last 10 months)</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                            <input type="number" className="input-field pl-7" value={sal.avgSalary10m} onChange={e => setSal({...sal, avgSalary10m: e.target.value})} placeholder="0" /></div>
                        </div>
                        <div>
                          <label className="label">Leave Balance (Days)</label>
                          <input type="number" className="input-field" value={sal.leaveBalanceDays} onChange={e => setSal({...sal, leaveBalanceDays: e.target.value})} placeholder="e.g. 60" />
                        </div>
                      </div>
                    </div>

                    {/* Education / Hostel */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">Education & Hostel Allowance — Sec 10(14)(ii)</p>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="label">No. of Children</label>
                          <select className="input-field" value={sal.numChildren} onChange={e => setSal({...sal, numChildren: e.target.value})}>
                            <option value="0">0</option><option value="1">1</option><option value="2">2 (max for exemption)</option>
                          </select>
                        </div>
                        <div>
                          <label className="label">Education Allowance Received</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                            <input type="number" className="input-field pl-7" value={sal.eduAllowance} onChange={e => setSal({...sal, eduAllowance: e.target.value})} placeholder="0" /></div>
                          <p className="text-xs text-muted mt-1">Exempt up to ₹100/child/month</p>
                        </div>
                        <div>
                          <label className="label">Hostel Allowance Received</label>
                          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                            <input type="number" className="input-field pl-7" value={sal.hostelAllowance} onChange={e => setSal({...sal, hostelAllowance: e.target.value})} placeholder="0" /></div>
                          <p className="text-xs text-muted mt-1">Exempt up to ₹300/child/month</p>
                        </div>
                      </div>
                    </div>

                    {totalExemp > 0 && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                        <div className="font-semibold text-green-800 mb-1">Total Exemptions u/s 10: ₹{fmtN(totalExemp)}</div>
                        <div className="grid grid-cols-2 gap-x-4 text-xs text-green-700">
                          {hraExempt > 0 && <span>HRA [10(13A)]: ₹{fmtN(hraExempt)}</span>}
                          {ltaExempt > 0 && <span>LTA [10(5)]: ₹{fmtN(ltaExempt)}</span>}
                          {gratuityEx > 0 && <span>Gratuity [10(10)]: ₹{fmtN(gratuityEx)}</span>}
                          {leaveEx > 0 && <span>Leave Enc. [10(10AA)]: ₹{fmtN(leaveEx)}</span>}
                          {eduEx > 0 && <span>Edu. Allow. [10(14)]: ₹{fmtN(eduEx)}</span>}
                          {hostelEx > 0 && <span>Hostel Allow. [10(14)]: ₹{fmtN(hostelEx)}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 3: Deductions ─────────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <h2 className="font-semibold text-dark mb-1 pb-2 border-b border-gray-100">Deductions — Old Regime Only</h2>
              <p className="text-xs text-muted mb-5">Under New Regime, only ₹75,000 standard deduction applies (auto-applied).</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm flex justify-between items-center">
                  <div><span className="font-medium text-dark">Standard Deduction (Salaried) — Auto-applied</span></div>
                  <span className="font-bold text-green-600">- ₹50,000</span>
                </div>
                {[
                  {k:"c80C",           label:"Sec 80C",              cap:"Max ₹1,50,000", hint:"LIC, PPF, ELSS, PF, Tuition Fees, NSC", max:150000},
                  {k:"c80CCD1B",       label:"Sec 80CCD(1B) — NPS",  cap:"Max ₹50,000",  hint:"Additional NPS contribution (over 80C)", max:50000},
                  {k:"c80D",           label:"Sec 80D — Health Ins.", cap:`Max ₹${results.isSenior?"50,000":"25,000"}`, hint:`${results.isSenior?"Senior citizen limit: ₹50,000":"Self + family premium"}`, max:results.max80D},
                  {k:"c80G",           label:"Sec 80G — Donations",   cap:null,            hint:"Enter eligible amount (50%/100% of donation)", max:undefined},
                  {k:"hra",            label:"HRA Exemption u/s 10(13A)", cap:null,         hint:sal.basicDa&&sal.hraReceived&&sal.rentPm ? `Auto-computed: ₹${fmtN(hraExempt)}` : "From Form 16 / employer cert", max:undefined},
                  {k:"interestHomeLoan", label:"Sec 24(b) — Home Loan Interest", cap:"Max ₹2,00,000", hint:"Interest on housing loan (self-occupied)", max:200000},
                ].map(({k,label,cap,hint,max}) => (
                  <div key={k}>
                    <label className="label">{label} {cap && <span className="text-gold text-xs font-normal">({cap})</span>}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                      <input type="number" className="input-field pl-7"
                        value={(ded as Record<string,string>)[k]}
                        onChange={e => setDed({...ded, [k]: e.target.value})}
                        placeholder={k==="hra" && hraExempt > 0 ? String(Math.round(hraExempt)) : "0"}
                        min="0" max={max} />
                    </div>
                    <p className="text-xs text-muted mt-1">{hint}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 bg-primary/5 rounded-lg text-sm flex justify-between items-center">
                <span className="text-muted">Total Old Regime Deductions</span>
                <span className="font-bold text-primary text-base">{fmtS(results.oldDeductions)}</span>
              </div>

              {/* TDS & Advance Tax */}
              <div className="mt-5 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">TDS & Advance Tax <span className="text-muted font-normal normal-case">(for 234 Interest & Net Tax Computation)</span></p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="label">TDS Deducted (Form 16 / 26AS)</label>
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                      <input type="number" className="input-field pl-7" value={taxPaid.tds} onChange={e => setTaxPaid({...taxPaid, tds: e.target.value})} placeholder="0" /></div>
                  </div>
                  <div>
                    <label className="label">Advance Tax Paid (All installments)</label>
                    <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">₹</span>
                      <input type="number" className="input-field pl-7" value={taxPaid.advanceTax} onChange={e => setTaxPaid({...taxPaid, advanceTax: e.target.value})} placeholder="0" /></div>
                  </div>
                  <div>
                    <label className="label">Filing Delay (Months after 31 July)</label>
                    <input type="number" className="input-field" value={taxPaid.filingDelayMonths} onChange={e => setTaxPaid({...taxPaid, filingDelayMonths: e.target.value})} placeholder="0" min="0" />
                    <p className="text-xs text-muted mt-1">For Sec 234A interest calculation</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Results ────────────────────────────────────────────── */}
          {step === 3 && (
            <div>
              <div className="flex items-center justify-between mb-5 pb-2 border-b border-gray-100">
                <h2 className="font-semibold text-dark">Tax Results — {fyInfo.label} (AY {fyInfo.ay})</h2>
                <button onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors">
                  <Download size={14} /> Export Tax Computation (Excel)
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                {/* Old Regime */}
                <div className={`p-5 rounded-xl border-2 ${results.better==="old" ? "border-green-400 bg-green-50" : "border-gray-200 bg-background"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-dark">Old Regime</h3>
                    {results.better==="old" && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">SAVES MORE</span>}
                  </div>
                  <div className="space-y-2 text-sm">
                    <Row label="Normal Income (excl. CG)"  value={`₹${fmtN(results.normalGross)}`} />
                    <Row label="Less: Deductions"          value={`- ₹${fmtN(results.oldDeductions)}`} vc="text-green-600" />
                    <Row label="Normal Taxable Income"     value={`₹${fmtN(results.old.normalTaxable)}`} />
                    <Row label="Slab Tax (on normal inc.)" value={`₹${fmtN(results.old.slabTax)}`} />
                    {results.old.rebateApplies && <Row label="Less: Rebate u/s 87A"  value={`- ₹${fmtN(results.old.rebate)}`} vc="text-green-600" />}
                    {results.old.marginalRelief > 0 && <Row label="Less: Marginal Relief" value={`- ₹${fmtN(results.old.marginalRelief)}`} vc="text-green-600" />}
                    {results.stcg > 0 && <Row label="STCG Tax u/s 111A @ 20%" value={`₹${fmtN(results.old.stcgTax)}`} />}
                    {results.ltcg > 0 && <>
                      <Row label={`LTCG Exempt (₹1.25L)`}    value={`- ₹${fmtN(results.old.ltcgExempt)}`} vc="text-green-600" />
                      <Row label="LTCG Tax u/s 112A @ 12.5%" value={`₹${fmtN(results.old.ltcgTax)}`} />
                    </>}
                    {results.old.surcharge > 0 && <Row label="Add: Surcharge" value={`₹${fmtN(results.old.surcharge)}`} />}
                    <Row label="Health & Ed. Cess (4%)"    value={`₹${fmtN(results.old.cess)}`} />
                    <div className="flex justify-between border-t border-gray-300 pt-2 mt-2 font-bold">
                      <span className="text-dark">Total Tax Payable</span>
                      <span className="text-primary text-base">₹{fmtN(results.old.total)}</span>
                    </div>
                  </div>
                </div>

                {/* New Regime */}
                <div className={`p-5 rounded-xl border-2 ${results.better==="new" ? "border-green-400 bg-green-50" : "border-gray-200 bg-background"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-dark">New Regime</h3>
                    {results.better==="new" && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">SAVES MORE</span>}
                  </div>
                  <div className="space-y-2 text-sm">
                    <Row label="Normal Income (excl. CG)"  value={`₹${fmtN(results.normalGross)}`} />
                    <Row label="Less: Std. Deduction"      value="- ₹75,000" vc="text-green-600" />
                    <Row label="Normal Taxable Income"     value={`₹${fmtN(results.newR.normalTaxable)}`} />
                    <Row label="Slab Tax (on normal inc.)" value={`₹${fmtN(results.newR.slabTax)}`} />
                    {results.newR.rebateApplies && <Row label="Less: Rebate u/s 87A"  value={`- ₹${fmtN(results.newR.rebate)}`} vc="text-green-600" />}
                    {results.newR.marginalRelief > 0 && <Row label="Less: Marginal Relief" value={`- ₹${fmtN(results.newR.marginalRelief)}`} vc="text-green-600" />}
                    {results.stcg > 0 && <Row label="STCG Tax u/s 111A @ 20%" value={`₹${fmtN(results.newR.stcgTax)}`} />}
                    {results.ltcg > 0 && <>
                      <Row label={`LTCG Exempt (₹1.25L)`}    value={`- ₹${fmtN(results.newR.ltcgExempt)}`} vc="text-green-600" />
                      <Row label="LTCG Tax u/s 112A @ 12.5%" value={`₹${fmtN(results.newR.ltcgTax)}`} />
                    </>}
                    {results.newR.surcharge > 0 && <Row label="Add: Surcharge" value={`₹${fmtN(results.newR.surcharge)}`} />}
                    <Row label="Health & Ed. Cess (4%)"    value={`₹${fmtN(results.newR.cess)}`} />
                    <div className="flex justify-between border-t border-gray-300 pt-2 mt-2 font-bold">
                      <span className="text-dark">Total Tax Payable</span>
                      <span className="text-primary text-base">₹{fmtN(results.newR.total)}</span>
                    </div>
                    {results.newR.rebateApplies && <p className="text-xs text-green-700 font-medium">✓ 87A Rebate: Slab tax = ₹0 (income ≤ ₹12L)</p>}
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className={`rounded-lg p-4 border mb-5 ${results.better==="old" ? "bg-green-50 border-green-300" : "bg-blue-50 border-blue-300"}`}>
                <div className="font-bold text-dark text-sm">
                  ✅ Choose <span className="text-primary">{results.better==="old" ? "Old Tax Regime" : `New Tax Regime (${fyInfo.label} default)`}</span> — you save <span className="text-green-600">₹{fmtN(results.savings)}</span> in taxes.
                </div>
                {results.newR.rebateApplies && results.better==="new" && (
                  <p className="text-xs text-green-700 mt-1">Income ≤ ₹12,00,000 — Sec 87A rebate makes your tax liability <strong>ZERO</strong> under New Regime.</p>
                )}
              </div>

              {/* Net Tax Payable after TDS */}
              {(n(taxPaid.tds) > 0 || n(taxPaid.advanceTax) > 0) && (
                <div className="p-4 bg-background border border-gray-200 rounded-xl mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-dark mb-3">Net Tax Payable / (Refundable)</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[{label:"Old Regime", tax:results.old.total},{label:"New Regime", tax:results.newR.total}].map(({label, tax}) => {
                      const net = tax - n(taxPaid.tds) - n(taxPaid.advanceTax);
                      return (
                        <div key={label} className={`p-3 rounded-lg border ${net > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                          <div className="text-xs text-muted mb-1">{label}</div>
                          <div className={`font-bold text-base ${net > 0 ? "text-red-600" : "text-green-600"}`}>
                            {net > 0 ? `Payable: ₹${fmtN(net)}` : `Refund: ₹${fmtN(Math.abs(net))}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Exemptions summary */}
              {totalExemp > 0 && (
                <div className="p-4 bg-background border border-gray-200 rounded-xl mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-dark mb-2">Exemptions u/s 10 Applied in Computation</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted">
                    {hraExempt>0 && <span>HRA u/s 10(13A): ₹{fmtN(hraExempt)}</span>}
                    {ltaExempt>0 && <span>LTA u/s 10(5): ₹{fmtN(ltaExempt)}</span>}
                    {gratuityEx>0 && <span>Gratuity u/s 10(10): ₹{fmtN(gratuityEx)}</span>}
                    {leaveEx>0 && <span>Leave Enc. u/s 10(10AA): ₹{fmtN(leaveEx)}</span>}
                    {eduEx>0 && <span>Edu. Allowance u/s 10(14): ₹{fmtN(eduEx)}</span>}
                    {hostelEx>0 && <span>Hostel Allowance u/s 10(14): ₹{fmtN(hostelEx)}</span>}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 text-xs font-semibold text-dark">Total: ₹{fmtN(totalExemp)}</div>
                </div>
              )}

              {/* Export CTA */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-5">
                <div className="flex items-start gap-3">
                  <Download size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-dark mb-1">Export Professional Tax Computation Sheet</p>
                    <p className="text-xs text-muted mb-3">Downloads a 4-sheet cross-linked Excel workbook: Tax Computation · HRA Working · Sec 234 Interest · Gratuity & Leave — as used by Chartered Accountants.</p>
                    <button onClick={handleExport}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-white transition-colors">
                      <Download size={14} /> Download Excel Computation
                    </button>
                  </div>
                </div>
              </div>

              {/* Slab tables */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-dark mb-2 uppercase tracking-wide">New Regime Slabs — {fyInfo.label}</h4>
                  <div className="space-y-1">
                    {NEW_SLABS.map(([range,rate]) => (
                      <div key={range} className="flex justify-between px-3 py-1.5 bg-background rounded border border-gray-100 text-xs">
                        <span className="text-muted">{range}</span><span className="font-semibold text-dark">{rate}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted mt-1.5">87A rebate: Zero tax if income ≤ ₹12L</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-dark mb-2 uppercase tracking-wide">Old Regime Slabs — {fyInfo.label}</h4>
                  <div className="space-y-1">
                    {OLD_SLABS.map(([range,rate]) => (
                      <div key={range} className="flex justify-between px-3 py-1.5 bg-background rounded border border-gray-100 text-xs">
                        <span className="text-muted">{range}</span><span className="font-semibold text-dark">{rate}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted mt-1.5">87A rebate: Up to ₹12,500 if income ≤ ₹5L</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-background rounded-lg border border-gray-100 text-xs text-muted">
                <span className="font-semibold text-dark">Surcharge: </span>
                &gt;50L–1Cr: 10% &nbsp;|&nbsp; &gt;1Cr–2Cr: 15% &nbsp;|&nbsp; &gt;2Cr–5Cr: 25% &nbsp;|&nbsp; &gt;5Cr: 37% (old) / 25% (new) + 4% Cess.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            <button onClick={() => setStep(s => Math.max(0, s-1))} disabled={step===0}
              className="btn-outline gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft size={15} /> Previous
            </button>
            {!isLastStep
              ? <button onClick={() => setStep(s => s+1)} className="btn-primary gap-2">
                  {step===2 ? "Calculate Tax" : "Next"} <ChevronRight size={15} />
                </button>
              : <button onClick={() => setStep(0)} className="btn-outline">Start Over</button>
            }
          </div>
        </div>

        <p className="tool-disclaimer">
          Results are indicative only. Based on {fyInfo.act}. Always consult a qualified Chartered Accountant.
          Associate Piyush is not liable for decisions based on tool outputs. © 2026 Associate Piyush, Pune.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, vc = "font-medium" }: { label: string; value: string; vc?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className={vc}>{value}</span>
    </div>
  );
}
