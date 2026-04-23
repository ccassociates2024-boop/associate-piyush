"use client";

import { useState, useCallback, useRef } from "react";
import { Database, ArrowLeft, Upload, Download, Shield, AlertCircle, CheckCircle, Tag } from "lucide-react";
import Link from "next/link";

interface Transaction {
  date: string;
  description: string;
  cheque: string;
  debit: number;
  credit: number;
  balance: number;
  category: string;
  ledger: string;
}

type Step = "upload" | "processing" | "preview";

// ─── Classification Rules ────────────────────────────────────────────────────
const CLASSIFY_RULES: { keywords: string[]; category: string; ledger: string }[] = [
  { keywords: ["gst", "igst", "cgst", "sgst", "tax", "tds", "income tax", "advance tax"], category: "Tax", ledger: "GST / Tax Ledger" },
  { keywords: ["salary", "payroll", "wages", "remuneration", "stipend"], category: "Salary", ledger: "Salary Ledger" },
  { keywords: ["amazon", "flipkart", "myntra", "swiggy", "zomato", "purchase", "shop", "mart", "store"], category: "Purchase", ledger: "Purchase Ledger" },
  { keywords: ["rent", "lease", "property"], category: "Rent", ledger: "Rent Ledger" },
  { keywords: ["loan", "emi", "equated", "repayment", "mortgage"], category: "Loan", ledger: "Loan Ledger" },
  { keywords: ["insurance", "lic", "premium", "policy"], category: "Insurance", ledger: "Insurance Ledger" },
  { keywords: ["electricity", "water", "gas", "utility", "bill", "bescom", "mahadiscom", "msedcl", "tata power"], category: "Utilities", ledger: "Utilities Ledger" },
  { keywords: ["neft", "imps", "rtgs", "upi", "transfer", "received", "receipt", "income", "dividend", "interest"], category: "Income", ledger: "Sales / Income Ledger" },
  { keywords: ["cash", "atm", "withdrawal"], category: "Cash", ledger: "Cash Ledger" },
  { keywords: ["refund", "reversal", "cashback"], category: "Refund", ledger: "Creditors Ledger" },
  { keywords: ["investment", "mutual fund", "mf", "sip", "equity", "share", "stock"], category: "Investment", ledger: "Investment Ledger" },
  { keywords: ["travel", "hotel", "flight", "irctc", "makemytrip", "oyo"], category: "Travel", ledger: "Travel Expense Ledger" },
];

function classifyTransaction(desc: string): { category: string; ledger: string } {
  const lower = desc.toLowerCase();
  for (const rule of CLASSIFY_RULES) {
    if (rule.keywords.some(k => lower.includes(k))) {
      return { category: rule.category, ledger: rule.ledger };
    }
  }
  return { category: "Uncategorized", ledger: "Suspense Ledger" };
}

// ─── Amount helpers ───────────────────────────────────────────────────────────
function cleanAmt(s: string): number {
  return parseFloat(s.replace(/[,\s]/g, "")) || 0;
}

function parseSigned(s: string): { debit: number; credit: number } {
  const n = cleanAmt(s);
  if (n < 0) return { debit: Math.abs(n), credit: 0 };
  if (n > 0) return { debit: 0, credit: n };
  return { debit: 0, credit: 0 };
}

// ─── pdfjs text items → structured rows ──────────────────────────────────────
interface TextItem { str: string; transform: number[] }

function groupItemsIntoRows(items: TextItem[]): string[][] {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => {
    const dy = Math.round(b.transform[5]) - Math.round(a.transform[5]);
    if (dy !== 0) return dy;
    return a.transform[4] - b.transform[4];
  });

  const rows: { y: number; items: TextItem[] }[] = [];
  for (const item of sorted) {
    if (!item.str.trim()) continue;
    const y = Math.round(item.transform[5]);
    const row = rows.find(r => Math.abs(r.y - y) <= 4);
    if (row) row.items.push(item);
    else rows.push({ y, items: [item] });
  }

  return rows.map(r => r.items.sort((a, b) => a.transform[4] - b.transform[4]).map(i => i.str.trim()));
}

