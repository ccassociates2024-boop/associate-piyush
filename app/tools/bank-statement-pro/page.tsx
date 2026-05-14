"use client";

import { useState, useCallback } from "react";
import {
  Building2, Upload, Download, AlertCircle, CheckCircle,
  Loader2, ArrowLeft, Shield, RefreshCw, Eye, EyeOff, ChevronDown
} from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";

// ─── Types ────────────────────────────────────────────────────────────────────
type BankId = "auto" | "hdfc" | "pnb" | "bom" | "kotak" | "union";
type Step    = "upload" | "processing" | "preview";

interface Transaction {
  srNo: number;
  date: string;
  particulars: string;
  chequeNo: string;
  credit: number;
  debit: number;
  balance: number;
}

interface RawCell { text: string; x: number; y: number; }

// ─── Bank definitions ─────────────────────────────────────────────────────────
const BANKS: { id: BankId; label: string; color: string; keywords: string[] }[] = [
  { id: "auto",  label: "Auto Detect",           color: "#6366F1", keywords: [] },
  { id: "hdfc",  label: "HDFC Bank",              color: "#004C8F", keywords: ["hdfc bank","hdfc bank ltd","hdfcbank"] },
  { id: "pnb",   label: "Punjab National Bank",   color: "#E31837", keywords: ["punjab national bank","pnb","panjab national"] },
  { id: "bom",   label: "Bank of Maharashtra",    color: "#1B4F8A", keywords: ["bank of maharashtra","mahabank"] },
  { id: "kotak", label: "Kotak Mahindra Bank",    color: "#EE3124", keywords: ["kotak mahindra","kotak bank","811"] },
  { id: "union", label: "Union Bank of India",    color: "#00529B", keywords: ["union bank of india","union bank"] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cleanAmt(s: string): number {
  if (!s || s === "-" || s === "—") return 0;
  const n = parseFloat(s.replace(/[,\s₹]/g, "").replace(/[DdCc][Rr]\.?\s*$/i, ""));
  return isNaN(n) ? 0 : Math.abs(n);
}

const MONTHS: Record<string, string> = {
  jan:"01",feb:"02",mar:"03",apr:"04",may:"05",jun:"06",
  jul:"07",aug:"08",sep:"09",oct:"10",nov:"11",dec:"12",
};

function normalizeDate(s: string): string {
  if (!s) return "";
  const t = s.trim();
  // DD/MM/YY → DD/MM/YYYY
  const m1 = t.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (m1) { const yr = parseInt(m1[3]) >= 50 ? `19${m1[3]}` : `20${m1[3]}`; return `${m1[1]}/${m1[2]}/${yr}`; }
  // DD-MM-YYYY → DD/MM/YYYY
  const m2 = t.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (m2) return `${m2[1]}/${m2[2]}/${m2[3]}`;
  // DD Mon YYYY → DD/MM/YYYY
  const m3 = t.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (m3) { const mo = MONTHS[m3[2].toLowerCase()] ?? "01"; return `${m3[1].padStart(2,"0")}/${mo}/${m3[3]}`; }
  // DD/MM/YYYY passthrough
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(t)) return t;
  return t;
}

function extractCells(items: any[]): RawCell[] {
  return items
    .filter((it: any) => it.str?.trim())
    .map((it: any) => ({ text: it.str.trim(), x: Math.round(it.transform[4]), y: Math.round(it.transform[5]) }));
}

function groupByRow(cells: RawCell[], yTol = 5): RawCell[][] {
  const map = new Map<number, RawCell[]>();
  for (const c of cells) {
    let ky = -1;
    const keys = Array.from(map.keys());
    for (const k of keys) if (Math.abs(k - c.y) <= yTol) { ky = k; break; }
    if (ky === -1) map.set(c.y, [c]);
    else map.get(ky)!.push(c);
  }
  return Array.from(map.entries())
    .sort((a: [number, RawCell[]], b: [number, RawCell[]]) => b[0] - a[0])
    .map(([, cs]: [number, RawCell[]]) => cs.sort((a: RawCell, b: RawCell) => a.x - b.x));
}

function nearest(row: RawCell[], x: number): string {
  if (x < 0 || !row.length) return "";
  return row.reduce<RawCell | null>((b, c) =>
    b === null || Math.abs(c.x - x) < Math.abs(b.x - x) ? c : b, null
  )?.text ?? "";
}

function findHdrX(hdr: RawCell[], kws: string[]): number {
  const c = [...hdr].sort((a, b) => a.x - b.x).find(h => kws.some(k => h.text.toLowerCase().includes(k)));
  return c ? c.x : -1;
}

// ─── Bank Detection ───────────────────────────────────────────────────────────
function detectBank(text: string): BankId {
  const t = text.toLowerCase();
  for (const bank of BANKS) {
    if (bank.id === "auto") continue;
    if (bank.keywords.some(k => t.includes(k))) return bank.id;
  }
  return "hdfc"; // default fallback
}

// ─── HDFC Parser ──────────────────────────────────────────────────────────────
// Format: Date | Narration | Value Dt | Withdrawal Amt (Dr) | Deposit Amt (Cr) | Closing Balance
// Dates: DD/MM/YY (2-digit year) e.g. 01/10/25
const HDFC_DATE = /^\d{2}\/\d{2}\/\d{2}(\d{2})?$/;
const HDFC_AMOUNT = /^[\d,]+\.\d{2}$/;

function parseHDFC(rows: RawCell[][]): Transaction[] {
  const txns: Transaction[] = [];

  // Find header
  let hdrIdx = rows.findIndex(row =>
    row.some(c => /narration|withdrawal amt|deposit amt/i.test(c.text))
  );
  if (hdrIdx === -1) {
    hdrIdx = rows.findIndex(row =>
      row.some(c => /date/i.test(c.text)) &&
      row.some(c => /withdrawal|debit/i.test(c.text))
    );
  }
  if (hdrIdx === -1) return txns;

  const hdr = rows[hdrIdx];
  const dateX    = findHdrX(hdr, ["date"]);
  const narX     = findHdrX(hdr, ["narration","particulars","description","details"]);
  const valDtX   = findHdrX(hdr, ["value dt","value date"]);
  const drX      = findHdrX(hdr, ["withdrawal","debit"]);
  const crX      = findHdrX(hdr, ["deposit","credit"]);
  const balX     = findHdrX(hdr, ["closing","balance"]);

  let pending: Partial<Transaction> | null = null;

  for (let i = hdrIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row.length) continue;

    const dateCell = row.find(c => HDFC_DATE.test(c.text));
    if (dateCell) {
      if (pending?.date) {
        txns.push(pending as Transaction);
      }
      // Narration: cells between date and value-date (or withdrawal) columns
      const narCells = row.filter(c => {
        const afterDate  = c.x > dateX + 20;
        const beforeDr   = drX < 0 || c.x < drX - 10;
        const beforeValDt= valDtX < 0 || c.x < valDtX - 5;
        return c !== dateCell && afterDate && beforeDr && beforeValDt;
      });
      const narration = narCells.map(c => c.text).join(" ").trim() || nearest(row, narX);

      const dr  = cleanAmt(nearest(row, drX));
      const cr  = cleanAmt(nearest(row, crX));
      const bal = cleanAmt(nearest(row, balX));

      pending = {
        srNo: txns.length + 1,
        date: normalizeDate(dateCell.text),
        particulars: narration,
        chequeNo: "",
        credit: cr,
        debit: dr,
        balance: bal,
      };
    } else if (pending) {
      // Continuation row — append narration unless it looks like totals
      const text = row.map(c => c.text).join(" ").trim();
      if (text && !HDFC_AMOUNT.test(text) && !/opening|closing|total|balance/i.test(text)) {
        pending.particulars = ((pending.particulars ?? "") + " " + text).trim();
      }
    }
  }
  if (pending?.date) txns.push(pending as Transaction);
  txns.forEach((t, i) => (t.srNo = i + 1));
  return txns;
}

