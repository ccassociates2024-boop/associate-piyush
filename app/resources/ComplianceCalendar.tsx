"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Cat = "GST" | "TDS" | "TCS" | "IT";

interface Rule {
  day: number;        // day of month (1–31); clamped to last day of short months
  desc: string;
  cat: Cat;
  months?: number[];  // 1=Jan … 12=Dec; undefined = every month
}

/* ─── Full-year recurring compliance rules ─────────────────────────────────── */
const RULES: Rule[] = [

  // ── Every single month ─────────────────────────────────────────────────────
  { day: 7,  desc: "TDS deposit — Govt deductors (previous month)",           cat: "TDS" },
  { day: 11, desc: "GSTR-1 — Monthly filers (previous month)",                cat: "GST" },
  { day: 20, desc: "GSTR-3B — Monthly filers (previous month)",               cat: "GST" },
  { day: 25, desc: "GST PMT-06 — QRMP monthly challan",                       cat: "GST" },
  { day: 30, desc: "TDS deposit — Non-govt deductors (previous month)",       cat: "TDS" },

  // ── After each quarter end  (Apr / Jul / Oct / Jan) ────────────────────────
  { day: 13, desc: "GSTR-1 — QRMP quarterly filers",                          cat: "GST", months: [4,7,10,1] },
  { day: 22, desc: "GSTR-3B — QRMP, Category I states",                       cat: "GST", months: [4,7,10,1] },
  { day: 24, desc: "GSTR-3B — QRMP, Category II states",                      cat: "GST", months: [4,7,10,1] },
  { day: 30, desc: "TCS return — Form 27EQ (quarterly)",                       cat: "TCS", months: [4,7,10,1] },

  // ── Advance Tax ────────────────────────────────────────────────────────────
  { day: 15, desc: "Advance Tax Q1 — 15% of estimated annual tax due",         cat: "IT",  months: [6]  },
  { day: 15, desc: "Advance Tax Q2 — cumulative 45% (pay 30% more)",           cat: "IT",  months: [9]  },
  { day: 15, desc: "Advance Tax Q3 — cumulative 75% (pay 30% more)",           cat: "IT",  months: [12] },
  { day: 15, desc: "Advance Tax Q4 — 100% final payment",                      cat: "IT",  months: [3]  },

  // ── TDS / TCS returns (quarterly) ─────────────────────────────────────────
  { day: 31, desc: "TDS/TCS return Q1 Apr–Jun — Form 24Q, 26Q, 27Q, 27EQ",    cat: "TDS", months: [7]  },
  { day: 31, desc: "TDS/TCS return Q2 Jul–Sep — Form 24Q, 26Q, 27Q, 27EQ",    cat: "TDS", months: [10] },
  { day: 31, desc: "TDS/TCS return Q3 Oct–Dec — Form 24Q, 26Q, 27Q, 27EQ",    cat: "TDS", months: [1]  },
  { day: 31, desc: "TDS return Q4 Jan–Mar — Form 26Q, 27Q, 27EQ",             cat: "TDS", months: [5]  },
  { day: 15, desc: "TDS return Q4 — Form 24Q (salary TDS + issue Form 16)",   cat: "TDS", months: [5]  },

  // ── ITR deadlines ─────────────────────────────────────────────────────────
  { day: 31, desc: "ITR filing deadline — Individuals, HUF, firms (non-audit)", cat: "IT", months: [7] },
  { day: 30, desc: "ITR filing deadline — Audit cases u/s 44AB",               cat: "IT",  months: [9] },

  // ── GST Annual ─────────────────────────────────────────────────────────────
  { day: 31, desc: "GSTR-9 / GSTR-9C — Annual return & reconciliation",        cat: "GST", months: [12] },

  // ── Year-end ───────────────────────────────────────────────────────────────
  { day: 31, desc: "Last date — Tax-saving investments for FY (80C, 80D, NPS)", cat: "IT",  months: [3] },
];