// ─── Main parser ──────────────────────────────────────────────────────────────
const DATE_RE = /^\d{2}[\/\-]\d{2}[\/\-]\d{2,4}$|^\d{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{2,4}$/i;
const AMT_RE = /^-?[\d,]+\.\d{2}$/;
const HEADER_WORDS = ["date", "narration", "particulars", "description", "debit", "credit", "balance", "withdrawal", "deposit", "amount", "cheque", "chq", "ref", "value"];

function isHeaderRow(cells: string[]): boolean {
  const lower = cells.map(c => c.toLowerCase());
  return HEADER_WORDS.filter(w => lower.some(c => c.includes(w))).length >= 3;
}

function parseRows(allRows: string[][]): Transaction[] {
  const txns: Transaction[] = [];

  // Detect column layout from first header row found
  let dateCol = -1, descCol = -1, chequeCol = -1;
  let debitCol = -1, creditCol = -1, balCol = -1, amtCol = -1, typeCol = -1;

  const findHeader = (cells: string[], keywords: string[]) => {
    const lower = cells.map(c => c.toLowerCase());
    for (const kw of keywords) {
      const idx = lower.findIndex(c => c.includes(kw));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  let headerFound = false;

  for (const row of allRows) {
    if (!headerFound && isHeaderRow(row)) {
      dateCol   = findHeader(row, ["txn date", "date", "value dt"]);
      descCol   = findHeader(row, ["narration", "particulars", "description", "details"]);
      chequeCol = findHeader(row, ["chq no", "cheque", "chq", "ref no"]);
      debitCol  = findHeader(row, ["withdrawal", "debit", "dr"]);
      creditCol = findHeader(row, ["deposit", "credit", "cr"]);
      balCol    = findHeader(row, ["balance", "closing"]);
      amtCol    = findHeader(row, ["amount", "net amount", "net amt", "txn amount", "tran amount"]);
      typeCol   = findHeader(row, ["dr/cr", "cr/dr", "type", "txn type", "d/c"]);
      headerFound = true;
      continue;
    }

    if (!headerFound) continue;

    // Skip sub-header rows
    if (isHeaderRow(row)) continue;

    // Identify date cell (fixed col or scan)
    let dateVal = "";
    if (dateCol >= 0 && row[dateCol] && DATE_RE.test(row[dateCol].trim())) {
      dateVal = row[dateCol].trim();
    } else {
      const found = row.find(c => DATE_RE.test(c.trim()));
      if (found) dateVal = found.trim();
    }
    if (!dateVal) continue;

    const getCell = (idx: number) => (idx >= 0 && idx < row.length ? row[idx]?.trim() || "" : "");

    const desc   = getCell(descCol !== -1 ? descCol : 1) || "—";
    const cheque = getCell(chequeCol);
    const balStr = getCell(balCol);
    const balance = cleanAmt(balStr);

    let debit = 0, credit = 0;

    // Format A: Amount + Dr/Cr type column
    if (amtCol !== -1 && typeCol !== -1) {
      const mag = cleanAmt(getCell(amtCol));
      const typ = getCell(typeCol).toLowerCase();
      if (typ.startsWith("d") || typ.includes("dr")) debit = mag;
      else credit = mag;
    }
    // Format B: Signed single amount (negative=Debit, positive=Credit)
    else if (amtCol !== -1) {
      const parsed = parseSigned(getCell(amtCol));
      debit  = parsed.debit;
      credit = parsed.credit;
    }
    // Format C: Separate Debit / Credit columns
    else if (debitCol !== -1 || creditCol !== -1) {
      debit  = cleanAmt(getCell(debitCol));
      credit = cleanAmt(getCell(creditCol));
    }
    // Format D: Scan all cells for amounts
    else {
      const amts = row.map((c, idx) => ({ idx, val: c, n: cleanAmt(c) }))
        .filter(x => AMT_RE.test(x.val.replace(/,/g, "")) || AMT_RE.test(x.val));

      if (amts.length >= 3) {
        // Try negative-signed approach first
        const signedCell = amts.find(a => a.val.startsWith("-"));
        if (signedCell) {
          const parsed = parseSigned(signedCell.val);
          debit  = parsed.debit;
          credit = parsed.credit;
        } else {
          debit  = amts[0].n;
          credit = amts[1].n;
        }
      } else if (amts.length === 2) {
        const signed = amts.find(a => a.val.startsWith("-"));
        if (signed) {
          debit  = Math.abs(signed.n);
          credit = 0;
        } else {
          const lineUp = row.join(" ").toUpperCase();
          if (lineUp.includes("CR") || lineUp.includes("CREDIT")) credit = amts[0].n;
          else debit = amts[0].n;
        }
      } else if (amts.length === 1) {
        const signed = parseSigned(amts[0].val);
        debit  = signed.debit;
        credit = signed.credit;
      }
    }

    const { category, ledger } = classifyTransaction(desc);

    txns.push({ date: dateVal, description: desc, cheque, debit, credit, balance, category, ledger });
  }

  return txns;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BankStatementPage() {
  const [step, setStep]               = useState<Step>("upload");
  const [file, setFile]               = useState<File | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError]             = useState("");
  const [progress, setProgress]       = useState("");
  const [editCell, setEditCell]       = useState<{ row: number; col: keyof Transaction } | null>(null);
  const [editValue, setEditValue]     = useState("");
  const inputRef                      = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async () => {
    if (!file) return;
    setStep("processing");
    setError("");
    setProgress("Loading PDF...");

    try {
      let allRows: string[][] = [];

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setProgress("Extracting text from PDF...");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const pdfjs = await import("pdfjs-dist/webpack.mjs");

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({
          data: new Uint8Array(arrayBuffer),
          isEvalSupported: false,
          useSystemFonts: true,
          disableRange: true,
          disableStream: true,
          disableAutoFetch: true,
        }).promise;

        let plainText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          setProgress(`Extracting page ${i} of ${pdf.numPages}...`);
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const items = content.items as TextItem[];
          const pageRows = groupItemsIntoRows(items);
          allRows.push(...pageRows);
          plainText += items.map((it: TextItem) => it.str).join(" ") + "\n";
        }

        // If very little text found → try OCR
        if (plainText.replace(/\s/g, "").length < 100) {
          setProgress("PDF appears scanned. Running OCR...");
          const Tesseract = await import("tesseract.js");
          const worker = await Tesseract.createWorker("eng");
          const url = URL.createObjectURL(file);
          const { data: { text: ocrText } } = await worker.recognize(url);
          await worker.terminate();
          URL.revokeObjectURL(url);
          // Convert OCR plain text → pseudo-rows
          allRows = ocrText.split("\n").map(l => l.split(/\s{2,}/).map(c => c.trim()).filter(Boolean));
        }
      }

      setProgress("Parsing transactions...");
      const txns = parseRows(allRows);

      if (txns.length === 0) {
        setError("No transactions detected. The PDF format may not be supported. Try a text-based (not scanned) bank statement PDF.");
        setStep("upload");
        return;
      }

      setTransactions(txns);
      setStep("preview");
    } catch (e: any) {
      console.error("Bank statement error:", e);
      setError("Error processing file: " + (e?.message || String(e)));
      setStep("upload");
    }
  }, [file]);

  const updateCell = (row: number, col: keyof Transaction, val: string) => {
    const updated = [...transactions];
    const numCols: (keyof Transaction)[] = ["debit", "credit", "balance"];
    if (numCols.includes(col)) {
      (updated[row] as any)[col] = parseFloat(val) || 0;
    } else {
      (updated[row] as any)[col] = val;
      if (col === "description") {
        const { category, ledger } = classifyTransaction(val);
        updated[row].category = category;
        updated[row].ledger   = ledger;
      }
    }
    setTransactions(updated);
    setEditCell(null);
  };

  const downloadExcel = useCallback(async () => {
    const XLSX = await import("xlsx");

    const headers = ["Date", "Description", "Cheque No", "Debit (₹)", "Credit (₹)", "Balance (₹)", "Category", "Ledger"];
    const rows = transactions.map(t => [
      t.date, t.description, t.cheque,
      t.debit || "", t.credit || "", t.balance || "",
      t.category, t.ledger,
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Navy header
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = XLSX.utils.encode_cell({ r: 0, c });
      if (ws[cell]) {
        ws[cell].s = {
          fill: { fgColor: { rgb: "1E3A5F" } },
          font: { color: { rgb: "FFFFFF" }, bold: true },
          alignment: { horizontal: "center" },
        };
      }
    }

    // Alternate rows + category colour
    const CATEGORY_COLORS: Record<string, string> = {
      Tax: "FFF3CD", Salary: "D4EDDA", Purchase: "F8D7DA", Income: "D1ECF1",
      Rent: "E2D9F3", Utilities: "FDEBD0", Loan: "FCE4EC", Insurance: "E8F4FD",
      Cash: "F5F5F5", Travel: "E8F8E8", Investment: "EAF4FB", Refund: "FFFDE7",
    };
    for (let r = 1; r <= rows.length; r++) {
      const catVal = rows[r - 1][6] as string;
      const bgColor = CATEGORY_COLORS[catVal] || (r % 2 === 0 ? "EBF3FB" : "FFFFFF");
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cellAddr = XLSX.utils.encode_cell({ r, c });
        if (!ws[cellAddr]) ws[cellAddr] = { t: "z" };
        ws[cellAddr].s = { fill: { fgColor: { rgb: bgColor.replace("#", "") } } };
      }
    }

    ws["!cols"] = [
      { wch: 13 }, { wch: 45 }, { wch: 12 },
      { wch: 14 }, { wch: 14 }, { wch: 14 },
      { wch: 16 }, { wch: 22 },
    ];

    // Summary sheet
    const totalDebits  = transactions.reduce((s, t) => s + (t.debit  || 0), 0);
    const totalCredits = transactions.reduce((s, t) => s + (t.credit || 0), 0);
    const summaryData = [
      ["Bank Statement Summary", ""],
      ["", ""],
      ["Total Transactions", transactions.length],
      ["Total Debits (₹)",   totalDebits],
      ["Total Credits (₹)",  totalCredits],
      ["Net Cash Flow (₹)",  totalCredits - totalDebits],
      ["Closing Balance (₹)", transactions[transactions.length - 1]?.balance || ""],
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(summaryData);
    ws2["!cols"] = [{ wch: 25 }, { wch: 20 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws,  "Transactions");
    XLSX.utils.book_append_sheet(wb, ws2, "Summary");
    XLSX.writeFile(wb, `bank_statement_${file?.name.replace(".pdf", "") || "export"}.xlsx`);
  }, [transactions, file]);

  const fmt = (n: number) =>
    n ? new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(n) : "";

  const CATEGORY_BADGE: Record<string, string> = {
    Tax: "bg-yellow-100 text-yellow-800",
    Salary: "bg-green-100 text-green-800",
    Purchase: "bg-red-100 text-red-800",
    Income: "bg-cyan-100 text-cyan-800",
    Rent: "bg-purple-100 text-purple-800",
    Utilities: "bg-orange-100 text-orange-800",
    Loan: "bg-pink-100 text-pink-800",
    Insurance: "bg-blue-100 text-blue-800",
    Cash: "bg-gray-100 text-gray-800",
    Travel: "bg-emerald-100 text-emerald-800",
    Investment: "bg-sky-100 text-sky-800",
    Refund: "bg-lime-100 text-lime-800",
    Uncategorized: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted hover:text-dark mb-6">
          <ArrowLeft size={15} /> Back to Tools
        </Link>

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
            <Database className="text-primary" size={22} /> PDF Bank Statement to Excel
          </h1>
          <p className="text-muted text-sm mt-1">
            Extract &amp; auto-classify transactions from any Indian bank PDF statement. Supports signed-amount, debit/credit column, and Dr/Cr formats.
          </p>
        </div>

        {/* Privacy */}
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-5 text-sm text-green-800 font-medium">
          <Shield size={16} className="text-green-600 flex-shrink-0" />
          <span>Your financial data is processed 100% in your browser. No data is uploaded to any server. Ever.</span>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-6">
          {(["upload", "processing", "preview"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s ? "bg-primary text-white" :
                (step === "preview" && i < 2) || (step === "processing" && i < 1)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-muted"
              }`}>
                {(step === "preview" && i < 2) || (step === "processing" && i < 1)
                  ? <CheckCircle size={14} />
                  : i + 1}
              </div>
              <span className={`text-sm ${step === s ? "font-semibold text-dark" : "text-muted"}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
              {i < 2 && <div className="w-8 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* ── Upload ── */}
        {step === "upload" && (
          <div className="bg-white rounded-card shadow-card border border-gray-100 p-6">
            <div
              className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center hover:border-primary/50 transition-colors cursor-pointer mb-5"
              onClick={() => inputRef.current?.click()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
              onDragOver={e => e.preventDefault()}
            >
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              {file ? (
                <div>
                  <Database size={40} className="mx-auto text-primary mb-3" />
                  <p className="font-medium text-dark">{file.name}</p>
                  <p className="text-muted text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <Upload size={40} className="mx-auto text-muted mb-3" />
                  <p className="font-medium text-dark mb-1">Upload PDF Bank Statement</p>
                  <p className="text-muted text-sm">SBI · HDFC · ICICI · Axis · Kotak · BOI · PNB · Canara · Union · Yes Bank</p>
                  <p className="text-xs text-muted mt-2">Handles signed amounts, separate debit/credit columns, and Dr/Cr format</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" /> {error}
              </div>
            )}

            <button onClick={processFile} disabled={!file} className="btn-primary gap-2 w-full justify-center py-3.5 disabled:opacity-50">
              Extract &amp; Classify Transactions
            </button>
          </div>
        )}

        {/* ── Processing ── */}
        {step === "processing" && (
          <div className="bg-white rounded-card shadow-card border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-semibold text-dark mb-2">Processing your PDF...</p>
            <p className="text-muted text-sm">{progress}</p>
            <p className="text-xs text-muted mt-3">This may take a moment for multi-page statements</p>
          </div>
        )}

        {/* ── Preview ── */}
        {step === "preview" && (
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <p className="font-semibold text-dark">{transactions.length} transactions extracted &amp; classified</p>
                <p className="text-xs text-muted">Click any cell to edit · Category auto-updates on description change</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setStep("upload"); setFile(null); setTransactions([]); }} className="btn-outline text-sm">
                  Start Over
                </button>
                <button onClick={downloadExcel} className="btn-primary gap-2 text-sm">
                  <Download size={15} /> Download Excel
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Total Debits",  value: transactions.reduce((s, t) => s + (t.debit  || 0), 0), cls: "text-red-600" },
                { label: "Total Credits", value: transactions.reduce((s, t) => s + (t.credit || 0), 0), cls: "text-green-600" },
                { label: "Net Flow",      value: transactions.reduce((s, t) => s + (t.credit || 0) - (t.debit || 0), 0), cls: "text-primary" },
              ].map(({ label, value, cls }) => (
                <div key={label} className="bg-white rounded-card shadow-card border border-gray-100 p-3 text-center">
                  <div className="text-xs text-muted mb-1">{label}</div>
                  <div className={`font-bold ${cls}`}>₹{fmt(Math.abs(value))}</div>
                </div>
              ))}
            </div>

            {/* Category legend */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Array.from(new Set(transactions.map(t => t.category))).map(cat => (
                <span key={cat} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_BADGE[cat] || "bg-gray-100 text-gray-500"}`}>
                  <Tag size={10} /> {cat}
                </span>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-card shadow-card border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto max-h-[520px]">
                <table className="w-full text-xs">
                  <thead className="sticky top-0">
                    <tr className="bg-primary text-white">
                      {["#", "Date", "Description", "Cheque No", "Debit (₹)", "Credit (₹)", "Balance (₹)", "Category", "Ledger"].map(h => (
                        <th key={h} className="text-left py-2.5 px-3 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-background"}>
                        <td className="py-2 px-3 text-muted">{i + 1}</td>
                        {(["date", "description", "cheque", "debit", "credit", "balance", "category", "ledger"] as (keyof Transaction)[]).map(col => (
                          <td
                            key={col}
                            className={`py-2 px-3 cursor-pointer hover:bg-yellow-50 transition-colors ${
                              col === "debit"   && t.debit   ? "text-red-600 font-medium text-right" :
                              col === "credit"  && t.credit  ? "text-green-600 font-medium text-right" :
                              col === "balance"              ? "text-right text-muted" :
                              col === "category"             ? "" : ""
                            }`}
                            onClick={() => { setEditCell({ row: i, col }); setEditValue(String((t as any)[col])); }}
                          >
                            {editCell?.row === i && editCell.col === col ? (
                              <input
                                autoFocus
                                className="w-full border border-primary rounded px-1 py-0.5 text-xs min-w-[80px]"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onBlur={() => updateCell(i, col, editValue)}
                                onKeyDown={e => e.key === "Enter" && updateCell(i, col, editValue)}
                              />
                            ) : col === "category" ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${CATEGORY_BADGE[t.category] || "bg-gray-100 text-gray-500"}`}>
                                <Tag size={9} /> {t.category}
                              </span>
                            ) : (
                              typeof (t as any)[col] === "number" && (t as any)[col] !== 0
                                ? fmt((t as any)[col])
                                : (t as any)[col] || "—"
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <p className="tool-disclaimer">
          Results are indicative only. Always consult a qualified tax professional for final decisions. Associate Piyush is not liable for any decisions made based on tool outputs. © 2026 Associate Piyush, Pune.
        </p>
      </div>
    </div>
  );
}