// ─── PNB Parser ───────────────────────────────────────────────────────────────
// Format: Txn No | Txn Date | Description | Branch | Cheque No | Dr Amount | Cr Amount | Balance
// Dates: DD-MM-YYYY  Amounts: have "Dr." / "Cr." appended on next col
const PNB_DATE = /^\d{2}-\d{2}-\d{4}$/;

function parsePNB(rows: RawCell[][]): Transaction[] {
  const txns: Transaction[] = [];

  let hdrIdx = rows.findIndex(row =>
    row.some(c => /txn date/i.test(c.text)) || (
      row.some(c => /dr.?amount|dr.?amt/i.test(c.text)) &&
      row.some(c => /cr.?amount|cr.?amt/i.test(c.text))
    )
  );
  if (hdrIdx === -1) return txns;

  const hdr = rows[hdrIdx];
  const dateX   = findHdrX(hdr, ["txn date","date"]);
  const descX   = findHdrX(hdr, ["description","particulars","narration"]);
  const branchX = findHdrX(hdr, ["branch"]);
  const cheqX   = findHdrX(hdr, ["cheque no","chq no","chq"]);
  const drX     = findHdrX(hdr, ["dr amount","dr amt","withdrawal"]);
  const crX     = findHdrX(hdr, ["cr amount","cr amt","deposit"]);
  const balX    = findHdrX(hdr, ["balance"]);

  let pending: Partial<Transaction> | null = null;
  let pendingRowCount = 0;

  for (let i = hdrIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row.length) continue;

    const dateCell = row.find(c => PNB_DATE.test(c.text));
    if (dateCell) {
      if (pending?.date) txns.push(pending as Transaction);

      const dr  = cleanAmt(nearest(row, drX));
      const cr  = cleanAmt(nearest(row, crX));
      const bal = cleanAmt(nearest(row, balX));
      const desc  = nearest(row, descX);
      const cheque= nearest(row, cheqX);

      pending = {
        srNo: txns.length + 1,
        date: normalizeDate(dateCell.text),
        particulars: desc,
        chequeNo: cheque,
        credit: cr,
        debit: dr,
        balance: bal,
      };
      pendingRowCount = 0;
    } else if (pending && pendingRowCount < 3) {
      // Multi-line description continuation
      const rowText = row.map(c => c.text).join(" ").trim();
      const isAmt = /^[\d,]+\.\d{2}$/.test(rowText);
      const isMeta = /opening|closing|total|page|statement/i.test(rowText);
      if (!isAmt && !isMeta && rowText) {
        pending.particulars = ((pending.particulars ?? "") + " " + rowText).trim();
        pendingRowCount++;
      }
    }
  }
  if (pending?.date) txns.push(pending as Transaction);
  txns.forEach((t, i) => (t.srNo = i + 1));
  return txns;
}