const CAT_COLORS: Record<Cat, string> = {
  GST: "bg-blue-100 text-blue-700",
  TDS: "bg-purple-100 text-purple-700",
  TCS: "bg-orange-100 text-orange-700",
  IT:  "bg-green-100 text-green-700",
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function lastDayOf(year: number, month: number) {   // month 1–12
  return new Date(year, month, 0).getDate();
}

function buildItems(year: number, month: number, today: Date) {
  const last = lastDayOf(year, month);
  return RULES
    .filter((r) => !r.months || r.months.includes(month))
    .map((r) => {
      const day  = Math.min(r.day, last);
      const date = new Date(year, month - 1, day);
      const diff = date.getTime() - today.getTime();
      const isToday   = date.toDateString() === today.toDateString();
      const isOverdue = !isToday && date < today;
      const isSoon    = !isToday && !isOverdue && diff <= 7 * 86_400_000;
      return { ...r, day, date, isToday, isOverdue, isSoon };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export default function ComplianceCalendar() {
  const today  = useMemo(() => new Date(), []);
  const [off, setOff] = useState(0);

  const { year, month } = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + off, 1);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }, [today, off]);

  const items = useMemo(() => buildItems(year, month, today), [year, month, today]);

  const overdue  = items.filter((i) => i.isOverdue).length;
  const dueToday = items.filter((i) => i.isToday).length;
  const upcoming = items.filter((i) => !i.isOverdue && !i.isToday).length;

  return (
    <div>
      {/* ── Header row ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">

        {/* Title + legend */}
        <div>
          <h2 className="text-2xl font-bold text-dark">
            Compliance Calendar — {MONTHS[month - 1]} {year}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs font-medium">
            {overdue  > 0 && <span className="text-amber-600">● {overdue} Overdue</span>}
            {dueToday > 0 && <span className="text-red-600 animate-pulse">● {dueToday} Due Today</span>}
            <span className="text-green-600">● {upcoming} Upcoming</span>
          </div>
        </div>

        {/* Month navigator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setOff((o) => o - 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--ap-border)" }}
            title="Previous month"
          >
            <ChevronLeft size={15} style={{ color: "var(--ap-text-muted)" }} />
          </button>

          {off !== 0 && (
            <button
              onClick={() => setOff(0)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:bg-amber-50"
              style={{ borderColor: "#C9A84C", color: "#C9A84C" }}
            >
              This Month
            </button>
          )}

          <button
            onClick={() => setOff((o) => o + 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--ap-border)" }}
            title="Next month"
          >
            <ChevronRight size={15} style={{ color: "var(--ap-text-muted)" }} />
          </button>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider w-28">Due Date</th>
              <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider">Compliance</th>
              <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider w-20">Type</th>
              <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider w-32">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item, i) => (
              <tr
                key={i}
                className={`transition-colors ${
                  item.isToday   ? "bg-red-50 hover:bg-red-100/50" :
                  item.isOverdue ? "bg-amber-50 hover:bg-amber-100/50" :
                  item.isSoon    ? "bg-blue-50/50 hover:bg-blue-100/30" :
                  "hover:bg-gray-50/60"
                }`}
              >
                <td className="px-5 py-3.5 font-semibold text-dark whitespace-nowrap">
                  {item.day} {MONTHS[month - 1].slice(0, 3)}
                </td>
                <td className="px-5 py-3.5 text-dark">{item.desc}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[item.cat]}`}>
                    {item.cat}
                  </span>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  {item.isToday ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
                      Due Today!
                    </span>
                  ) : item.isOverdue ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                      Overdue
                    </span>
                  ) : item.isSoon ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                      Due in {Math.ceil((item.date.getTime() - today.getTime()) / 86_400_000)}d
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                      Upcoming
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer note ─────────────────────────────────────────────────────── */}
      <p className="text-xs mt-3" style={{ color: "var(--ap-text-muted)" }}>
        * Due dates per Income-tax Act 2025 and GST Act. Dates falling on public holidays may shift to next working day. Confirm with your CA for your specific category and state.
      </p>
    </div>
  );
}
