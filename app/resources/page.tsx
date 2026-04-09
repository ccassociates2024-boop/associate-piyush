import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight, BookOpen, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources",
  description: "Free tax and finance guides: GST ITC, TDS Rate Chart, Old vs New Regime, GSTR-9 Filing, Forensic Accounting, Advance Tax.",
};

const articles = [
  {
    slug: "gst-itc-eligibility",
    title: "Complete Guide to GST ITC Eligibility under Section 16",
    category: "GST",
    readTime: "8 min read",
    date: "April 5, 2026",
    excerpt: "A comprehensive breakdown of Input Tax Credit eligibility conditions, blocked credits under Section 17(5), and the critical Rule 36(4) reconciliation requirement.",
    content: `Input Tax Credit (ITC) is the foundation of the GST system — it ensures that tax is levied only on value addition at each stage of the supply chain. However, claiming ITC incorrectly can attract penalties, interest, and even criminal prosecution. This guide explains the eligibility conditions exhaustively.

**Section 16 Conditions for ITC:**
To claim ITC, ALL four conditions under Section 16(2) must be satisfied simultaneously:
1. You must possess a valid tax invoice or debit note issued by a registered supplier
2. You must have received the goods or services
3. The tax on such supply must have been paid by the supplier (reflected in GSTR-2B)
4. You must have filed your GST return (GSTR-3B)

**The 180-Day Rule:**
Section 16(2)(b) requires that payment to the supplier must be made within 180 days of the invoice date. If not paid, ITC claimed must be reversed with interest, and can be re-claimed once payment is made.

**Blocked Credits under Section 17(5):**
The following are "blocked" — ITC cannot be claimed regardless of other conditions:
- Motor vehicles (except for specific businesses like transport, driving schools)
- Food and beverages, outdoor catering
- Membership of clubs, health, and fitness centres
- Travel benefits to employees (LTC)
- Works contract services for construction of immovable property
- Goods/services for personal consumption

**Rule 36(4) — The 2A Reconciliation Requirement:**
Effective September 2020, ITC in GSTR-3B is restricted to invoices reflected in GSTR-2B. This makes monthly reconciliation mandatory. Excess ITC claimed is subject to interest at 24% per annum.

**Practical Reconciliation Process:**
- Step 1: Download GSTR-2B from GST Portal (auto-populated)
- Step 2: Match with your Purchase Register line-by-line
- Step 3: For mismatches, categorize: (a) Supplier not filed, (b) Invoice number mismatch, (c) Amount mismatch
- Step 4: Chase vendors for missing filings
- Step 5: Claim only 2B-reflected ITC in GSTR-3B

**ITC Reversal Situations:**
- Exempt supplies: Proportionate reversal required
- Credit notes from suppliers: Must reverse ITC
- Non-payment within 180 days
- Annual GSTR-9 reconciliation differences`,
  },
  {
    slug: "tds-rate-chart",
    title: "TDS Rate Chart FY 2025-26: Section-wise Reference",
    category: "TDS",
    readTime: "6 min read",
    date: "April 3, 2026",
    excerpt: "Complete TDS rate chart for FY 2025-26 covering all sections from 192 to 194N with threshold limits, applicable forms, and due date reminders.",
    content: `TDS (Tax Deducted at Source) is one of the most complex compliance requirements in India's tax system. With over 30 different TDS sections applicable to various payment types, getting the rates and thresholds right is critical to avoid interest and penalties.

**Key TDS Rates for FY 2025-26:**

**Section 192 — Salary:**
Rate: As per slab (no fixed rate). Deductible from every monthly salary payment. Employee must submit investment declarations in April, and the employer must reconcile at year-end.

**Section 194C — Contractors:**
- Individual/HUF: 1% | Company/LLP: 2%
- Threshold: ₹30,000 per transaction or ₹1,00,000 in aggregate per FY
- Key rule: Single contract below ₹30,000 — no TDS. But watch the annual aggregate.

**Section 194H — Commission/Brokerage:**
Rate: 5% | Threshold: ₹15,000 per year
Applies to insurance agents, stock brokers, travel agents receiving commission.

**Section 194J — Professional/Technical Fees:**
- Professional services (doctors, lawyers, CAs, etc.): 10%
- Technical services (call centres, IT services): 2%
- Director fees (non-salary): 10%
- Threshold: ₹30,000 per year

**Section 194I — Rent:**
- Land/Building/Furniture: 10%
- Plant & Machinery: 2%
- Threshold: ₹2,40,000 per year (revised from ₹1,80,000)

**Section 194Q — Purchase of Goods:**
Rate: 0.1% | Threshold: Aggregate purchase > ₹50 Lakhs in FY
This section was introduced in Budget 2021 to track large B2B transactions.

**Due Dates:**
- Monthly deductions: 7th of following month
- March deductions: 30th April
- Quarterly returns (26Q/24Q): 31st July, 31st October, 31st January, 31st May

**No-PAN Rule (Section 206AA):**
If payee doesn't provide PAN, TDS must be deducted at the higher of: (a) the applicable rate, (b) twice the rate, or (c) 20%. This makes PAN collection mandatory for all payments above threshold.`,
  },
  {
    slug: "old-vs-new-regime",
    title: "Old vs New Tax Regime: Which is Better for You?",
    category: "Income Tax",
    readTime: "7 min read",
    date: "April 1, 2026",
    excerpt: "A detailed analysis of old vs new tax regime for FY 2025-26 with break-even salary analysis, optimal deduction scenarios, and a decision framework.",
    content: `The choice between old and new tax regime is one of the most important financial decisions for any Indian taxpayer. With the new regime becoming the default from FY 2023-24, many salaried employees unknowingly pay more tax by not opting out. This guide will help you decide.

**New Tax Regime — FY 2025-26 Slabs:**
| Income Slab | Tax Rate |
|---|---|
| 0 – 3,00,000 | NIL |
| 3,00,001 – 7,00,000 | 5% |
| 7,00,001 – 10,00,000 | 10% |
| 10,00,001 – 12,00,000 | 15% |
| 12,00,001 – 15,00,000 | 20% |
| Above 15,00,000 | 30% |

Rebate u/s 87A: Zero tax for income up to ₹7,00,000. Standard deduction: ₹75,000.

**Old Tax Regime Slabs (Below 60):**
- 0 – 2,50,000: NIL
- 2,50,001 – 5,00,000: 5% (rebate u/s 87A up to ₹12,500 for income ≤ ₹5L)
- 5,00,001 – 10,00,000: 20%
- Above 10,00,000: 30%
Plus: Standard deduction ₹50,000, 80C up to ₹1.5L, 80CCD(1B) ₹50K, 80D, HRA, etc.

**Break-even Analysis:**
The new regime wins when deductions are minimal. Typically, if your total deductions exceed ₹3.75 lakhs (for salary of ₹10L), the old regime saves tax. Our ITR Estimator tool calculates this precisely.

**When Old Regime is Better:**
- You have home loan interest (Section 24(b) — up to ₹2L)
- Significant 80C investments (₹1.5L max)
- HRA exemption in high-rent cities (Mumbai, Pune, Delhi)
- NPS contributions under 80CCD(1B) (₹50K)
- Medical insurance premium (80D)

**When New Regime is Better:**
- You have no major investments or loans
- Younger employees early in career
- Business owners preferring simplicity
- Income below ₹7L (zero tax under new regime)

**Important: Deadline to Switch**
Salaried employees can switch between regimes every year at the time of ITR filing. Business owners can switch only once. Declaration must be given to employer before April 1 for TDS purposes.`,
  },
  {
    slug: "gstr9-filing-guide",
    title: "GSTR-9 Annual Return: Step-by-Step Filing Guide",
    category: "GST",
    readTime: "10 min read",
    date: "March 28, 2026",
    excerpt: "Complete walkthrough of GSTR-9 annual return filing — what to check before filing, common mistakes, and how to handle FY 2024-25 reconciliation differences.",
    content: `GSTR-9 is the annual return that consolidates all monthly/quarterly GST transactions for the financial year. It is due by 31st December following the financial year. This guide covers the filing process step by step.

**Who Must File GSTR-9:**
All registered taxpayers with aggregate annual turnover above ₹2 crores must file GSTR-9. Composition dealers file GSTR-9A. GSTR-9C (reconciliation statement) is required if turnover exceeds ₹5 crores.

**Structure of GSTR-9:**
- Part I: Basic Details (GSTIN, legal name, FY)
- Part II: Summary of Outward Supplies (auto-populated from GSTR-1)
- Part III: ITC claimed (auto-populated from GSTR-3B)
- Part IV: Tax paid (as per GSTR-3B)
- Part V: Amendments — FY 2023-24 transactions reported in FY 2024-25
- Part VI: Other information (HSN summary, late fees, demands)

**Pre-Filing Checklist:**
1. Reconcile GSTR-1 vs GSTR-3B output tax (any difference must be explained)
2. Reconcile ITC as per GSTR-3B vs GSTR-2B (excess ITC must be reversed)
3. Check all credit notes and amendments are reflected
4. Verify HSN-wise summary matches your total supplies
5. Confirm tax payment challans match liability in GSTR-3B

**Common Mistakes in GSTR-9:**
- Reporting turnover different from GSTR-1 aggregate without explanation
- Incorrect ITC reversal amounts (should match GSTR-3B reversals)
- Missing Part V adjustments for prior year corrections
- HSN code summary errors causing mismatch
- Not including B2C (consumer) supplies in outward supply total

**Reconciling Differences:**
If GSTR-9 values differ from your GSTR-3B cumulative, you can:
- Pay additional tax through DRC-03 (voluntary payment)
- Claim ITC refund if excess paid (subject to Rule 92)
- Carry forward ITC adjustments to next year (limited by CGST Act)

**Penalties for Non-Filing:**
Late fee of ₹200/day (₹100 CGST + ₹100 SGST) subject to a maximum of 0.25% of annual turnover. For GSTR-9C, no late fee but penalty under Section 125 up to ₹25,000.`,
  },
  {
    slug: "forensic-accounting-guide",
    title: "Forensic Accounting: How to Detect Financial Fraud",
    category: "Forensic",
    readTime: "9 min read",
    date: "March 25, 2026",
    excerpt: "A professional overview of forensic accounting methodology — fraud red flags, investigation techniques, and how financial forensics is used in Indian legal proceedings.",
    content: `Forensic accounting sits at the intersection of accounting expertise and investigative methodology. As financial fraud becomes increasingly sophisticated in India, the demand for forensic accountants has grown dramatically — from corporate fraud investigations to insolvency proceedings to matrimonial disputes.

**What is Forensic Accounting?**
Forensic accounting is the application of accounting, auditing, and investigative skills to matters under legal scrutiny. The forensic accountant analyzes financial records to detect irregularities, quantify damages, and present findings in a form admissible in legal proceedings.

**Common Types of Financial Fraud in India:**
1. **Vendor Fraud:** Fictitious vendors, inflated invoices, kickback arrangements, duplicate payments
2. **Payroll Fraud:** Ghost employees, inflated salaries, false expense claims
3. **Financial Statement Fraud:** Revenue manipulation, expense suppression, asset inflation
4. **Asset Misappropriation:** Cash theft, inventory pilferage, unauthorized asset use
5. **Bank Fraud:** Circular transactions, money laundering, diversion of loan funds

**Red Flags to Watch:**
- Transactions with unusually round numbers (e.g., exactly ₹5,00,000)
- Multiple payments to same vendor on same day
- Payments to vendors without proper documentation
- Weekend or holiday transactions in non-service businesses
- Rapid growth in advance payments or loans to directors
- Unusually high cash transactions (possible Sec 269ST violations)
- Related party transactions at non-arm's length pricing

**Investigation Methodology:**
A systematic forensic investigation follows these steps:
1. **Engagement Scoping:** Define scope, access rights, confidentiality agreements
2. **Data Collection:** Preserve digital evidence, collect financial records, bank statements
3. **Transaction Analysis:** Using data analytics to identify anomalies and patterns
4. **Sampling:** Statistical and judgmental sampling of suspicious transactions
5. **Interview:** Structured interviews of relevant personnel
6. **Verification:** Cross-check with third-party records (bank, vendors, customers)
7. **Report:** Factual, evidence-based report suitable for legal use

**Digital Forensics Tools Used:**
IDEA (CaseWare), ACL Analytics, Power BI, and custom Excel macros can analyze thousands of transactions in minutes to find patterns invisible to manual review.

**Legal Framework in India:**
Forensic reports are used in: SEBI investigations, SFIO (Serious Fraud Investigation Office) cases, insolvency proceedings under IBC, criminal cases under IPC, and civil suits for damages.`,
  },
  {
    slug: "advance-tax-guide",
    title: "Advance Tax: Who Must Pay and How to Calculate",
    category: "Income Tax",
    readTime: "6 min read",
    date: "March 20, 2026",
    excerpt: "Complete guide to advance tax — who is liable, installment schedule, how to calculate each installment, and interest implications of non-payment under Section 234C.",
    content: `Advance tax is the mechanism by which the Government collects tax throughout the year rather than at the end. If your tax liability for the year exceeds ₹10,000 after TDS, you must pay advance tax in four installments.

**Who Must Pay Advance Tax:**
- All individuals with estimated tax liability > ₹10,000 after TDS
- Business owners and self-employed professionals
- Taxpayers with capital gains during the year
- Taxpayers with significant other income (rent, dividends, interest)

**Exemption:**
Senior citizens (60 years and above) who do not have income from business or profession are exempt from advance tax.

**Installment Schedule:**
| Installment | Due Date | Cumulative % |
|---|---|---|
| 1st | 15 June | 15% |
| 2nd | 15 September | 45% |
| 3rd | 15 December | 75% |
| 4th | 15 March | 100% |

**How to Calculate:**
Step 1: Estimate total income for the year (salary + business + other)
Step 2: Calculate tax on total income using applicable slabs
Step 3: Add 4% cess
Step 4: Deduct TDS already deducted
Step 5: Balance is advance tax liability
Step 6: Pay installments as per schedule above

**Section 234C — Interest for Default:**
If you fail to pay the required percentage by each due date, interest at 1% per month is charged for 3 months (1 month for 4th installment).

Example: If total tax liability is ₹1,00,000 and you paid nothing by 15 June, interest = ₹15,000 × 1% × 3 = ₹450 for that installment.

**Revised Estimates:**
Unlike TDS, advance tax can be based on estimates revised each quarter. If you realize in Q3 that your income will be higher, you can pay a larger 3rd installment to make up for earlier shortfalls.

**Payment Process:**
Pay via Challan 280 on the IT Department portal (incometax.gov.in). Select "Advance Tax" (code 100) under payment type. The payment is linked to your PAN automatically.`,
  },
];