// ─── Bank of Maharashtra Parser ───────────────────────────────────────────────
// Format: Sr No | Date | Particulars | Cheque/Ref No | Debit | Credit | Balance | Channel
// Dates: DD/MM/YYYY  Empty cells: dash "-"
const BOM_DATE = /^\d{2}\/\d{2}\/\d{4}$/;

function parseBOM(rows: RawCell[][]): Transaction[] {
  const txns: Transaction[] = [];

  let hdrIdx = rows.findIndex(row =>
    row.some(c => /particulars/i.test(c.text)) &&
    row.some(c => /debit|credit/i.test(c.text))
  );
  if (hdrIdx === -1) {
    hdrIdx = rows.findIndex(row =>
      row.some(c => /date/i.test(c.text)) &&
      row.some(c => /balance/i.test(c.text)) &&
      row.some(c => /debit|withdrawal/i.test(c.text))
    );
  }
  if (hdrIdx === -1) return txns;

  const hdr = rows[hdrIdx];
  const dateX   = findHdrX(hdr, ["date"]);
  const partX   = findHdrX(hdr, ["particulars","description","narration"]);
  const cheqX   = findHdrX(hdr, ["cheque","chq/ref","ref no","ref"]);
  const debitX  = findHdrX(hdr, ["debit","withdrawal"]);
  const creditX = findHdrX(hdr, ["credit","deposit"]);
  const balX    = findHdrX(hdr, ["balance"]);

  for (let i = hdrIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row.length) continue;
    const dateCell = row.find(c => BOM_DATE.test(c.text));
    if (!dateCell) continue;

    const debit  = cleanAmt(nearest(row, debitX));
    const credit = cleanAmt(nearest(row, creditX));
    const bal    = cleanAmt(nearest(row, balX));
    const part   = nearest(row, partX);
    const cheque = nearest(row, cheqX);

    if (debit === 0 && credit === 0 && bal === 0) continue;

    txns.push({
      srNo: txns.length + 1,
      date: normalizeDate(dateCell.text),
      particulars: part,
      chequeNo: cheque === "-" ? "" : cheque,
      credit,
      debit,
      balance: bal,
    });
  }
  txns.forEach((t, i) => (t.srNo = i + 1));
  return txns;
}

