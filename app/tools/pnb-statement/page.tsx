"use client";

import { useState, useCallback, useRef } from "react";
import {
  Landmark, ArrowLeft, Upload, Download, Shield,
  AlertCircle, CheckCircle, Tag, AlertTriangle, Info,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PNBTransaction {
  txnNo: string;
  date: string;
  description: string;
  branch: string;
  cheque: string;
  debit: number;
  credit: number;
  balance: number;          // absolute value
  balanceLabel: string;     // "Dr." | "Cr." | ""
  balanceMismatch: boolean; // running balance verification flag
  expectedBalance: number;  // computed expected balance
  category: string;
  ledger: string;
}

interface RawCell { text: string; x: number; y: number; }
type PNBColType = "txnno" | "date" | "desc" | "branch" | "cheque" | "debit" | "credit" | "balance" | "remarks" | "other";
interface ColDef { type: PNBColType; xLeft: number; xRight: number; }
type Step = "upload" | "processing" | "preview";

// ─── Classification (same rules as main tool) ─────────────────────────────────
const CLASSIFY_RULES: { kw: string[]; cat: string; led: string }[] = [
  { kw: ["gst", "igst", "cgst", "sgst", "tds", "income tax", "advance tax"],  cat: "Tax",        led: "GST / Tax Ledger" },
  { kw: ["salary", "payroll", "wages", "stipend"],                              cat: "Salary",     led: "Salary Ledger" },
  { kw: ["amazon", "flipkart", "purchase", "shop", "mart"],                    cat: "Purchase",   led: "Purchase Ledger" },
  { kw: ["rent", "lease", "property"],                                          cat: "Rent",       led: "Rent Ledger" },
  { kw: ["loan", "emi", "equated", "repayment", "mortgage"],                   cat: "Loan",       led: "Loan Ledger" },
  { kw: ["insurance", "lic", "premium", "policy"],                             cat: "Insurance",  led: "Insurance Ledger" },
  { kw: ["electricity", "water", "gas", "utility", "bill", "bescom", "msedcl", "mahadiscom", "tata power"], cat: "Utilities", led: "Utilities Ledger" },
  { kw: ["neft", "imps", "rtgs", "upi", "received", "receipt", "income", "dividend", "interest", "intt"], cat: "Income", led: "Sales / Income Ledger" },
  { kw: ["cash", "atm", "withdrawal"],                                          cat: "Cash",       led: "Cash Ledger" },
  { kw: ["refund", "reversal", "cashback"],                                     cat: "Refund",     led: "Creditors Ledger" },
  { kw: ["mutual fund", "mf", "sip", "equity", "share", "stock"],             cat: "Investment", led: "Investment Ledger" },
  { kw: ["travel", "hotel", "flight", "irctc"],                                cat: "Travel",     led: "Travel Expense Ledger" },
  { kw: ["labour", "labor", "electric", "spack", "automotives"],               cat: "Utilities",  led: "Utilities Ledger" },
];
function classify(desc: string) {
  const low = desc.toLowerCase();
  for (const r of CLASSIFY_RULES) if (r.kw.some(k => low.includes(k))) return { category: r.cat, ledger: r.led };
  return { category: "Uncategorized", ledger: "Suspense Ledger" };
}

// ─── Amount helpers ───────────────────────────────────────────────────────────
function cleanAmt(s: string): number {
  if (!s || s === "-" || s === "—") return 0;
  // Strip "Dr." / "Cr." suffixes common in PNB balance column
  const stripped = s.replace(/[DdCc][Rr]\.?\s*$/i, "").replace(/[,\s]/g, "");
  const n = parseFloat(stripped);
  return isNaN(n) ? 0 : Math.abs(n);
}

function extractBalanceLabel(s: string): "Dr." | "Cr." | "" {
  if (/Dr\.?\s*$/i.test(s)) return "Dr.";
  if (/Cr\.?\s*$/i.test(s)) return "Cr.";
  return "";
}

// ─── pdfjs helpers ────────────────────────────────────────────────────────────
function extractCells(content: { items: any[] }): RawCell[] {
  return content.items
    .filter((it: any) => it.str?.trim())
    .map((it: any) => ({
      text: it.str.trim(),
      x: Math.round(it.transform[4]),
      y: Math.round(it.transform[5]),
    }));
}

function groupByRow(cells: RawCell[], yTol = 5): RawCell[][] {
  const map = new Map<number, RawCell[]>();
  for (const c of cells) {
    let ky = -1;
    for (const k of map.keys()) if (Math.abs(k - c.y) <= yTol) { ky = k; break; }
    if (ky === -1) map.set(c.y, [c]);
    else map.get(ky)!.push(c);
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, cs]) => cs.sort((a, b) => a.x - b.x));
}