const categoryColors: Record<string, string> = {
  GST: "bg-blue-100 text-blue-800",
  TDS: "bg-purple-100 text-purple-800",
  "Income Tax": "bg-green-100 text-green-800",
  Forensic: "bg-orange-100 text-orange-800",
};

export default function ResourcesPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-4">Resources</h1>
            <p className="text-blue-200 text-lg leading-relaxed">
              Free guides, reference charts, and practical articles on Indian taxation and finance.
            </p>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article key={article.slug} className="bg-white rounded-card shadow-card border border-gray-100 flex flex-col group hover:shadow-card-hover transition-shadow duration-200">
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${categoryColors[article.category] || "bg-gray-100 text-gray-700"}`}>
                      <Tag size={10} className="mr-1" />
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Clock size={11} />
                      {article.readTime}
                    </div>
                  </div>
                  <h2 className="font-bold text-dark text-lg leading-tight mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-muted text-sm leading-relaxed mb-4">{article.excerpt}</p>
                  <div className="text-xs text-muted">{article.date}</div>
                </div>
                <div className="px-6 pb-5 border-t border-gray-50 pt-4">
                  <Link
                    href={`/resources/${article.slug}`}
                    className="text-primary text-sm font-medium hover:text-primary-600 flex items-center gap-1 group/link"
                  >
                    Read Full Article <ArrowRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen size={20} className="text-gold" />
            <h2 className="text-xl font-bold text-dark">Need personalized advice?</h2>
          </div>
          <p className="text-muted mb-6">
            These articles provide general guidance. For your specific situation, get a personalized consultation.
          </p>
          <Link href="/contact" className="btn-primary gap-2">
            Schedule Consultation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