// ─── Kotak Parser ─────────────────────────────────────────────────────────────
// Format: # | Transaction Date | Value Date | Transaction Details | CHQ/REF NO | DEBIT/CREDIT(₹) | BALANCE(₹)
// Dates: DD Mon YYYY (e.g. "15 Oct 2025")
// Amounts: single col — positive = credit, negative = debit
const KOTAK_DATE = /^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/;

function parseKotak(rows: RawCell[][]): Transaction[] {
  const txns: Transaction[] = [];

  let hdrIdx = rows.findIndex(row =>
    row.some(c => /transaction date/i.test(c.text)) ||
    (row.some(c => /transaction details/i.test(c.text)) && row.some(c => /balance/i.test(c.text)))
  );
  if (hdrIdx === -1) return txns;

  const hdr = rows[hdrIdx];
  const dateX   = findHdrX(hdr, ["transaction date","date"]);
  const detailX = findHdrX(hdr, ["transaction details","particulars","description","narration"]);
  const cheqX   = findHdrX(hdr, ["chq/ref","chq","ref"]);
  const amtX    = findHdrX(hdr, ["debit/credit","amount","dr/cr"]);
  const balX    = findHdrX(hdr, ["balance"]);

  for (let i = hdrIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row.length) continue;
    const dateCell = row.find(c => KOTAK_DATE.test(c.text));
    if (!dateCell) continue;

    const amtStr = nearest(row, amtX).replace(/[,\s₹]/g, "");
    const amtVal = parseFloat(amtStr);
    const credit = !isNaN(amtVal) && amtVal > 0 ? amtVal : 0;
    const debit  = !isNaN(amtVal) && amtVal < 0 ? Math.abs(amtVal) : 0;
    const bal    = cleanAmt(nearest(row, balX));

    txns.push({
      srNo: txns.length + 1,
      date: normalizeDate(dateCell.text),
      particulars: nearest(row, detailX),
      chequeNo: nearest(row, cheqX),
      credit,
      debit,
      balance: bal,
    });
  }
  txns.forEach((t, i) => (t.srNo = i + 1));
  return txns;
}

// ─── Generic Parser (Fallback + Union Bank after OCR) ─────────────────────────
// Detects columns from header keywords, handles most Indian bank formats
const ANY_DATE = /\b(\d{2}[\/\-]\d{2}[\/\-]\d{2,4}|\d{1,2}\s+[A-Za-z]{3}\s+\d{4})\b/;
const HDR_MUST = ["date","narration","particulars","description","debit","credit","balance","withdrawal","deposit","amount","cheque","chq","ref","txn"];

function isHeaderRow(row: RawCell[]): boolean {
  const hits = HDR_MUST.filter(w => row.some(c => c.text.toLowerCase().includes(w)));
  return hits.length >= 3;
}

function parseGeneric(rows: RawCell[][]): Transaction[] {
  const txns: Transaction[] = [];

  // Find header
  let hdrIdx = rows.findIndex(isHeaderRow);
  if (hdrIdx === -1) return txns;

  const hdr = rows[hdrIdx];
  const dateX  = findHdrX(hdr, ["txn date","transaction date","date"]);
  const descX  = findHdrX(hdr, ["narration","particulars","description","transaction details","details"]);
  const cheqX  = findHdrX(hdr, ["cheque no","chq/ref","chq","ref no"]);
  const drX    = findHdrX(hdr, ["dr amount","dr amt","withdrawal amt","withdrawal","debit","paid out"]);
  const crX    = findHdrX(hdr, ["cr amount","cr amt","deposit amt","deposit","credit","paid in"]);
  const amtX   = findHdrX(hdr, ["debit/credit","amount"]);
  const balX   = findHdrX(hdr, ["closing balance","running balance","balance"]);

  const hasSeparate = crX >= 0 && drX >= 0;

  let pending: Partial<Transaction> | null = null;

  for (let i = hdrIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row.length) continue;

    const dateMatch = row.find(c => ANY_DATE.test(c.text));
    if (dateMatch) {
      if (pending?.date) txns.push(pending as Transaction);

      let credit = 0, debit = 0;
      if (hasSeparate) {
        credit = cleanAmt(nearest(row, crX));
        debit  = cleanAmt(nearest(row, drX));
      } else {
        const amtStr = nearest(row, amtX >= 0 ? amtX : drX).replace(/[,\s₹]/g, "");
        const amtVal = parseFloat(amtStr);
        if (!isNaN(amtVal)) {
          if (amtVal >= 0) credit = amtVal; else debit = Math.abs(amtVal);
        }
      }

      pending = {
        srNo: txns.length + 1,
        date: normalizeDate(dateMatch.text),
        particulars: nearest(row, descX),
        chequeNo: nearest(row, cheqX),
        credit,
        debit,
        balance: cleanAmt(nearest(row, balX)),
      };
    } else if (pending) {
      const text = row.map(c => c.text).join(" ").trim();
      if (text && !/^[\d,]+\.\d{2}$/.test(text) && !/opening|closing|total|page/i.test(text)) {
        pending.particulars = ((pending.particulars ?? "") + " " + text).trim();
      }
    }
  }
  if (pending?.date) txns.push(pending as Transaction);
  txns.forEach((t, i) => (t.srNo = i + 1));
  return txns;
}