// ─── PNB column detection ─────────────────────────────────────────────────────
const PNB_COL_MAP: { type: PNBColType; words: string[] }[] = [
  { type: "txnno",   words: ["txn no", "txn no.", "transaction no", "sl no", "sr no", "sno", "#"] },
  { type: "date",    words: ["txn date", "transaction date", "value date", "date"] },
  { type: "desc",    words: ["description", "narration", "particulars", "transaction details", "details"] },
  { type: "branch",  words: ["branch name", "branch"] },
  { type: "cheque",  words: ["cheque no", "chq no", "cheque no.", "chq/ref"] },
  { type: "debit",   words: ["dr amount", "dr. amount", "dr amt", "withdrawal", "debit"] },
  { type: "credit",  words: ["cr amount", "cr. amount", "cr amt", "deposit", "credit"] },
  { type: "balance", words: ["balance", "closing balance", "running balance"] },
  { type: "remarks", words: ["kims", "remarks", "narration remarks"] },
];

const HDR_WORDS = ["txn", "date", "description", "dr", "cr", "balance", "amount", "cheque", "narration", "particulars"];
function isHdr(row: RawCell[]): boolean {
  const hits = HDR_WORDS.filter(w => row.some(c => c.text.toLowerCase().includes(w))).length;
  return hits >= 3;
}

function colType(text: string): PNBColType {
  const low = text.toLowerCase();
  for (const { type, words } of PNB_COL_MAP) if (words.some(w => low.includes(w))) return type;
  return "other";
}

function buildColDefs(hdr: RawCell[]): ColDef[] {
  const s = [...hdr].sort((a, b) => a.x - b.x);
  return s.map((c, i) => ({
    type: colType(c.text),
    xLeft:  i === 0          ? 0    : Math.round((s[i - 1].x + c.x) / 2),
    xRight: i === s.length-1 ? 9999 : Math.round((c.x + s[i + 1].x) / 2),
  }));
}

function assign(cells: RawCell[], defs: ColDef[]): Map<PNBColType, string> {
  const out = new Map<PNBColType, string>();
  for (const c of cells) {
    const def = defs.find(d => c.x >= d.xLeft && c.x <= d.xRight)
      ?? defs.reduce((b, d) => {
        const dc = Math.abs(c.x - (d.xLeft + d.xRight) / 2);
        const db = Math.abs(c.x - (b.xLeft + b.xRight) / 2);
        return dc < db ? d : b;
      });
    out.set(def.type, ((out.get(def.type) ?? "") + " " + c.text).trim());
  }
  return out;
}

// ─── Date & TxnNo patterns ────────────────────────────────────────────────────
const DATE_RE = /\b(\d{2}[\/\-]\d{2}[\/\-]\d{2,4}|\d{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{2,4})\b/i;
const TXN_NO_RE = /^T\d{5,}/i;

// ─── Main PNB parser ──────────────────────────────────────────────────────────
function parsePNBStatement(allPageRows: RawCell[][][]): PNBTransaction[] {
  // Find header row
  let defs: ColDef[] | null = null;
  let hpi = -1, hri = -1;
  outer: for (let pi = 0; pi < allPageRows.length; pi++) {
    for (let ri = 0; ri < allPageRows[pi].length; ri++) {
      if (isHdr(allPageRows[pi][ri])) {
        defs = buildColDefs(allPageRows[pi][ri]);
        hpi = pi; hri = ri;
        break outer;
      }
    }
  }
  if (!defs) return [];

  const dateDef = defs.find(d => d.type === "date");
  const txnDef  = defs.find(d => d.type === "txnno");

  // Collect all data rows after header
  const dataRows: RawCell[][] = [];
  for (let pi = 0; pi < allPageRows.length; pi++) {
    const startRi = pi === hpi ? hri + 1 : 0;
    for (let ri = startRi; ri < allPageRows[pi].length; ri++) {
      const row = allPageRows[pi][ri];
      if (isHdr(row)) continue; // skip repeated headers on new pages
      dataRows.push(row);
    }
  }

  // ── Identify transaction boundaries ──────────────────────────────────────
  // A new transaction starts if:
  //  (a) the Txn No column has a T-prefixed number, OR
  //  (b) the date column has a valid date (fallback for PDFs without txn numbers)
  function isNewTxnRow(row: RawCell[]): boolean {
    // Check Txn No column first
    if (txnDef) {
      const txnCell = row.find(c => c.x >= txnDef.xLeft && c.x <= txnDef.xRight);
      if (txnCell && TXN_NO_RE.test(txnCell.text)) return true;
    }
    // Fallback: date in date column
    if (dateDef) {
      const dateCell = row.find(c => c.x >= dateDef.xLeft && c.x <= dateDef.xRight);
      if (dateCell && DATE_RE.test(dateCell.text)) return true;
    }
    return false;
  }

  // ── Merge multi-line description rows ─────────────────────────────────────
  // PNB descriptions span 4-6 PDF lines. Only the first line has Txn No + Date + Amounts.
  // Continuation lines have description text only.
  const txnGroups: RawCell[][] = [];
  let cur: RawCell[] | null = null;

  for (const row of dataRows) {
    if (isNewTxnRow(row)) {
      if (cur) txnGroups.push(cur);
      cur = [...row];
    } else if (cur) {
      // Continuation row: only merge description-type cells
      const descCells = row.filter(c => {
        const def = defs!.find(d => c.x >= d.xLeft && c.x <= d.xRight);
        return !def || def.type === "desc" || def.type === "other";
      });
      cur.push(...(descCells.length ? descCells : row));
    }
  }
  if (cur) txnGroups.push(cur);

  // ── Parse each transaction group ─────────────────────────────────────────
  const rawTxns: Omit<PNBTransaction, "balanceMismatch" | "expectedBalance">[] = [];

  for (const cells of txnGroups) {
    const cols = assign(cells, defs);

    // Extract date
    const dateRaw = cols.get("date") ?? cells.find(c => DATE_RE.test(c.text))?.text ?? "";
    const dm = dateRaw.match(DATE_RE);
    if (!dm) continue;

    const txnNo  = (cols.get("txnno") ?? "").replace(/\s+/g, "");
    const desc   = cols.get("desc") ?? "—";
    const branch = cols.get("branch") ?? "";
    const cheque = cols.get("cheque") ?? txnNo; // use txn no as ref if no cheque
    const drRaw  = cols.get("debit")   ?? "";
    const crRaw  = cols.get("credit")  ?? "";
    const balRaw = cols.get("balance") ?? "";

    const debit   = cleanAmt(drRaw);
    const credit  = cleanAmt(crRaw);
    const balance = cleanAmt(balRaw);
    const balanceLabel = extractBalanceLabel(balRaw);

    if (debit === 0 && credit === 0 && balance === 0) continue;
    if (!desc || desc === "—") continue;

    const { category, ledger } = classify(desc);
    rawTxns.push({ txnNo, date: dm[0], description: desc, branch, cheque, debit, credit, balance, balanceLabel, category, ledger });
  }

  // ── Running balance verification ──────────────────────────────────────────
  // PNB balance shown as Dr. means the account has a Dr. (debit) running balance.
  // Rule: balance_n = balance_{n-1} + Dr_n - Cr_n  (for a Dr. balance / overdraft account)
  // We try to detect the direction automatically from first two transactions.
  const txns: PNBTransaction[] = rawTxns.map((t, i) => {
    if (i === 0) return { ...t, balanceMismatch: false, expectedBalance: t.balance };

    const prev = rawTxns[i - 1];
    // Try both directions
    const expectedDr = prev.balance + t.debit - t.credit; // Dr balance direction
    const expectedCr = prev.balance - t.debit + t.credit; // Cr balance direction
    const expected = Math.abs(expectedDr - t.balance) < Math.abs(expectedCr - t.balance)
      ? expectedDr : expectedCr;
    const mismatch = Math.abs(expected - t.balance) > 1.0; // tolerance ₹1

    return { ...t, balanceMismatch: mismatch, expectedBalance: Math.round(expected * 100) / 100 };
  });

  return txns;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PNBStatementPage() {
  const [step, setStep]           = useState<Step>("upload");
  const [file, setFile]           = useState<File | null>(null);
  const [transactions, setTxns]   = useState<PNBTransaction[]>([]);
  const [error, setError]         = useState("");
  const [progress, setProgress]   = useState("");
  const [editCell, setEditCell]   = useState<{ row: number; col: keyof PNBTransaction } | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef                  = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async () => {
    if (!file) return;
    setStep("processing"); setError(""); setProgress("Loading PDF…");
    try {
      // @ts-ignore
      const pdfjs = await import("pdfjs-dist/webpack.mjs");
      const buf   = await file.arrayBuffer();
      const pdf   = await pdfjs.getDocument({
        data: new Uint8Array(buf),
        isEvalSupported: false, useSystemFonts: true,
        disableRange: true, disableStream: true, disableAutoFetch: true,
      }).promise;

      const allPageRows: RawCell[][][] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Extracting page ${i} of ${pdf.numPages}…`);
        const page    = await pdf.getPage(i);
        const content = await page.getTextContent();
        allPageRows.push(groupByRow(extractCells(content)));
      }

      setProgress("Parsing PNB transactions…");
      const txns = parsePNBStatement(allPageRows);

      if (txns.length === 0) {
        setError("No transactions found. Make sure this is a PNB text-based (not scanned) PDF statement.");
        setStep("upload"); return;
      }
      setTxns(txns); setStep("preview");
    } catch (e: any) {
      setError("Error: " + (e?.message || String(e))); setStep("upload");
    }
  }, [file]);

  const updateCell = (row: number, col: keyof PNBTransaction, val: string) => {
    const updated = [...transactions];
    if (["debit", "credit", "balance"].includes(col)) (updated[row] as any)[col] = parseFloat(val) || 0;
    else {
      (updated[row] as any)[col] = val;
      if (col === "description") {
        const { category, ledger } = classify(val);
        updated[row].category = category; updated[row].ledger = ledger;
      }
    }
    setTxns(updated); setEditCell(null);
  };

  const downloadExcel = useCallback(async () => {
    const XLSX = await import("xlsx");

    // ── Sheet 1: Transactions ─────────────────────────────────────────────
    const hdrs = ["#", "Date", "Txn No.", "Description", "Branch", "Cheque/Ref", "Debit (₹)", "Credit (₹)", "Balance (₹)", "Balance Type", "Category", "Ledger", "Balance Check"];
    const rows = transactions.map((t, i) => [
      i + 1, t.date, t.txnNo, t.description, t.branch, t.cheque,
      t.debit || "", t.credit || "", t.balance || "", t.balanceLabel,
      t.category, t.ledger,
      t.balanceMismatch ? `⚠ Expected ${fmt(t.expectedBalance)}` : "✓ OK",
    ]);

    const ws = XLSX.utils.aoa_to_sheet([hdrs, ...rows]);

    // Header style
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r: 0, c });
      if (ws[addr]) ws[addr].s = { fill: { fgColor: { rgb: "154360" } }, font: { color: { rgb: "FFFFFF" }, bold: true } };
    }

    // Row color coding: Dr rows red-tint, Cr rows green-tint, mismatch amber
    const CAT_CLR: Record<string, string> = {
      Tax: "FFF3CD", Salary: "D4EDDA", Purchase: "F8D7DA", Income: "D1ECF1",
      Rent: "E2D9F3", Utilities: "FDEBD0", Loan: "FCE4EC", Insurance: "E8F4FD",
      Cash: "F5F5F5", Travel: "E8F8E8", Investment: "EAF4FB", Refund: "FFFDE7",
    };
    for (let r = 1; r <= rows.length; r++) {
      const t = transactions[r - 1];
      const bg = t.balanceMismatch ? "FFF3CD" : (CAT_CLR[t.category] || (r % 2 === 0 ? "EBF3FB" : "FFFFFF"));
      for (let c = range.s.c; c <= range.e.c; c++) {
        const a = XLSX.utils.encode_cell({ r, c });
        if (!ws[a]) ws[a] = { t: "z" };
        ws[a].s = { fill: { fgColor: { rgb: bg } } };
      }
    }
    ws["!cols"] = [{ wch: 4 }, { wch: 13 }, { wch: 12 }, { wch: 55 }, { wch: 15 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 10 }, { wch: 16 }, { wch: 24 }, { wch: 22 }];

    // ── Sheet 2: Monthly Summary ──────────────────────────────────────────
    const monthly = new Map<string, { debit: number; credit: number; count: number }>();
    for (const t of transactions) {
      // Parse month from date (handles DD-MM-YYYY, DD/MM/YYYY, DD Mon YYYY)
      let mo = "Unknown";
      const mMatch = t.date.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{2,4})/);
      if (mMatch) {
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        mo = `${months[parseInt(mMatch[2]) - 1] ?? mMatch[2]}-${mMatch[3].length === 2 ? "20" + mMatch[3] : mMatch[3]}`;
      }
      const prev = monthly.get(mo) ?? { debit: 0, credit: 0, count: 0 };
      monthly.set(mo, { debit: prev.debit + t.debit, credit: prev.credit + t.credit, count: prev.count + 1 });
    }
    const mRows: any[][] = [["Month", "Transactions", "Total Debit (₹)", "Total Credit (₹)", "Net (₹)"]];
    for (const [mo, { debit, credit, count }] of monthly) {
      mRows.push([mo, count, debit, credit, credit - debit]);
    }
    const totalDr = transactions.reduce((s, t) => s + t.debit, 0);
    const totalCr = transactions.reduce((s, t) => s + t.credit, 0);
    mRows.push(["", "", "", "", ""], ["TOTAL", transactions.length, totalDr, totalCr, totalCr - totalDr]);

    const ws2 = XLSX.utils.aoa_to_sheet(mRows);
    ws2["!cols"] = [{ wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 16 }];

    // ── Sheet 3: Balance Check ────────────────────────────────────────────
    const mismatches = transactions.filter(t => t.balanceMismatch);
    const bRows: any[][] = [["#", "Date", "Txn No.", "Description", "Debit", "Credit", "Book Balance", "Expected Balance", "Difference"]];
    for (const t of mismatches) {
      const diff = Math.abs(t.balance - t.expectedBalance);
      bRows.push([transactions.indexOf(t) + 1, t.date, t.txnNo, t.description, t.debit, t.credit, t.balance, t.expectedBalance, diff]);
    }
    if (mismatches.length === 0) bRows.push(["", "✓ All running balances verified — no mismatches found", "", "", "", "", "", "", ""]);
    const ws3 = XLSX.utils.aoa_to_sheet(bRows);
    ws3["!cols"] = [{ wch: 4 }, { wch: 13 }, { wch: 12 }, { wch: 50 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 14 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws,  "Transactions");
    XLSX.utils.book_append_sheet(wb, ws2, "Monthly Summary");
    XLSX.utils.book_append_sheet(wb, ws3, "Balance Check");
    XLSX.writeFile(wb, `PNB_${(file?.name || "statement").replace(".pdf", "")}.xlsx`);
  }, [transactions, file]);

  const fmt = (n: number) => n ? new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(n) : "—";

  const BADGE: Record<string, string> = {
    Tax: "bg-yellow-100 text-yellow-800", Salary: "bg-green-100 text-green-800",
    Purchase: "bg-red-100 text-red-800", Income: "bg-cyan-100 text-cyan-800",
    Rent: "bg-purple-100 text-purple-800", Utilities: "bg-orange-100 text-orange-800",
    Loan: "bg-pink-100 text-pink-800", Insurance: "bg-blue-100 text-blue-800",
    Cash: "bg-gray-100 text-gray-700", Travel: "bg-emerald-100 text-emerald-800",
    Investment: "bg-sky-100 text-sky-800", Refund: "bg-lime-100 text-lime-800",
    Uncategorized: "bg-gray-100 text-gray-400",
  };

  const totalDebit   = transactions.reduce((s, t) => s + t.debit, 0);
  const totalCredit  = transactions.reduce((s, t) => s + t.credit, 0);
  const mismatchCount = transactions.filter(t => t.balanceMismatch).length;
  const closingBal   = transactions[transactions.length - 1];

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted hover:text-dark mb-6">
          <ArrowLeft size={15} /> Back to Tools
        </Link>

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
            <Landmark className="text-primary" size={22} />
            PNB Statement to Excel
          </h1>
          <p className="text-muted text-sm mt-1">
            Purpose-built for Punjab National Bank PDF statements — handles Dr/Cr columns, multi-line narrations, and running balance verification.
          </p>
        </div>

        {/* Privacy + format note */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 font-medium flex-1">
            <Shield size={15} className="text-green-600 flex-shrink-0" />
            100% browser-based — your financial data never leaves your device.
          </div>
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex-1">
            <Info size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <span>Expected columns: <strong>Txn No · Txn Date · Description · Branch · Cheque No · Dr Amount · Cr Amount · Balance (Dr./Cr.)</strong></span>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-6">
          {(["upload", "processing", "preview"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s ? "bg-primary text-white" :
                (step === "preview" && i < 2) || (step === "processing" && i < 1) ? "bg-green-500 text-white" : "bg-gray-200 text-muted"
              }`}>
                {(step === "preview" && i < 2) || (step === "processing" && i < 1) ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-sm ${step === s ? "font-semibold text-dark" : "text-muted"}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
              {i < 2 && <div className="w-8 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Upload */}
        {step === "upload" && (
          <div className="bg-white rounded-card shadow-card border border-gray-100 p-6">
            <div
              className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center hover:border-primary/50 transition-colors cursor-pointer mb-5"
              onClick={() => inputRef.current?.click()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
              onDragOver={e => e.preventDefault()}
            >
              <input ref={inputRef} type="file" accept=".pdf" className="hidden"
                onChange={e => setFile(e.target.files?.[0] || null)} />
              {file ? (
                <div>
                  <Landmark size={40} className="mx-auto text-primary mb-3" />
                  <p className="font-medium text-dark">{file.name}</p>
                  <p className="text-muted text-sm">{(file.size / 1024).toFixed(1)} KB · PNB Statement</p>
                </div>
              ) : (
                <div>
                  <Upload size={40} className="mx-auto text-muted mb-3" />
                  <p className="font-medium text-dark mb-1">Upload PNB PDF Statement</p>
                  <p className="text-muted text-sm">Punjab National Bank · Dr/Cr column format · OpTransactionHistory</p>
                  <p className="text-xs text-muted mt-2">Handles multi-line narrations · Running balance verified automatically</p>
                </div>
              )}
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />{error}
              </div>
            )}
            <button onClick={processFile} disabled={!file}
              className="btn-primary gap-2 w-full justify-center py-3.5 disabled:opacity-50">
              Extract &amp; Verify Transactions
            </button>
          </div>
        )}

        {/* Processing */}
        {step === "processing" && (
          <div className="bg-white rounded-card shadow-card border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-semibold text-dark mb-2">Processing PNB Statement…</p>
            <p className="text-muted text-sm">{progress}</p>
            <p className="text-xs text-muted mt-3">Merging multi-line descriptions &amp; verifying balances</p>
          </div>
        )}

        {/* Preview */}
        {step === "preview" && (
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <p className="font-semibold text-dark">{transactions.length} transactions extracted &amp; verified</p>
                <p className="text-xs text-muted">Click any cell to edit · Excel includes Monthly Summary + Balance Check sheets</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setStep("upload"); setFile(null); setTxns([]); }} className="btn-outline text-sm">Start Over</button>
                <button onClick={downloadExcel} className="btn-primary gap-2 text-sm">
                  <Download size={15} /> Download Excel
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-card shadow-card border border-gray-100 p-3 text-center">
                <div className="text-xs text-muted mb-1">Total Debits</div>
                <div className="font-bold text-sm text-red-600">₹{fmt(totalDebit)}</div>
              </div>
              <div className="bg-white rounded-card shadow-card border border-gray-100 p-3 text-center">
                <div className="text-xs text-muted mb-1">Total Credits</div>
                <div className="font-bold text-sm text-green-600">₹{fmt(totalCredit)}</div>
              </div>
              <div className="bg-white rounded-card shadow-card border border-gray-100 p-3 text-center">
                <div className="text-xs text-muted mb-1">Net Flow</div>
                <div className={`font-bold text-sm ${totalCredit - totalDebit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{fmt(Math.abs(totalCredit - totalDebit))}
                </div>
              </div>
              <div className={`rounded-card shadow-card border p-3 text-center ${mismatchCount > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100"}`}>
                <div className="text-xs text-muted mb-1">Balance Check</div>
                {mismatchCount > 0 ? (
                  <div className="font-bold text-sm text-amber-700 flex items-center justify-center gap-1">
                    <AlertTriangle size={13} /> {mismatchCount} mismatch{mismatchCount > 1 ? "es" : ""}
                  </div>
                ) : (
                  <div className="font-bold text-sm text-green-600 flex items-center justify-center gap-1">
                    <CheckCircle size={13} /> All OK
                  </div>
                )}
              </div>
            </div>

            {/* Closing balance */}
            {closingBal && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5 mb-4 flex items-center gap-3 text-sm">
                <span className="text-muted">Closing Balance:</span>
                <span className="font-bold text-dark">₹{fmt(closingBal.balance)}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${closingBal.balanceLabel === "Dr." ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {closingBal.balanceLabel || "—"}
                </span>
              </div>
            )}

            {/* Category legend */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Array.from(new Set(transactions.map(t => t.category))).map(cat => (
                <span key={cat} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${BADGE[cat] || "bg-gray-100 text-gray-400"}`}>
                  <Tag size={9} />{cat}
                </span>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-card shadow-card border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto max-h-[520px]">
                <table className="w-full text-xs">
                  <thead className="sticky top-0">
                    <tr className="bg-primary text-white">
                      {["#", "Date", "Txn No.", "Description", "Dr Amount (₹)", "Cr Amount (₹)", "Balance (₹)", "Type", "Bal ✓", "Category", "Ledger"].map(h => (
                        <th key={h} className="text-left py-2.5 px-3 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t, i) => (
                      <tr key={i} className={
                        t.balanceMismatch ? "bg-amber-50" :
                        i % 2 === 0 ? "bg-white" : "bg-background"
                      }>
                        <td className="py-2 px-3 text-muted">{i + 1}</td>
                        {(["date", "txnNo", "description", "debit", "credit", "balance"] as (keyof PNBTransaction)[]).map(col => (
                          <td key={col}
                            className={`py-2 px-3 cursor-pointer hover:bg-yellow-50 transition-colors max-w-[200px] ${
                              col === "debit"   && t.debit  ? "text-red-600 font-medium text-right" :
                              col === "credit"  && t.credit ? "text-green-600 font-medium text-right" :
                              col === "balance" ? "text-right font-medium text-dark" : ""
                            }`}
                            onClick={() => { setEditCell({ row: i, col }); setEditValue(String((t as any)[col])); }}
                          >
                            {editCell?.row === i && editCell.col === col ? (
                              <input autoFocus
                                className="w-full border border-primary rounded px-1 py-0.5 text-xs min-w-[70px]"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onBlur={() => updateCell(i, col, editValue)}
                                onKeyDown={e => e.key === "Enter" && updateCell(i, col, editValue)}
                              />
                            ) : col === "description" ? (
                              <span className="block truncate max-w-[200px]" title={(t as any)[col]}>{(t as any)[col]}</span>
                            ) : (
                              typeof (t as any)[col] === "number" && (t as any)[col] !== 0
                                ? fmt((t as any)[col])
                                : (t as any)[col] || "—"
                            )}
                          </td>
                        ))}
                        {/* Balance type */}
                        <td className="py-2 px-3">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.balanceLabel === "Dr." ? "bg-red-100 text-red-700" : t.balanceLabel === "Cr." ? "bg-green-100 text-green-700" : "text-muted"}`}>
                            {t.balanceLabel || "—"}
                          </span>
                        </td>
                        {/* Balance mismatch flag */}
                        <td className="py-2 px-3 text-center">
                          {t.balanceMismatch ? (
                            <span title={`Expected ₹${fmt(t.expectedBalance)}`}>
                              <AlertTriangle size={13} className="text-amber-500 mx-auto" />
                            </span>
                          ) : (
                            <CheckCircle size={13} className="text-green-500 mx-auto" />
                          )}
                        </td>
                        {/* Category */}
                        <td className="py-2 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${BADGE[t.category] || "bg-gray-100 text-gray-400"}`}>
                            <Tag size={9} />{t.category}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-muted truncate max-w-[120px]">{t.ledger}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mismatch callout */}
            {mismatchCount > 0 && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
                <AlertTriangle size={13} className="mt-0.5 flex-shrink-0 text-amber-600" />
                <span>
                  <strong>{mismatchCount} balance mismatch{mismatchCount > 1 ? "es" : ""} detected</strong> — highlighted in amber.
                  These may indicate multi-page PDF gaps, missing rows, or opening balance differences.
                  The <strong>Balance Check</strong> sheet in the Excel download lists all flagged rows.
                </span>
              </div>
            )}
          </div>
        )}

        <p className="tool-disclaimer mt-6">
          Results are indicative only. Always verify with original bank records. Associate Piyush is not liable for any decisions made based on tool outputs. © 2026 Associate Piyush, Pune.
        </p>
      </div>
    </div>
  );
}