// ─── Dispatch parser ──────────────────────────────────────────────────────────
function runParser(bank: BankId, rows: RawCell[][]): Transaction[] {
  switch (bank) {
    case "hdfc":  return parseHDFC(rows);
    case "pnb":   return parsePNB(rows);
    case "bom":   return parseBOM(rows);
    case "kotak": return parseKotak(rows);
    default:      return parseGeneric(rows);
  }
}

// ─── Excel Export ─────────────────────────────────────────────────────────────
function exportExcel(txns: Transaction[], bankLabel: string, fileName: string) {
  const header = ["Sr. No.", "Date", "Particulars", "Cheque Number", "Credit / Deposit (₹)", "Debit / Withdrawal (₹)", "Balance (₹)"];
  const data = txns.map(t => [
    t.srNo,
    t.date,
    t.particulars,
    t.chequeNo || "",
    t.credit  > 0 ? t.credit  : "",
    t.debit   > 0 ? t.debit   : "",
    t.balance > 0 ? t.balance : "",
  ]);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
  ws["!cols"] = [
    { wch: 8 }, { wch: 14 }, { wch: 50 }, { wch: 18 },
    { wch: 20 }, { wch: 22 }, { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Bank Statement");
  XLSX.writeFile(wb, fileName);
}

// ─── Format number ────────────────────────────────────────────────────────────
function fmt(n: number): string {
  if (!n) return "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── UI Component ─────────────────────────────────────────────────────────────
export default function BankStatementPro() {
  const [bank, setBank]         = useState<BankId>("auto");
  const [step, setStep]         = useState<Step>("upload");
  const [error, setError]       = useState("");
  const [warning, setWarning]   = useState("");
  const [fileName, setFileName] = useState("");
  const [detectedBank, setDetectedBank] = useState<BankId | null>(null);
  const [txns, setTxns]         = useState<Transaction[]>([]);
  const [showAll, setShowAll]   = useState(false);
  const [progress, setProgress] = useState(0);

  const bankLabel = (id: BankId) => BANKS.find(b => b.id === id)?.label ?? id;

  const reset = () => {
    setStep("upload"); setError(""); setWarning(""); setFileName("");
    setDetectedBank(null); setTxns([]); setShowAll(false); setProgress(0);
  };

  const processFile = useCallback(async (file: File) => {
    setStep("processing");
    setError("");
    setWarning("");
    setProgress(5);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(15);

      // @ts-ignore
      const pdfjs = await import("pdfjs-dist/webpack.mjs");
      const pdf = await pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        isEvalSupported: false,
        useSystemFonts: true,
        disableRange: true,
        disableStream: true,
        disableAutoFetch: true,
      }).promise;

      setProgress(30);

      // Extract all text + cells
      let fullText = "";
      const allRows: RawCell[][] = [];

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const tc = await page.getTextContent();
        const cells = extractCells(tc.items);
        fullText += cells.map(c => c.text).join(" ") + " ";
        const rows = groupByRow(cells);
        allRows.push(...rows);
        setProgress(30 + Math.round((p / pdf.numPages) * 40));
      }

      setProgress(75);

      // Detect or use selected bank
      let resolvedBank: BankId = bank;
      if (bank === "auto") {
        resolvedBank = detectBank(fullText);
        setDetectedBank(resolvedBank);
      }

      // Check if scanned (very little text)
      const isScanned = fullText.replace(/\s/g, "").length < 200;
      if (isScanned && resolvedBank === "union") {
        // OCR path — requires tesseract.js
        setWarning("This appears to be a scanned PDF. OCR is being applied — this may take a minute.");
        const results = await runOCR(pdf);
        const ocrRows = results.map(line => {
          const cells: RawCell[] = line.split(/\s{2,}/).map((t, xi) => ({ text: t.trim(), x: xi * 100, y: 0 }));
          return cells;
        });
        const parsed = parseGeneric(ocrRows);
        if (!parsed.length) throw new Error("Could not extract transactions from scanned PDF. Please ensure the scan quality is good.");
        setTxns(parsed);
      } else if (isScanned) {
        throw new Error("This PDF appears to be scanned/image-based. Select 'Union Bank' for OCR processing, or use a text-based PDF.");
      } else {
        // Text-based PDF
        const parsed = runParser(resolvedBank, allRows);
        if (!parsed.length) {
          // Fallback to generic
          const fallback = parseGeneric(allRows);
          if (!fallback.length) throw new Error(`No transactions found. The PDF format may differ from expected ${bankLabel(resolvedBank)} layout. Try selecting the correct bank manually.`);
          setWarning(`Specific ${bankLabel(resolvedBank)} parser found 0 rows — used generic parser instead.`);
          setTxns(fallback);
        } else {
          setTxns(parsed);
        }
      }

      setProgress(100);
      setStep("preview");
      setFileName(file.name.replace(/\.pdf$/i, ""));

    } catch (e: any) {
      setError(e?.message || String(e) || "Failed to process PDF.");
      setStep("upload");
      setProgress(0);
    }
  }, [bank]);

  // OCR via tesseract.js for scanned PDFs
  async function runOCR(pdf: any): Promise<string[]> {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng");
    const lines: string[] = [];

    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement("canvas");
      canvas.width  = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const { data } = await worker.recognize(canvas.toDataURL("image/png"));
      lines.push(...data.lines.map((l: any) => l.text));
    }

    await worker.terminate();
    return lines;
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") processFile(file);
    else setError("Please upload a PDF file.");
  }, [processFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const doExport = () => {
    const label = detectedBank ? bankLabel(detectedBank) : bankLabel(bank);
    exportExcel(txns, label, `${fileName || "bank-statement"}_converted.xlsx`);
  };

  // ── Upload screen ──────────────────────────────────────────────────────────
  if (step === "upload") return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-3xl mx-auto px-4">

        {/* Back */}
        <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to Tools
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Building2 size={13} /> Multi-Bank PDF Converter
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-2">Bank Statement PDF → Excel</h1>
          <p className="text-muted text-sm max-w-xl mx-auto">
            Convert bank statement PDFs to Excel with correct columns: Sr. No., Date, Particulars, Cheque No., Credit, Debit, Balance.
            Supports HDFC, PNB, Bank of Maharashtra, Kotak & more.
          </p>
        </div>

        {/* Bank selector */}
        <div className="bg-white rounded-card shadow-card border border-gray-100 p-5 mb-4">
          <label className="block text-sm font-semibold text-dark mb-3">
            Select Bank <span className="text-muted font-normal">(or leave on Auto Detect)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BANKS.map(b => (
              <button
                key={b.id}
                onClick={() => setBank(b.id)}
                className={`text-left px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  bank === b.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 text-muted hover:border-primary/40 hover:text-dark"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          className="bg-white rounded-card shadow-card border-2 border-dashed border-gray-200 hover:border-primary/40 transition-colors p-10 text-center cursor-pointer group"
          onDragOver={e => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => document.getElementById("bsp-file")?.click()}
        >
          <input id="bsp-file" type="file" accept=".pdf" className="hidden" onChange={onFileChange} />
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors">
            <Upload size={26} className="text-primary" />
          </div>
          <p className="font-semibold text-dark mb-1">Drop your bank statement PDF here</p>
          <p className="text-sm text-muted">or click to browse — processed entirely in your browser</p>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
          <Shield size={12} className="text-green-500" />
          100% browser-based — your PDF never leaves your device
        </div>

        {/* Bank format guide */}
        <div className="mt-8 bg-white rounded-card shadow-card border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-dark mb-3">Supported Bank Formats</h3>
          <div className="space-y-2">
            {[
              { bank:"HDFC Bank",            fmt:"Date | Narration | Value Dt | Withdrawal (Dr) | Deposit (Cr) | Closing Balance" },
              { bank:"Punjab National Bank", fmt:"Txn No | Txn Date | Description | Cheque No | Dr Amount | Cr Amount | Balance" },
              { bank:"Bank of Maharashtra",  fmt:"Sr No | Date | Particulars | Cheque/Ref No | Debit | Credit | Balance" },
              { bank:"Kotak Mahindra Bank",  fmt:"# | Transaction Date | Value Date | Details | CHQ/REF | Debit/Credit(₹) | Balance" },
              { bank:"Union Bank of India",  fmt:"Scanned PDF — OCR applied automatically" },
            ].map(r => (
              <div key={r.bank} className="text-xs">
                <span className="font-semibold text-dark">{r.bank}:</span>{" "}
                <span className="text-muted">{r.fmt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Processing screen ──────────────────────────────────────────────────────
  if (step === "processing") return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
        <h2 className="font-bold text-dark text-lg mb-2">Processing PDF…</h2>
        <p className="text-sm text-muted mb-5">Extracting transactions from your bank statement</p>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted mt-2">{progress}% complete</p>
      </div>
    </div>
  );

  // ── Preview screen ─────────────────────────────────────────────────────────
  const displayTxns = showAll ? txns : txns.slice(0, 25);
  const totalCredit  = txns.reduce((s, t) => s + t.credit,  0);
  const totalDebit   = txns.reduce((s, t) => s + t.debit,   0);
  const activeBank   = detectedBank ?? (bank === "auto" ? "hdfc" : bank);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <button onClick={reset} className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
            <ArrowLeft size={15} /> New File
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            {detectedBank && (
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
                <CheckCircle size={12} /> Auto-detected: {bankLabel(detectedBank)}
              </span>
            )}
            {warning && (
              <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
                ⚠ {warning}
              </span>
            )}
          </div>
          <button
            onClick={doExport}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow"
          >
            <Download size={15} /> Download Excel
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label:"Transactions",   value: txns.length.toString(),    icon:"🔢" },
            { label:"Total Credit",   value: `₹${fmt(totalCredit)}`,    icon:"🟢" },
            { label:"Total Debit",    value: `₹${fmt(totalDebit)}`,     icon:"🔴" },
            { label:"Net Flow",       value: `₹${fmt(totalCredit - totalDebit)}`, icon: totalCredit >= totalDebit ? "📈" : "📉" },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-card shadow-card border border-gray-100 p-4">
              <div className="text-lg mb-1">{c.icon}</div>
              <div className="text-base font-bold text-dark truncate">{c.value}</div>
              <div className="text-xs text-muted">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-card shadow-card border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Sr.", "Date", "Particulars", "Cheque No.", "Credit (₹)", "Debit (₹)", "Balance (₹)"].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayTxns.map(t => (
                  <tr key={t.srNo} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-3 py-2.5 text-xs text-muted">{t.srNo}</td>
                    <td className="px-3 py-2.5 text-xs font-medium text-dark whitespace-nowrap">{t.date}</td>
                    <td className="px-3 py-2.5 text-xs text-dark max-w-xs" title={t.particulars}>
                      <span className="block truncate">{t.particulars || "—"}</span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted">{t.chequeNo || "—"}</td>
                    <td className="px-3 py-2.5 text-xs font-medium text-green-700 text-right">
                      {t.credit > 0 ? fmt(t.credit) : ""}
                    </td>
                    <td className="px-3 py-2.5 text-xs font-medium text-red-600 text-right">
                      {t.debit > 0 ? fmt(t.debit) : ""}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-dark text-right">{t.balance > 0 ? fmt(t.balance) : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {txns.length > 25 && (
            <div className="border-t border-gray-100 p-3 text-center">
              <button
                onClick={() => setShowAll(v => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <ChevronDown size={13} className={showAll ? "rotate-180 transition-transform" : "transition-transform"} />
                {showAll ? "Show less" : `Show all ${txns.length} transactions`}
              </button>
            </div>
          )}
        </div>

        {/* Export again at bottom */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={doExport}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow"
          >
            <Download size={16} /> Download Excel (.xlsx)
          </button>
          <button onClick={reset} className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors px-4 py-3">
            <RefreshCw size={14} /> Process another file
          </button>
        </div>

        <p className="text-center text-xs text-muted mt-4 flex items-center justify-center gap-1.5">
          <Shield size={11} className="text-green-500" />
          All processing done in your browser — no data uploaded anywhere
        </p>
      </div>
    </div>
  );
}
