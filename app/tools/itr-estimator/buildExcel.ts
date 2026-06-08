// @ts-ignore
import XLSX from "xlsx-js-style";

// ── Colors ───────────────────────────────────────────────────────────────────
const C = {
  NAVY:"1E3A8A", NAVY2:"1D4ED8", BLUE:"2563EB", BLUE2:"3B82F6",
  LBLUE:"DBEAFE", VLBLUE:"EFF6FF", AMBER:"FEF3C7", AMBERDK:"B45309",
  GOLD:"F59E0B", GOLDLT:"FFFBEB", GRLT:"DCFCE7", GRDK:"166534",
  REDLT:"FEE2E2", REDDK:"B91C1C", GRAY1:"F8FAFC", GRAY2:"F1F5F9",
  WHITE:"FFFFFF", DARK:"1E293B", MUTED:"475569",
  BORDER:"CBD5E1", BORDK:"64748B", PURPLE:"4F46E5", PURPLT:"EEF2FF",
};

// ── Border/fill/font helpers ─────────────────────────────────────────────────
const b  = (s:string, c=C.BORDER) => ({ style:s, color:{rgb:c} });
const thin = (c=C.BORDER) => ({ top:b("thin",c), bottom:b("thin",c), left:b("thin",c), right:b("thin",c) });
const dbl  = (c=C.AMBERDK) => ({ top:b("thin",C.BORDK), bottom:b("double",c), left:b("thin",C.BORDK), right:b("thin",C.BORDK) });
const fill = (rgb:string) => ({ fgColor:{rgb}, patternType:"solid" });
const fnt  = (o:Record<string,any>={}) => ({ name:"Calibri", sz:10, color:{rgb:C.DARK}, ...o });

// ── Cell creators ─────────────────────────────────────────────────────────────
type XC = Record<string,any>;
const title = (v:string, bg=C.NAVY, fg=C.WHITE, sz=14):XC =>
  ({ v, t:"s", s:{ font:fnt({bold:true,sz,color:{rgb:fg}}), fill:fill(bg), alignment:{horizontal:"center",vertical:"center",wrapText:true}, border:thin(bg) }});
const sec   = (v:string, bg=C.BLUE, fg=C.WHITE):XC =>
  ({ v, t:"s", s:{ font:fnt({bold:true,sz:11,color:{rgb:fg}}), fill:fill(bg), alignment:{horizontal:"left",vertical:"center",indent:1}, border:thin(bg) }});
const hdr   = (v:string, bg=C.NAVY2):XC =>
  ({ v, t:"s", s:{ font:fnt({bold:true,color:{rgb:C.WHITE}}), fill:fill(bg), alignment:{horizontal:"center",vertical:"center",wrapText:true}, border:thin(C.NAVY) }});
const lbl   = (v:string, ind=0, bg=C.WHITE, bold=false, fg=C.DARK):XC =>
  ({ v:v??"", t:"s", s:{ font:fnt({bold,color:{rgb:fg}}), fill:fill(bg), alignment:{horizontal:"left",vertical:"center",indent:ind,wrapText:true}, border:thin(C.BORDER) }});
const info  = (v:string, bold=false):XC =>
  ({ v, t:"s", s:{ font:fnt({bold}), fill:fill(C.VLBLUE), alignment:{horizontal:"left",vertical:"center",wrapText:true}, border:thin(C.BLUE2) }});
const blk   = (bg=C.WHITE):XC =>
  ({ v:"", t:"s", s:{ fill:fill(bg), border:thin(C.BORDER) }});
const note  = (v:string, bg=C.GRLT):XC =>
  ({ v, t:"s", s:{ font:fnt({italic:true,sz:9,color:{rgb:C.GRDK}}), fill:fill(bg), alignment:{horizontal:"left",vertical:"center",wrapText:true,indent:1}, border:thin(C.BORDK) }});
const sep   = (n:number, bg=C.BORDER):XC[] => Array.from({length:n},()=>({v:"",t:"s",s:{fill:fill(bg),border:thin(bg)}}));

// Number cell — plain value, no formula
const numV  = (v:number, bg=C.WHITE, bold=false, fg?:string, isTotal=false):XC => ({
  v: Math.round(v)||0, t:"n",
  s:{ numFmt:"#,##0", font:fnt({bold,color:{rgb:fg??(v<0?C.REDDK:C.DARK)}}),
      fill:fill(bg), alignment:{horizontal:"right",vertical:"center"},
      border: isTotal ? dbl() : thin(C.BORDER) }
});
// Formula cell — formula + cached value
const numF  = (formula:string, cached:number, bg=C.WHITE, bold=false, fg?:string, isTotal=false):XC => ({
  v: Math.round(cached)||0, f: formula, t:"n",
  s:{ numFmt:"#,##0", font:fnt({bold,color:{rgb:fg??(cached<0?C.REDDK:C.DARK)}}),
      fill:fill(bg), alignment:{horizontal:"right",vertical:"center"},
      border: isTotal ? dbl() : thin(C.BORDER) }
});
const grand = (formula:string, cached:number, bg=C.NAVY, fg=C.WHITE):XC => ({
  v: Math.round(cached)||0, f: formula, t:"n",
  s:{ numFmt:"#,##0", font:fnt({bold:true,sz:12,color:{rgb:fg}}),
      fill:fill(bg), alignment:{horizontal:"right",vertical:"center"}, border:thin(bg) }
});
const dash  = (bg=C.WHITE):XC =>
  ({ v:"—", t:"s", s:{ font:fnt({color:{rgb:C.MUTED}}), fill:fill(bg), alignment:{horizontal:"center",vertical:"center"}, border:thin(C.BORDER) }});
const na    = (bg=C.GRAY2):XC =>
  ({ v:"N/A", t:"s", s:{ font:fnt({italic:true,sz:9,color:{rgb:C.MUTED}}), fill:fill(bg), alignment:{horizontal:"center",vertical:"center"}, border:thin(C.BORDER) }});

// ── Sheet builder with row tracker ───────────────────────────────────────────
class SB {
  rows:XC[][] = []; heights:number[] = []; merges:any[] = [];
  R:Record<string,number> = {};
  cur = 0;

  add(key:string|null, cells:XC[], h=18) {
    if(key) this.R[key]=this.cur;
    this.rows.push(cells); this.heights.push(h); this.cur++;
    return this.cur-1;
  }
  mg(c1:number,r1:number,c2:number,r2:number) {
    this.merges.push({s:{r:r1,c:c1},e:{r:r2,c:c2}});
  }
  // Excel row number (1-indexed)
  row(k:string){ return (this.R[k]??0)+1; }
  // Cell ref e.g. "D5"
  ref(k:string,col:string){ return `${col}${this.row(k)}`; }

  build(colW:number[], sheetName:string, wb:any) {
    const ws:any = {};
    let maxR=0, maxC=0;
    this.rows.forEach((row,r)=>{
      row.forEach((cell,c)=>{ if(cell){ ws[XLSX.utils.encode_cell({r,c})]=cell; if(c>maxC)maxC=c; }});
      if(r>maxR)maxR=r;
    });
    ws["!ref"] = XLSX.utils.encode_range({s:{r:0,c:0},e:{r:maxR,c:maxC}});
    ws["!cols"] = colW.map(w=>({wch:Math.max(18,w)}));
    ws["!rows"] = this.heights.map(h=>({hpt:Math.max(15,h)}));
    ws["!merges"] = this.merges;
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }
}

const n = (s:string)=>parseFloat(s)||0;

// ═════════════════════════════════════════════════════════════════════════════
export function buildExcel(p:{
  fy:string; fyLabel:string; ayLabel:string; act:string;
  name:string; pan:string; type:string;
  gross:number; houseProperty:number; business:number;
  stcg:number; ltcg:number; other:number;
  hraExempt:number; ltaExempt:number; gratuityExempt:number;
  leaveExempt:number; eduExempt:number; hostelExempt:number;
  oldDed:number; c80C:number; c80CCD:number; c80D:number; c80G:number; hlInterest:number;
  old:{taxable:number;base:number;surcharge:number;cess:number;total:number};
  newR:{taxable:number;base:number;surcharge:number;cess:number;total:number};
  tds:number; advTax:number; filingDelay:number;
  salBreak:Record<string,string>;
}) {
  const wb = XLSX.utils.book_new();
  const typeName = p.type==="individual"?"Individual (Below 60 yrs)":
    p.type==="senior"?"Senior Citizen (60–80 yrs)":
    p.type==="supersenior"?"Super Senior (80+ yrs)":"HUF";

  // ═══════════════════════════════════════════════════════════════════════
  // SHEET 2 — HRA WORKING  (built first so we can reference its row numbers)
  // ═══════════════════════════════════════════════════════════════════════
  const hra = new SB();
  const HW = 3; // number of columns
  const metro = p.salBreak.metroCity==="yes";
  const basic = n(p.salBreak.basicDa), hraRec=n(p.salBreak.hraReceived), rentPm=n(p.salBreak.rentPm);

  hra.add(null,[title("HRA EXEMPTION WORKING",C.NAVY,C.WHITE,14),blk(C.NAVY),blk(C.NAVY)],38); hra.mg(0,0,0,2);
  hra.add(null,[title(`u/s 10(13A)  |  Rule 2A of IT Rules  |  FY ${p.fyLabel}  |  AY ${p.ayLabel}`,C.NAVY2,C.WHITE,10),blk(C.NAVY2),blk(C.NAVY2)],24); hra.mg(1,1,1,2);
  hra.add(null,[info("Name: "+(p.name||"____"),true),info("PAN: "+(p.pan||"XXXXXXXXXX"),true),blk(C.VLBLUE)],22);
  hra.add(null,sep(HW,C.BORDK),8);
  hra.add(null,[hdr("SR."),hdr("PARTICULARS"),hdr("AMOUNT  (₹)")],26);
  hra.add(null,sep(HW,C.BORDK),6);
  hra.add(null,[sec("A.",C.BLUE),sec("INPUT DATA — Salary & Rent Details",C.BLUE),blk(C.BLUE)],24);

  hra.add("H_BASIC",  [lbl("1",1,C.GRAY1),lbl("Basic Salary + Dearness Allowance (DA)  —  Annual",1,C.GRAY1),   numV(basic,C.GRAY1)],18);
  hra.add("H_HRAREC", [lbl("2",1),         lbl("HRA Received from Employer  —  Annual",1),                       numV(hraRec)],18);
  hra.add("H_RENTPM", [lbl("3",1,C.GRAY1),lbl("Rent Paid per Month",1,C.GRAY1),                                  numV(rentPm,C.GRAY1)],18);
  hra.add("H_RENTANN",[lbl("4",1),         lbl(`Rent Paid Annual  =  Row 3 × 12  (${hra.ref("H_RENTPM","C")} × 12)`,1), numF(`=${hra.ref("H_RENTPM","C")}*12`, rentPm*12)],18);
  hra.add("H_CITY",   [lbl("5",1,C.GRAY1),lbl("City Type",1,C.GRAY1), lbl(metro?"Metro (Delhi/Mumbai/Kolkata/Chennai)":"Non-Metro City",1,C.GRAY1)],18);
  hra.add(null,sep(HW,C.BORDER),8);

  hra.add(null,[sec("B.",C.BLUE),sec("HRA EXEMPTION  —  MINIMUM OF 3 CONDITIONS",C.BLUE),blk(C.BLUE)],24);
  const c1=hraRec, c2=basic*(metro?0.5:0.4), c3=Math.max(0,rentPm*12-basic*0.1);
  const hraEx=Math.max(0,Math.min(c1,c2,c3));

  // Condition rows — highlight the minimum
  const condData:[string,string,string,number][] = [
    ["C1",`Condition 1:  HRA Received from Employer  (= ${hra.ref("H_HRAREC","C")})`,`=${hra.ref("H_HRAREC","C")}`,c1],
    ["C2",`Condition 2:  ${metro?"50%":"40%"} of Basic+DA  (${metro?"50%":"40%"} × ${hra.ref("H_BASIC","C")})`,`=${hra.ref("H_BASIC","C")}*${metro?"0.5":"0.4"}`,c2],
    ["C3",`Condition 3:  Rent Annual − 10% of Basic+DA  (${hra.ref("H_RENTANN","C")} − 10% × ${hra.ref("H_BASIC","C")})`,`=MAX(0,${hra.ref("H_RENTANN","C")}-${hra.ref("H_BASIC","C")}*0.1)`,c3],
  ];
  condData.forEach(([k,lv,f,v])=>{
    const isMin=Math.abs(v-hraEx)<1;
    const bg=isMin?C.GOLDLT:(hra.cur%2===0?C.GRAY1:C.WHITE);
    hra.add(k,[lbl(k.replace("C","C"),1,bg,isMin,isMin?C.AMBERDK:C.DARK),
      lbl(lv+(isMin?"   ← MINIMUM":""),1,bg,isMin,isMin?C.AMBERDK:C.DARK),
      numF(f,v,bg,isMin,isMin?C.AMBERDK:undefined)],20);
  });
  hra.add(null,sep(HW,C.BORDER),8);

  hra.add("H_EXEMPT",[
    blk(C.NAVY), lbl("HRA EXEMPT  =  MIN(C1, C2, C3)",1,C.NAVY,true,C.WHITE),
    numF(`=MIN(${hra.ref("C1","C")},${hra.ref("C2","C")},${hra.ref("C3","C")})`, hraEx, C.GRLT, true, C.GRDK),
  ],30);
  hra.add("H_TAXABLE",[
    blk(C.REDLT), lbl("HRA Taxable  =  HRA Received − HRA Exempt",1,C.REDLT,true,C.REDDK),
    numF(`=${hra.ref("H_HRAREC","C")}-${hra.ref("H_EXEMPT","C")}`, Math.max(0,hraRec-hraEx), C.REDLT, true, C.REDDK),
  ],24);
  hra.add(null,sep(HW,C.BORDER),8);
  hra.add(null,[note("Sec 10(13A) | Rule 2A. Only for salaried employees in rented accommodation."),blk(C.GRLT),blk(C.GRLT)],22); hra.mg(1,hra.cur-1,2,hra.cur-1);
  hra.build([6,58,22],"HRA Working",wb);
  const HRA_EXEMPT_REF = `='HRA Working'!C${hra.row("H_EXEMPT")}`;

  // ═══════════════════════════════════════════════════════════════════════
  // SHEET 4 — GRATUITY & LEAVE  (built before main so we can reference it)
  // ═══════════════════════════════════════════════════════════════════════
  const gl = new SB();
  const grat=n(p.salBreak.gratuityReceived), yrs=n(p.salBreak.yearsService), lastBDA=n(p.salBreak.lastBasicDa);
  const gratCalc=lastBDA>0?Math.round((lastBDA/26)*15*yrs):0;
  const gratEx=Math.min(grat,2000000,gratCalc>0?gratCalc:grat);
  const avgSal=n(p.salBreak.avgSalary10m), leaveDays=n(p.salBreak.leaveBalanceDays);
  const cashEq=avgSal>0?Math.round((avgSal/30)*leaveDays):0;
  const leaveRec=n(p.salBreak.leaveEncashment);
  const leaveEx=leaveRec>0?Math.min(leaveRec,25000000,avgSal*10,cashEq>0?cashEq:leaveRec):0;
  const children=Math.min(parseInt(p.salBreak.numChildren)||0,2);
  const eduRec=n(p.salBreak.eduAllowance), hostelRec=n(p.salBreak.hostelAllowance);
  const eduEx2=Math.min(eduRec,children*100*12), hostelEx2=Math.min(hostelRec,children*300*12);

  gl.add(null,[title("EXEMPTION WORKINGS",C.NAVY,C.WHITE,14),blk(C.NAVY),blk(C.NAVY)],38); gl.mg(0,0,0,2);
  gl.add(null,[title(`Gratuity · Leave Encashment · Allowances  |  FY ${p.fyLabel}  |  AY ${p.ayLabel}`,C.NAVY2,C.WHITE,10),blk(C.NAVY2),blk(C.NAVY2)],24); gl.mg(1,1,1,2);
  gl.add(null,[info("Name: "+(p.name||"___"),true),info("PAN: "+(p.pan||"XXXXXXXXXX"),true),blk(C.VLBLUE)],22);
  gl.add(null,sep(3,C.BORDK),8);

  // A. Gratuity
  gl.add(null,[sec("A.",C.BLUE),sec("GRATUITY EXEMPTION  u/s 10(10)  —  Private Sector",C.BLUE),blk(C.BLUE)],24);
  gl.add("G_REC",  [lbl("1",1,C.GRAY1),lbl("Gratuity Received",1,C.GRAY1),             numV(grat,C.GRAY1)],18);
  gl.add("G_YRS",  [lbl("2",1),         lbl("Years of Service (completed)",1),           numV(yrs)],18);
  gl.add("G_LBDA", [lbl("3",1,C.GRAY1),lbl("Last Drawn Basic + DA  (Monthly)",1,C.GRAY1),numV(lastBDA,C.GRAY1)],18);
  gl.add("G_CALC", [lbl("4",1),         lbl(`Computed Gratuity = (${gl.ref("G_LBDA","C")} ÷ 26) × 15 × ${gl.ref("G_YRS","C")}`,1),
    numF(`=(${gl.ref("G_LBDA","C")}/26)*15*${gl.ref("G_YRS","C")}`, gratCalc)],18);
  gl.add(null,sep(3,C.BORDER),6);

  const gratConds:[string,string,number][] = [
    ["GC1","Actual Gratuity Received",grat],
    ["GC2","Computed Gratuity  [(Basic÷26)×15×Years]",gratCalc],
    ["GC3","Maximum Exempt Limit  (Payment of Gratuity Act — ₹20,00,000)",2000000],
  ];
  gratConds.forEach(([k,lv,v])=>{
    const isMin=Math.abs(v-gratEx)<1;
    const bg=isMin?C.GOLDLT:(gl.cur%2===0?C.GRAY1:C.WHITE);
    const f = k==="GC1"?`=${gl.ref("G_REC","C")}`:k==="GC2"?`=${gl.ref("G_CALC","C")}`:`2000000`;
    gl.add(k,[lbl(k,1,bg,isMin,isMin?C.AMBERDK:C.DARK),
      lbl(lv+(isMin?"   ← MINIMUM":""),1,bg,isMin,isMin?C.AMBERDK:C.DARK),
      numF(f,v,bg,isMin,isMin?C.AMBERDK:undefined)],20);
  });
  gl.add("G_EXEMPT",[blk(C.NAVY),lbl("GRATUITY EXEMPT  =  MIN(GC1, GC2, GC3)",1,C.NAVY,true,C.WHITE),
    numF(`=MIN(${gl.ref("GC1","C")},${gl.ref("GC2","C")},${gl.ref("GC3","C")})`,gratEx,C.GRLT,true,C.GRDK)],28);
  gl.add(null,[blk(C.REDLT),lbl("Gratuity Taxable  =  Received − Exempt",1,C.REDLT,true,C.REDDK),
    numF(`=${gl.ref("G_REC","C")}-${gl.ref("G_EXEMPT","C")}`,Math.max(0,grat-gratEx),C.REDLT,true,C.REDDK)],22);
  gl.add(null,[note("Sec 10(10) | Payment of Gratuity Act 1972. Max ₹20L private sector. Govt employees fully exempt."),blk(C.GRLT),blk(C.GRLT)],24); gl.mg(1,gl.cur-1,2,gl.cur-1);
  gl.add(null,sep(3,C.BORDER),8);

  // B. Leave Encashment
  gl.add(null,[sec("B.",C.BLUE2),sec("LEAVE ENCASHMENT  u/s 10(10AA)  —  Non-Govt Employees",C.BLUE2),blk(C.BLUE2)],24);
  gl.add("L_REC",  [lbl("1",1,C.GRAY1),lbl("Leave Encashment Received",1,C.GRAY1),       numV(leaveRec,C.GRAY1)],18);
  gl.add("L_AVG",  [lbl("2",1),         lbl("Average Salary  —  Last 10 Months (Basic+DA)",1),numV(avgSal)],18);
  gl.add("L_DAYS", [lbl("3",1,C.GRAY1),lbl("Leave Balance in Days",1,C.GRAY1),             numV(leaveDays,C.GRAY1)],18);
  gl.add("L_CASH", [lbl("4",1),         lbl(`Cash Equivalent = (${gl.ref("L_AVG","C")} ÷ 30) × ${gl.ref("L_DAYS","C")}`,1),
    numF(`=(${gl.ref("L_AVG","C")}/30)*${gl.ref("L_DAYS","C")}`,cashEq)],18);
  gl.add(null,sep(3,C.BORDER),6);

  const leaveConds:[string,string,string,number][] = [
    ["LC1","Leave Encashment Received",`=${gl.ref("L_REC","C")}`,leaveRec],
    ["LC2","10 Months Average Salary  (10 × Avg Salary)",`=${gl.ref("L_AVG","C")}*10`,avgSal*10],
    ["LC3","Cash Equivalent of Earned Leave",`=${gl.ref("L_CASH","C")}`,cashEq],
    ["LC4","Maximum Exempt Limit  (₹25,00,000 — amended 2023)","25000000",25000000],
  ];
  leaveConds.forEach(([k,lv,f,v])=>{
    const isMin=Math.abs(v-leaveEx)<1;
    const bg=isMin?C.GOLDLT:(gl.cur%2===0?C.GRAY1:C.WHITE);
    gl.add(k,[lbl(k,1,bg,isMin,isMin?C.AMBERDK:C.DARK),
      lbl(lv+(isMin?"   ← MINIMUM":""),1,bg,isMin,isMin?C.AMBERDK:C.DARK),
      numF(f,v,bg,isMin,isMin?C.AMBERDK:undefined)],20);
  });
  gl.add("L_EXEMPT",[blk(C.NAVY),lbl("LEAVE ENCASHMENT EXEMPT  =  MIN(LC1,LC2,LC3,LC4)",1,C.NAVY,true,C.WHITE),
    numF(`=MIN(${gl.ref("LC1","C")},${gl.ref("LC2","C")},${gl.ref("LC3","C")},${gl.ref("LC4","C")})`,leaveEx,C.GRLT,true,C.GRDK)],28);
  gl.add(null,[blk(C.REDLT),lbl("Taxable  =  Received − Exempt",1,C.REDLT,true,C.REDDK),
    numF(`=${gl.ref("L_REC","C")}-${gl.ref("L_EXEMPT","C")}`,Math.max(0,leaveRec-leaveEx),C.REDLT,true,C.REDDK)],22);
  gl.add(null,[note("Sec 10(10AA) | Rule 2BA. Limit ₹25L (w.e.f. April 2023). Govt employees fully exempt."),blk(C.GRLT),blk(C.GRLT)],22); gl.mg(1,gl.cur-1,2,gl.cur-1);
  gl.add(null,sep(3,C.BORDER),8);

  // C. Children Allowances
  gl.add(null,[sec("C.",C.BLUE2),sec("CHILDREN EDUCATION & HOSTEL ALLOWANCE  u/s 10(14)(ii)",C.BLUE2),blk(C.BLUE2)],24);
  gl.add("CHILDREN",[lbl("",1,C.GRAY1),lbl(`Number of Children (max 2 allowed for exemption)`,1,C.GRAY1),numV(children,C.GRAY1)],18);
  // Education
  gl.add(null,[sec("",C.LBLUE,C.DARK),sec("Education Allowance  —  Max ₹100/child/month",C.LBLUE,C.DARK),blk(C.LBLUE)],20);
  gl.add("EDU_REC", [lbl("1",1,C.GRAY1),lbl("Education Allowance Received  (Annual)",1,C.GRAY1),numV(eduRec,C.GRAY1)],18);
  gl.add("EDU_MAX", [lbl("2",1),         lbl(`Maximum Exempt  =  ₹100 × ${gl.ref("CHILDREN","C")} children × 12 months`,1),
    numF(`=100*${gl.ref("CHILDREN","C")}*12`,children*100*12)],18);
  gl.add("EDU_EX",  [blk(C.AMBER),lbl(`Education Allowance EXEMPT  =  MIN(${gl.ref("EDU_REC","C")}, ${gl.ref("EDU_MAX","C")})`,1,C.AMBER,true,C.AMBERDK),
    numF(`=MIN(${gl.ref("EDU_REC","C")},${gl.ref("EDU_MAX","C")})`,eduEx2,C.AMBER,true,C.AMBERDK,true)],22);
  // Hostel
  gl.add(null,[sec("",C.LBLUE,C.DARK),sec("Hostel Allowance  —  Max ₹300/child/month",C.LBLUE,C.DARK),blk(C.LBLUE)],20);
  gl.add("HOS_REC", [lbl("1",1,C.GRAY1),lbl("Hostel Allowance Received  (Annual)",1,C.GRAY1),numV(hostelRec,C.GRAY1)],18);
  gl.add("HOS_MAX", [lbl("2",1),         lbl(`Maximum Exempt  =  ₹300 × ${gl.ref("CHILDREN","C")} children × 12 months`,1),
    numF(`=300*${gl.ref("CHILDREN","C")}*12`,children*300*12)],18);
  gl.add("HOS_EX",  [blk(C.AMBER),lbl(`Hostel Allowance EXEMPT  =  MIN(${gl.ref("HOS_REC","C")}, ${gl.ref("HOS_MAX","C")})`,1,C.AMBER,true,C.AMBERDK),
    numF(`=MIN(${gl.ref("HOS_REC","C")},${gl.ref("HOS_MAX","C")})`,hostelEx2,C.AMBER,true,C.AMBERDK,true)],22);
  gl.add("GL_TOTAL", [blk(C.NAVY),lbl("TOTAL CHILDREN ALLOWANCE EXEMPT  (Education + Hostel)",1,C.NAVY,true,C.WHITE),
    numF(`=${gl.ref("EDU_EX","C")}+${gl.ref("HOS_EX","C")}`,eduEx2+hostelEx2,C.GRLT,true,C.GRDK)],28);
  gl.add(null,[note("Sec 10(14)(ii) | Rule 2BB. Education ₹100/month, Hostel ₹300/month per child, max 2 children. Not available in New Regime."),blk(C.GRLT),blk(C.GRLT)],22); gl.mg(1,gl.cur-1,2,gl.cur-1);
  gl.build([6,58,22],"Gratuity & Leave",wb);

  const GRAT_EXEMPT_REF  = `='Gratuity & Leave'!C${gl.row("G_EXEMPT")}`;
  const LEAVE_EXEMPT_REF = `='Gratuity & Leave'!C${gl.row("L_EXEMPT")}`;
  const EDU_EXEMPT_REF   = `='Gratuity & Leave'!C${gl.row("EDU_EX")}`;
  HOS_EXEMPT_REF   = `='Gratuity & Leave'!C${gl.row("HOS_EX")}`;

  // ═══════════════════════════════════════════════════════════════════════
  // SHEET 1 — MAIN TAX COMPUTATION  (5 columns: A B C D E)
  // ═══════════════════════════════════════════════════════════════════════
  const m = new SB();
  const NC = 5;

  // Title block
  m.add(null,[title("COMPUTATION OF INCOME TAX",C.NAVY,C.WHITE,16),blk(C.NAVY),blk(C.NAVY),blk(C.NAVY),blk(C.NAVY)],40); m.mg(0,0,4,0);
  m.add(null,[title(`Assessment Year: ${p.ayLabel}   |   Financial Year: ${p.fyLabel}`,C.NAVY2,C.WHITE,11),blk(C.NAVY2),blk(C.NAVY2),blk(C.NAVY2),blk(C.NAVY2)],25); m.mg(0,1,4,1);
  m.add(null,[info("Name:",true),info(p.name||"_____________________",true),info("PAN:",true),info(p.pan||"XXXXXXXXXX",true),blk(C.VLBLUE)],22);
  m.add(null,[info("Taxpayer Type:",true),info(typeName),info("Act:",true),info(p.act,false),blk(C.VLBLUE)],22);
  m.add(null,sep(NC,C.NAVY2),6);
  m.add(null,[hdr("SR."),hdr("PARTICULARS"),hdr("COMPONENT (₹)"),hdr("OLD REGIME (₹)"),hdr("NEW REGIME (₹)")],28);
  m.add(null,sep(NC,C.BORDK),6);

  // ── A. SALARY ────────────────────────────────────────────────────────────
  m.add(null,[sec("A.",C.BLUE),sec("INCOME FROM SALARY",C.BLUE),blk(C.BLUE),blk(C.BLUE),blk(C.BLUE)],24);
  m.add("GROSS_SAL",[lbl("1",1),lbl("Gross Salary / Wages / Pension  (before exemptions)",1,C.GRAY1),
    numV(p.gross,C.GRAY1,true), numV(p.gross,C.GRAY1), numV(p.gross,C.GRAY1)],18);
  m.add(null,[blk(C.LBLUE),lbl("Less: Exemptions u/s 10  (Old Regime)",1,C.LBLUE,true),blk(C.LBLUE),blk(C.LBLUE),blk(C.LBLUE)],20);

  // Exemption rows — each with cross-sheet formula
  m.add("EXMP_HRA", [lbl("(a)",2),lbl(`HRA Exempt  u/s 10(13A)   [='HRA Working'!C${hra.row("H_EXEMPT")}]`,2,C.WHITE),
    {v:Math.round(p.hraExempt)||0,f:HRA_EXEMPT_REF,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}},
    na(), na()],18);
  m.add("EXMP_LTA", [lbl("(b)",2),lbl("LTA Exempt  u/s 10(5)",2,C.GRAY1),
    numV(p.ltaExempt,C.GRAY1), na(C.GRAY2), na(C.GRAY2)],18);
  m.add("EXMP_GRAT",[lbl("(c)",2),lbl(`Gratuity Exempt  u/s 10(10)   [='Gratuity & Leave'!C${gl.row("G_EXEMPT")}]`,2,C.WHITE),
    {v:Math.round(p.gratuityExempt)||0,f:GRAT_EXEMPT_REF,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}},
    na(), na()],18);
  m.add("EXMP_LEAVE",[lbl("(d)",2),lbl(`Leave Encashment  u/s 10(10AA)   [='Gratuity & Leave'!C${gl.row("L_EXEMPT")}]`,2,C.GRAY1),
    {v:Math.round(p.leaveExempt)||0,f:LEAVE_EXEMPT_REF,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}},
    na(C.GRAY2), na(C.GRAY2)],18);
  m.add("EXMP_EDU", [lbl("(e)",2),lbl(`Education Allowance  u/s 10(14)   [='Gratuity & Leave'!C${gl.row("EDU_EX")}]`,2,C.WHITE),
    {v:Math.round(p.eduExempt)||0,f:EDU_EXEMPT_REF,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}},
    na(), na()],18);
  m.add("EXMP_HOS", [lbl("(f)",2),lbl(`Hostel Allowance  u/s 10(14)   [='Gratuity & Leave'!C${gl.row("HOS_EX")}]`,2,C.GRAY1),
    {v:Math.round(p.hostelExempt)||0,f:HOS_EXEMPT_REF,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}},
    na(C.GRAY2), na(C.GRAY2)],18);

  const totalExemp = p.hraExempt+p.ltaExempt+p.gratuityExempt+p.leaveExempt+p.eduExempt+p.hostelExempt;
  m.add("TOT_EXMP",[blk(C.AMBER),lbl("Total Exemptions u/s 10",2,C.AMBER,true,C.AMBERDK),
    numF(`=SUM(C${m.row("EXMP_HRA")}:C${m.row("EXMP_HOS")})`,totalExemp,C.AMBER,true,C.AMBERDK,true),
    blk(C.AMBER), blk(C.AMBER)],22);
  m.add("SAL_AFT",[lbl("2",1),lbl(`Salary after Exemptions  (${m.ref("GROSS_SAL","C")} − ${m.ref("TOT_EXMP","C")})`,1,C.GRAY1),
    numF(`=${m.ref("GROSS_SAL","C")}-${m.ref("TOT_EXMP","C")}`,p.gross-totalExemp,C.GRAY1),
    blk(C.GRAY1), blk(C.GRAY1)],18);
  m.add("STD_DED_OLD",[lbl("3",1),lbl("Less: Standard Deduction  u/s 16(ia)  — Old Regime",1),
    blk(), numV(50000), blk()],18);
  m.add("STD_DED_NEW",[lbl("",1,C.GRAY1),lbl("Less: Standard Deduction  u/s 16(ia)  — New Regime",1,C.GRAY1),
    blk(C.GRAY1), blk(C.GRAY1), numV(75000,C.GRAY1)],18);

  const netSalOld=Math.max(0,p.gross-totalExemp-50000), netSalNew=Math.max(0,p.gross-75000);
  m.add("NET_SAL",[blk(C.GRLT),lbl("Net Income from Salary",1,C.GRLT,true,C.GRDK), blk(C.GRLT),
    numF(`=${m.ref("SAL_AFT","C")}-${m.ref("STD_DED_OLD","D")}`,netSalOld,C.GRLT,true,C.GRDK),
    numF(`=${m.ref("GROSS_SAL","C")}-${m.ref("STD_DED_NEW","E")}`,netSalNew,C.GRLT,true,C.GRDK)],24);
  m.add(null,sep(NC,C.BORDER),6);

  // ── B. HOUSE PROPERTY ────────────────────────────────────────────────────
  m.add(null,[sec("B.",C.BLUE2),sec("INCOME FROM HOUSE PROPERTY",C.BLUE2),blk(C.BLUE2),blk(C.BLUE2),blk(C.BLUE2)],24);
  m.add("HP_GROSS",[lbl("1",1),lbl("Annual Value / Rent Received",1,C.GRAY1),
    numV(Math.max(0,p.houseProperty),C.GRAY1), blk(C.GRAY1), blk(C.GRAY1)],18);
  m.add("HP_30",[lbl("2",1),lbl(`Less: 30% Standard Deduction  u/s 24(a)  (30% × ${m.ref("HP_GROSS","C")})`,1),
    numF(`=${m.ref("HP_GROSS","C")}*0.3`,Math.max(0,p.houseProperty)*0.3), blk(), blk()],18);
  m.add("HP_INT",[lbl("3",1,C.GRAY1),lbl("Less: Interest on Housing Loan  u/s 24(b)  [Max ₹2,00,000]",1,C.GRAY1),
    numV(p.hlInterest,C.GRAY1), blk(C.GRAY1), blk(C.GRAY1)],18);
  const hpNet=p.houseProperty-Math.max(0,p.houseProperty)*0.3-p.hlInterest;
  const hpBg=hpNet<0?C.REDLT:C.GRLT, hpFg=hpNet<0?C.REDDK:C.GRDK;
  m.add("HP_NET",[blk(hpBg),lbl("Net Income / (Loss) from House Property",1,hpBg,true,hpFg), blk(hpBg),
    numF(`=${m.ref("HP_GROSS","C")}-${m.ref("HP_30","C")}-${m.ref("HP_INT","C")}`,hpNet,hpBg,true,hpFg),
    numF(`=${m.ref("HP_GROSS","C")}-${m.ref("HP_30","C")}-${m.ref("HP_INT","C")}`,hpNet,hpBg,true,hpFg)],22);
  m.add(null,sep(NC,C.BORDER),6);

  // ── C. BUSINESS ──────────────────────────────────────────────────────────
  m.add(null,[sec("C.",C.BLUE2),sec("BUSINESS / PROFESSIONAL INCOME",C.BLUE2),blk(C.BLUE2),blk(C.BLUE2),blk(C.BLUE2)],24);
  m.add("BUSINESS",[blk(),lbl("Net Business / Professional Income (after all expenses)",1,C.GRAY1),
    numV(p.business,C.GRAY1),
    numF(`=${m.ref("BUSINESS","C")}`,p.business,C.GRLT,true,C.GRDK),
    numF(`=${m.ref("BUSINESS","C")}`,p.business,C.GRLT,true,C.GRDK)],18);
  m.add(null,sep(NC,C.BORDER),6);

  // ── D. CAPITAL GAINS ─────────────────────────────────────────────────────
  m.add(null,[sec("D.",C.BLUE2),sec("INCOME FROM CAPITAL GAINS",C.BLUE2),blk(C.BLUE2),blk(C.BLUE2),blk(C.BLUE2)],24);
  m.add("STCG",[lbl("1",1),lbl("Short-Term Capital Gains (STCG)  —  taxed at slab rates",1,C.GRAY1),
    numV(p.stcg,C.GRAY1), blk(C.GRAY1), blk(C.GRAY1)],18);
  m.add("LTCG",[lbl("2",1),lbl("Long-Term Capital Gains (LTCG)  —  above ₹1.25L @ 12.5% (equity)",1),
    numV(p.ltcg), blk(), blk()],18);
  m.add("TOT_CG",[blk(C.AMBER),lbl("Total Capital Gains",2,C.AMBER,true,C.AMBERDK),
    numF(`=${m.ref("STCG","C")}+${m.ref("LTCG","C")}`,p.stcg+p.ltcg,C.AMBER,true,C.AMBERDK,true),
    blk(C.AMBER), blk(C.AMBER)],20);
  m.add(null,sep(NC,C.BORDER),6);

  // ── E. OTHER INCOME ──────────────────────────────────────────────────────
  m.add(null,[sec("E.",C.BLUE2),sec("INCOME FROM OTHER SOURCES",C.BLUE2),blk(C.BLUE2),blk(C.BLUE2),blk(C.BLUE2)],24);
  m.add("OTHER",[blk(),lbl("Interest / Dividends / Other Receipts",1,C.GRAY1), numV(p.other,C.GRAY1),
    numF(`=${m.ref("OTHER","C")}`,p.other,C.GRLT,true,C.GRDK),
    numF(`=${m.ref("OTHER","C")}`,p.other,C.GRLT,true,C.GRDK)],18);
  m.add(null,sep(NC,C.BORDER),6);

  // ── F. GTI ────────────────────────────────────────────────────────────────
  const gtiOld=Math.max(0,netSalOld+hpNet+p.business+p.stcg+p.ltcg+p.other);
  const gtiNew=Math.max(0,netSalNew+hpNet+p.business+p.stcg+p.ltcg+p.other);
  const gtiF_old=`=${m.ref("NET_SAL","D")}+${m.ref("HP_NET","D")}+${m.ref("BUSINESS","D")}+${m.ref("TOT_CG","C")}+${m.ref("OTHER","D")}`;
  const gtiF_new=`=${m.ref("NET_SAL","E")}+${m.ref("HP_NET","E")}+${m.ref("BUSINESS","E")}+${m.ref("TOT_CG","C")}+${m.ref("OTHER","E")}`;
  m.add("GTI",[
    {v:"F.",t:"s",s:{font:fnt({bold:true,sz:13,color:{rgb:C.WHITE}}),fill:fill(C.NAVY),alignment:{horizontal:"center",vertical:"center"},border:thin(C.NAVY)}},
    {v:"GROSS TOTAL INCOME   (A + B + C + D + E)",t:"s",s:{font:fnt({bold:true,sz:13,color:{rgb:C.WHITE}}),fill:fill(C.NAVY),alignment:{horizontal:"left",vertical:"center",indent:1},border:thin(C.NAVY)}},
    blk(C.NAVY), grand(gtiF_old,gtiOld), grand(gtiF_new,gtiNew),
  ],30);
  m.add(null,sep(NC,C.NAVY),8);

  // ── G. DEDUCTIONS CH VI-A ────────────────────────────────────────────────
  m.add(null,[sec("G.",C.PURPLE),sec("DEDUCTIONS UNDER CHAPTER VI-A   (OLD REGIME ONLY)",C.PURPLE),blk(C.PURPLE),blk(C.PURPLE),blk(C.PURPLE)],24);
  m.add(null,[
    {v:"ℹ",t:"s",s:{font:fnt({sz:10,color:{rgb:C.PURPLE}}),fill:fill(C.PURPLT),alignment:{horizontal:"center",vertical:"center"},border:thin(C.BLUE2)}},
    {v:"New Regime does NOT allow Chapter VI-A deductions. Standard deduction ₹75,000 already applied in Section A.",t:"s",s:{font:fnt({italic:true,sz:9,color:{rgb:C.PURPLE}}),fill:fill(C.PURPLT),alignment:{horizontal:"left",vertical:"center",wrapText:true,indent:1},border:thin(C.BLUE2)}},
    blk(C.PURPLT),blk(C.PURPLT),blk(C.PURPLT)],24); m.mg(1,m.cur-1,4,m.cur-1);

  m.add("D_80C",  [lbl("1",1),lbl("u/s 80C  [LIC, PPF, ELSS, PF, Tuition Fees, NSC — Max ₹1,50,000]",1,C.GRAY1),
    numV(Math.min(p.c80C,150000),C.GRAY1), numF(`=MIN(${m.ref("D_80C","C")},150000)`,Math.min(p.c80C,150000),C.GRAY1), na(C.GRAY2)],18);
  m.add("D_NPS",  [lbl("2",1),lbl("u/s 80CCD(1B)  [Additional NPS Contribution — Max ₹50,000]",1),
    numV(Math.min(p.c80CCD,50000)), numF(`=MIN(${m.ref("D_NPS","C")},50000)`,Math.min(p.c80CCD,50000)), na()],18);
  m.add("D_80D",  [lbl("3",1),lbl("u/s 80D  [Health Insurance Premium]",1,C.GRAY1),
    numV(p.c80D,C.GRAY1), numF(`=${m.ref("D_80D","C")}`,p.c80D,C.GRAY1), na(C.GRAY2)],18);
  m.add("D_80G",  [lbl("4",1),lbl("u/s 80G  [Donations — Eligible Amount]",1),
    numV(p.c80G), numF(`=${m.ref("D_80G","C")}`,p.c80G), na()],18);
  const ch6a=Math.min(p.c80C,150000)+Math.min(p.c80CCD,50000)+p.c80D+p.c80G;
  m.add("TOT_DED",[blk(C.AMBER),lbl("Total Deductions  u/s 80C+80CCD(1B)+80D+80G",1,C.AMBER,true,C.AMBERDK),
    numF(`=SUM(C${m.row("D_80C")}:C${m.row("D_80G")})`,ch6a,C.AMBER,true,C.AMBERDK,true),
    numF(`=SUM(D${m.row("D_80C")}:D${m.row("D_80G")})`,ch6a,C.AMBER,true,C.AMBERDK,true), blk(C.AMBER)],22);
  m.add(null,sep(NC,C.BORDER),6);

  // ── H. TAXABLE INCOME ────────────────────────────────────────────────────
  m.add(null,[sec("H.",C.BLUE),sec("NET TAXABLE INCOME",C.BLUE),blk(C.BLUE),blk(C.BLUE),blk(C.BLUE)],24);
  m.add(null,[blk(C.GRAY1),lbl("Gross Total Income  (F)",1,C.GRAY1,true),
    blk(C.GRAY1), numF(`=${m.ref("GTI","D")}`,gtiOld,C.GRAY1,true), numF(`=${m.ref("GTI","E")}`,gtiNew,C.GRAY1,true)],18);
  m.add(null,[blk(),lbl("Less: Standard Deduction",1),
    blk(), numV(50000), numV(75000)],18);
  m.add(null,[blk(C.GRAY1),lbl("Less: Chapter VI-A Deductions  (Old Regime only)",1,C.GRAY1),
    blk(C.GRAY1), numF(`=${m.ref("TOT_DED","D")}`,ch6a,C.GRAY1), na(C.GRAY2)],18);
  m.add("TAXABLE",[blk(C.GRLT),lbl("NET TAXABLE INCOME",1,C.GRLT,true,C.GRDK), blk(C.GRLT),
    grand(`=${m.ref("GTI","D")}-50000-${m.ref("TOT_DED","D")}`,p.old.taxable,C.GRLT,C.GRDK),
    grand(`=${m.ref("GTI","E")}-75000`,p.newR.taxable,C.GRLT,C.GRDK)],28);
  m.add(null,sep(NC,C.BORDER),6);

  // ── I. TAX COMPUTATION ───────────────────────────────────────────────────
  m.add(null,[sec("I.",C.NAVY),sec("COMPUTATION OF INCOME TAX",C.NAVY),blk(C.NAVY),blk(C.NAVY),blk(C.NAVY)],24);
  m.add(null,[blk(C.NAVY2),lbl("PARTICULARS",1,C.NAVY2,true,C.WHITE),blk(C.NAVY2),hdr("OLD REGIME  (₹)"),hdr("NEW REGIME  (₹)")],22);

  m.add(null,[blk(C.GRAY1),lbl("Net Taxable Income",1,C.GRAY1),
    blk(C.GRAY1), numF(`=${m.ref("TAXABLE","D")}`,p.old.taxable,C.GRAY1), numF(`=${m.ref("TAXABLE","E")}`,p.newR.taxable,C.GRAY1)],18);
  m.add("BASE_OLD",[blk(),lbl("Income Tax on Taxable Income  (as per applicable slab rates)",1),
    blk(), numV(p.old.base), numV(p.newR.base)],18);
  m.add("SURCHARGE",[blk(C.GRAY1),lbl("Add: Surcharge  (if applicable — income > ₹50 Lakhs)",1,C.GRAY1),
    blk(C.GRAY1), numV(p.old.surcharge,C.GRAY1), numV(p.newR.surcharge,C.GRAY1)],18);
  m.add("CESS_ROW",[blk(),lbl(`Add: Health & Education Cess @ 4%  =  4% × (Tax + Surcharge)`,1),
    blk(),
    numF(`=(${m.ref("BASE_OLD","D")}+${m.ref("SURCHARGE","D")})*0.04`,p.old.cess),
    numF(`=(${m.ref("BASE_OLD","E")}+${m.ref("SURCHARGE","E")})*0.04`,p.newR.cess)],18);
  m.add("TOTAL_TAX",[blk(C.NAVY),lbl("TOTAL INCOME TAX PAYABLE",1,C.NAVY,true,C.WHITE), blk(C.NAVY),
    grand(`=ROUND(${m.ref("BASE_OLD","D")}+${m.ref("SURCHARGE","D")}+${m.ref("CESS_ROW","D")},0)`,p.old.total),
    grand(`=ROUND(${m.ref("BASE_OLD","E")}+${m.ref("SURCHARGE","E")}+${m.ref("CESS_ROW","E")},0)`,p.newR.total)],28);
  m.add(null,sep(NC,C.BORDER),6);

  // ── J. TAX PAID ──────────────────────────────────────────────────────────
  m.add(null,[sec("J.",C.BLUE),sec("TAX PAID / ADVANCE TAX",C.BLUE),blk(C.BLUE),blk(C.BLUE),blk(C.BLUE)],24);
  m.add("TDS_ROW",[lbl("1",1),lbl("TDS Deducted  [Form 16 / Form 26AS]",1,C.GRAY1),
    numV(p.tds,C.GRAY1), numF(`=${m.ref("TDS_ROW","C")}`,p.tds,C.GRAY1), numF(`=${m.ref("TDS_ROW","C")}`,p.tds,C.GRAY1)],18);
  m.add("ADV_ROW",[lbl("2",1),lbl("Advance Tax Paid  (all installments combined)",1),
    numV(p.advTax), numF(`=${m.ref("ADV_ROW","C")}`,p.advTax), numF(`=${m.ref("ADV_ROW","C")}`,p.advTax)],18);
  m.add("TOT_PAID",[blk(C.AMBER),lbl("Total Tax Paid  (TDS + Advance Tax)",1,C.AMBER,true,C.AMBERDK), blk(C.AMBER),
    numF(`=${m.ref("TDS_ROW","D")}+${m.ref("ADV_ROW","D")}`,p.tds+p.advTax,C.AMBER,true,C.AMBERDK,true),
    numF(`=${m.ref("TDS_ROW","E")}+${m.ref("ADV_ROW","E")}`,p.tds+p.advTax,C.AMBER,true,C.AMBERDK,true)],22);
  m.add(null,sep(NC,C.BORDER),6);

  // ── K. 234 INTEREST (cross-linked from Sheet 3) ───────────────────────────
  // Build 234 sheet now so we know its row numbers
  const s3 = new SB();
  const delay=Math.max(0,p.filingDelay);
  const totalPaid=p.tds+p.advTax;
  s3.add(null,[title("INTEREST COMPUTATION",C.NAVY,C.WHITE,14),blk(C.NAVY),blk(C.NAVY),blk(C.NAVY),blk(C.NAVY)],38); s3.mg(0,0,4,0);
  s3.add(null,[title(`u/s 234A · 234B · 234C  |  FY ${p.fyLabel}  |  AY ${p.ayLabel}`,C.NAVY2,C.WHITE,10),blk(C.NAVY2),blk(C.NAVY2),blk(C.NAVY2),blk(C.NAVY2)],24); s3.mg(0,1,4,1);
  s3.add(null,[info("Name: "+(p.name||"___"),true),blk(C.VLBLUE),blk(C.VLBLUE),info("PAN: "+(p.pan||"XXXXXXXXXX"),true),blk(C.VLBLUE)],22);
  s3.add(null,sep(5,C.BORDK),8);
  s3.add(null,[hdr("SR."),hdr("PARTICULARS"),blk(C.NAVY2),hdr("OLD REGIME (₹)"),hdr("NEW REGIME (₹)")],26);
  s3.add(null,sep(5,C.BORDK),6);

  // Data input cross-refs from main sheet (not yet added to main, but we reference them by key)
  const MAIN="'Tax Computation'";
  // 234A
  s3.add(null,[sec("A.",C.BLUE),sec("INTEREST u/s 234A  —  Delay in Filing Return",C.BLUE),blk(C.BLUE),blk(C.BLUE),blk(C.BLUE)],24);
  s3.add("S3_TAX_OLD",[lbl("1",1),lbl(`Tax Payable  (Old Regime)   [=${MAIN}!${m.ref("TOTAL_TAX","D")}]`,1,C.GRAY1),
    blk(C.GRAY1),
    {v:Math.round(p.old.total),f:`=${MAIN}!${m.ref("TOTAL_TAX","D")}`,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}},
    {v:Math.round(p.newR.total),f:`=${MAIN}!${m.ref("TOTAL_TAX","E")}`,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}}],18);
  s3.add("S3_PAID",  [lbl("2",1),lbl(`Total Tax Paid  (TDS + Advance Tax)   [=${MAIN}!${m.ref("TOT_PAID","D")}]`,1),
    blk(),
    {v:Math.round(totalPaid),f:`=${MAIN}!${m.ref("TOT_PAID","D")}`,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}},
    {v:Math.round(totalPaid),f:`=${MAIN}!${m.ref("TOT_PAID","E")}`,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}}],18);
  s3.add("S3_DUE",[lbl("3",1,C.GRAY1),lbl(`Tax Due  =  Row 1 − Row 2`,1,C.GRAY1),blk(C.GRAY1),
    numF(`=MAX(0,D${s3.row("S3_TAX_OLD")}-D${s3.row("S3_PAID")})`,Math.max(0,p.old.total-totalPaid),C.GRAY1),
    numF(`=MAX(0,E${s3.row("S3_TAX_OLD")}-E${s3.row("S3_PAID")})`,Math.max(0,p.newR.total-totalPaid),C.GRAY1)],18);
  s3.add("S3_DELAY",[lbl("4",1),lbl("Number of Months of Delay  (after due date 31st July)",1), blk(),
    numV(delay), numV(delay)],18);
  s3.add("INT_234A",[blk(C.AMBER),lbl(`INTEREST u/s 234A  =  Row 3 × 1% × Row 4`,1,C.AMBER,true,C.AMBERDK), blk(C.AMBER),
    numF(`=ROUND(D${s3.row("S3_DUE")}*0.01*D${s3.row("S3_DELAY")},0)`,Math.max(0,Math.round((p.old.total-totalPaid)*0.01*delay)),C.AMBER,true,C.AMBERDK,true),
    numF(`=ROUND(E${s3.row("S3_DUE")}*0.01*E${s3.row("S3_DELAY")},0)`,Math.max(0,Math.round((p.newR.total-totalPaid)*0.01*delay)),C.AMBER,true,C.AMBERDK,true)],22);
  s3.add(null,[note("Applicable only if return is filed after due date (31st July for non-audit cases)."),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT)],22); s3.mg(0,s3.cur-1,4,s3.cur-1);
  s3.add(null,sep(5,C.BORDER),8);

  // 234B
  s3.add(null,[sec("B.",C.BLUE2),sec("INTEREST u/s 234B  —  Short / Non-Payment of Advance Tax",C.BLUE2),blk(C.BLUE2),blk(C.BLUE2),blk(C.BLUE2)],24);
  s3.add("S3_ASSESSED",[lbl("1",1),lbl(`Assessed Tax  [=${MAIN}!D${m.row("TOTAL_TAX")}]`,1,C.GRAY1),blk(C.GRAY1),
    {v:Math.round(p.old.total),f:`=D${s3.row("S3_TAX_OLD")}`,t:"n",s:{numFmt:"#,##0",font:fnt(),fill:fill(C.GRAY1),alignment:{horizontal:"right",vertical:"center"},border:thin()}},
    {v:Math.round(p.newR.total),f:`=E${s3.row("S3_TAX_OLD")}`,t:"n",s:{numFmt:"#,##0",font:fnt(),fill:fill(C.GRAY1),alignment:{horizontal:"right",vertical:"center"},border:thin()}}],18);
  s3.add("S3_90PCT",[lbl("2",1),lbl(`90% of Assessed Tax  (Minimum Advance Tax Required)  =  90% × Row 1`,1),blk(),
    numF(`=D${s3.row("S3_ASSESSED")}*0.9`,p.old.total*0.9),
    numF(`=E${s3.row("S3_ASSESSED")}*0.9`,p.newR.total*0.9)],18);
  s3.add("S3_PAID2",[lbl("3",1,C.GRAY1),lbl(`Total Tax Paid  [=${MAIN}!D${m.row("TOT_PAID")}]`,1,C.GRAY1),blk(C.GRAY1),
    {v:Math.round(totalPaid),f:`=D${s3.row("S3_PAID")}`,t:"n",s:{numFmt:"#,##0",font:fnt(),fill:fill(C.GRAY1),alignment:{horizontal:"right",vertical:"center"},border:thin()}},
    {v:Math.round(totalPaid),f:`=E${s3.row("S3_PAID")}`,t:"n",s:{numFmt:"#,##0",font:fnt(),fill:fill(C.GRAY1),alignment:{horizontal:"right",vertical:"center"},border:thin()}}],18);
  s3.add("S3_SHORTFALL",[lbl("4",1),lbl(`Shortfall in Advance Tax  =  MAX(0, Row 2 − Row 3)`,1),blk(),
    numF(`=MAX(0,D${s3.row("S3_90PCT")}-D${s3.row("S3_PAID2")})`,Math.max(0,p.old.total*0.9-totalPaid)),
    numF(`=MAX(0,E${s3.row("S3_90PCT")}-E${s3.row("S3_PAID2")})`,Math.max(0,p.newR.total*0.9-totalPaid))],18);
  s3.add("S3_MONTHS_B",[lbl("5",1,C.GRAY1),lbl("Months  (from 1st April to date of filing / assessment)",1,C.GRAY1),blk(C.GRAY1),
    numV(4,C.GRAY1), numV(4,C.GRAY1)],18);
  const i234B_old=totalPaid<p.old.total*0.9?Math.round(Math.max(0,p.old.total*0.9-totalPaid)*0.01*4):0;
  const i234B_new=totalPaid<p.newR.total*0.9?Math.round(Math.max(0,p.newR.total*0.9-totalPaid)*0.01*4):0;
  s3.add("INT_234B",[blk(C.AMBER),lbl(`INTEREST u/s 234B  =  Row 4 × 1% × Row 5`,1,C.AMBER,true,C.AMBERDK),blk(C.AMBER),
    numF(`=ROUND(D${s3.row("S3_SHORTFALL")}*0.01*D${s3.row("S3_MONTHS_B")},0)`,i234B_old,C.AMBER,true,C.AMBERDK,true),
    numF(`=ROUND(E${s3.row("S3_SHORTFALL")}*0.01*E${s3.row("S3_MONTHS_B")},0)`,i234B_new,C.AMBER,true,C.AMBERDK,true)],22);
  s3.add(null,[note("Applicable if advance tax paid < 90% of assessed tax. Computed from April 1 to date of payment/assessment."),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT)],22); s3.mg(0,s3.cur-1,4,s3.cur-1);
  s3.add(null,sep(5,C.BORDER),8);

  // 234C
  s3.add(null,[sec("C.",C.BLUE2),sec("INTEREST u/s 234C  —  Deferment of Advance Tax Installments",C.BLUE2),blk(C.BLUE2),blk(C.BLUE2),blk(C.BLUE2)],24);
  const instRows:[string,string,string][]=[
    ["15 June",  "Cumulative 15% due → 1% p.m. × 3 months if short","short → 3 months"],
    ["15 Sept",  "Cumulative 45% due → 1% p.m. × 3 months if short","short → 3 months"],
    ["15 Dec",   "Cumulative 75% due → 1% p.m. × 3 months if short","short → 3 months"],
    ["15 March", "Cumulative 100% due → 1% p.m. × 1 month if short","short → 1 month"],
  ];
  instRows.forEach(([d,r,note_txt],i)=>{
    const bg=i%2===0?C.GRAY1:C.WHITE;
    s3.add(null,[lbl(d,1,bg,true,C.NAVY2),lbl(r,1,bg),blk(bg),lbl(note_txt,1,bg),blk(bg)],18);
  });
  const i234C_old=p.advTax===0&&p.old.total>10000?Math.round(p.old.total*0.01*3):0;
  const i234C_new=p.advTax===0&&p.newR.total>10000?Math.round(p.newR.total*0.01*3):0;
  s3.add("INT_234C",[blk(C.AMBER),lbl("Estimated Interest u/s 234C  (if NO advance tax paid  →  3% of assessed tax)",1,C.AMBER,true,C.AMBERDK),blk(C.AMBER),
    numF(`=IF(${m.ref("ADV_ROW","C")}=0,ROUND(D${s3.row("S3_ASSESSED")}*0.03,0),0)`,i234C_old,C.AMBER,true,C.AMBERDK,true),
    numF(`=IF(${m.ref("ADV_ROW","C")}=0,ROUND(E${s3.row("S3_ASSESSED")}*0.03,0),0)`,i234C_new,C.AMBER,true,C.AMBERDK,true)],22);
  s3.add(null,[note("Actual 234C depends on installment-wise payment dates. Edit cells D/E in 234C row for actual amounts."),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT)],22); s3.mg(0,s3.cur-1,4,s3.cur-1);
  s3.add(null,sep(5,C.BORDER),8);

  s3.add("INT_234_TOT",[blk(C.NAVY),lbl("TOTAL INTEREST u/s 234   (A + B + C)",1,C.NAVY,true,C.WHITE),blk(C.NAVY),
    grand(`=D${s3.row("INT_234A")}+D${s3.row("INT_234B")}+D${s3.row("INT_234C")}`,i234B_old+i234C_old),
    grand(`=E${s3.row("INT_234A")}+E${s3.row("INT_234B")}+E${s3.row("INT_234C")}`,i234B_new+i234C_new)],30);
  s3.add(null,sep(5,C.BORDER),8);
  s3.add(null,[note("Sec 234A: 1% p.m. on self-assessment tax for each month/part month after due date."),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT)],20); s3.mg(0,s3.cur-1,4,s3.cur-1);
  s3.add(null,[note("Sec 234B: 1% p.m. on shortfall in advance tax (tax − 90% of assessed tax)."),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT)],20); s3.mg(0,s3.cur-1,4,s3.cur-1);
  s3.add(null,[note("Sec 234C: 1% p.m. for each deferred installment. Actual depends on installment dates."),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT)],20); s3.mg(0,s3.cur-1,4,s3.cur-1);
  s3.build([6,58,5,22,22],"234 Interest",wb);

  // Now add Section K to main sheet — cross-referencing 234 Interest sheet
  const S3="'234 Interest'";
  const tot234Old=i234B_old+i234C_old, tot234New=i234B_new+i234C_new;
  m.add(null,[sec("K.",C.BLUE),sec(`INTEREST U/S 234   [Cross-linked from '234 Interest' sheet]`,C.BLUE),blk(C.BLUE),blk(C.BLUE),blk(C.BLUE)],24);
  m.add("INT_A",[blk(C.GRAY1),lbl(`234A — Delay in Filing   [=${S3}!D${s3.row("INT_234A")}]`,1,C.GRAY1),blk(C.GRAY1),
    {v:Math.max(0,Math.round((p.old.total-totalPaid)*0.01*delay)),f:`=${S3}!D${s3.row("INT_234A")}`,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}},
    {v:Math.max(0,Math.round((p.newR.total-totalPaid)*0.01*delay)),f:`=${S3}!E${s3.row("INT_234A")}`,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}}],18);
  m.add("INT_B",[blk(),lbl(`234B — Short Advance Tax   [=${S3}!D${s3.row("INT_234B")}]`,1),blk(),
    {v:i234B_old,f:`=${S3}!D${s3.row("INT_234B")}`,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}},
    {v:i234B_new,f:`=${S3}!E${s3.row("INT_234B")}`,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}}],18);
  m.add("INT_C",[blk(C.GRAY1),lbl(`234C — Deferment   [=${S3}!D${s3.row("INT_234C")}]`,1,C.GRAY1),blk(C.GRAY1),
    {v:i234C_old,f:`=${S3}!D${s3.row("INT_234C")}`,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}},
    {v:i234C_new,f:`=${S3}!E${s3.row("INT_234C")}`,t:"n",s:{numFmt:"#,##0",font:fnt({color:{rgb:C.BLUE}}),fill:fill(C.VLBLUE),alignment:{horizontal:"right",vertical:"center"},border:thin(C.BLUE2)}}],18);
  m.add("TOT_234",[blk(C.AMBER),lbl("Total Interest u/s 234  (A + B + C)",1,C.AMBER,true,C.AMBERDK), blk(C.AMBER),
    numF(`=${m.ref("INT_A","D")}+${m.ref("INT_B","D")}+${m.ref("INT_C","D")}`,tot234Old,C.AMBER,true,C.AMBERDK,true),
    numF(`=${m.ref("INT_A","E")}+${m.ref("INT_B","E")}+${m.ref("INT_C","E")}`,tot234New,C.AMBER,true,C.AMBERDK,true)],22);
  m.add(null,sep(NC,C.BORDER),6);

  // ── L. NET PAYABLE ───────────────────────────────────────────────────────
  m.add(null,[sec("L.",C.NAVY),sec("NET TAX PAYABLE  /  (REFUNDABLE)",C.NAVY),blk(C.NAVY),blk(C.NAVY),blk(C.NAVY)],24);
  m.add(null,[blk(C.GRAY1),lbl("Total Tax Payable  (Section I)",1,C.GRAY1),
    blk(C.GRAY1), numF(`=${m.ref("TOTAL_TAX","D")}`,p.old.total,C.GRAY1), numF(`=${m.ref("TOTAL_TAX","E")}`,p.newR.total,C.GRAY1)],18);
  m.add(null,[blk(),lbl("Add: Total Interest u/s 234  (Section K)",1),
    blk(), numF(`=${m.ref("TOT_234","D")}`,tot234Old), numF(`=${m.ref("TOT_234","E")}`,tot234New)],18);
  m.add(null,[blk(C.GRAY1),lbl("Less: Total Tax Paid  (Section J)",1,C.GRAY1),
    blk(C.GRAY1), numF(`=${m.ref("TOT_PAID","D")}`,p.tds+p.advTax,C.GRAY1), numF(`=${m.ref("TOT_PAID","E")}`,p.tds+p.advTax,C.GRAY1)],18);

  const netOld=p.old.total+tot234Old-p.tds-p.advTax, netNew=p.newR.total+tot234New-p.tds-p.advTax;
  const lBg=(v:number)=>v<0?C.REDLT:C.GRLT, lFg=(v:number)=>v<0?C.REDDK:C.GRDK;
  m.add("NET_OLD",[
    {v:"→",t:"s",s:{font:fnt({bold:true,sz:14,color:{rgb:C.NAVY}}),fill:fill(lBg(netOld)),alignment:{horizontal:"center",vertical:"center"},border:thin(C.BORDK)}},
    {v:netOld<0?"REFUND RECEIVABLE":"NET TAX PAYABLE",t:"s",s:{font:fnt({bold:true,sz:13,color:{rgb:lFg(netOld)}}),fill:fill(lBg(netOld)),alignment:{horizontal:"left",vertical:"center",indent:1},border:thin(C.BORDK)}},
    blk(lBg(netOld)),
    grand(`=${m.ref("TOTAL_TAX","D")}+${m.ref("TOT_234","D")}-${m.ref("TOT_PAID","D")}`,netOld,lBg(netOld),lFg(netOld)),
    grand(`=${m.ref("TOTAL_TAX","E")}+${m.ref("TOT_234","E")}-${m.ref("TOT_PAID","E")}`,netNew,lBg(netNew),lFg(netNew)),
  ],32);
  m.add(null,sep(NC,C.NAVY),8);

  // ── M. RECOMMENDATION ────────────────────────────────────────────────────
  const savings=Math.abs(p.old.total-p.newR.total);
  const better=p.old.total<=p.newR.total?"OLD":"NEW";
  m.add(null,[
    {v:"★",t:"s",s:{font:fnt({bold:true,sz:16,color:{rgb:C.WHITE}}),fill:fill(C.GOLD),alignment:{horizontal:"center",vertical:"center"},border:thin(C.GOLD)}},
    title(`RECOMMENDED: ${better} REGIME  (Save ₹${new Intl.NumberFormat("en-IN").format(savings)})`,C.GOLD,C.WHITE,12),
    blk(C.GOLD),blk(C.GOLD),blk(C.GOLD)],35); m.mg(1,m.cur-1,4,m.cur-1);
  m.add(null,[
    blk(C.GOLDLT),
    {v:better==="OLD"
      ?`Old Regime saves ₹${new Intl.NumberFormat("en-IN").format(savings)}. Old tax: ₹${new Intl.NumberFormat("en-IN").format(p.old.total)} vs New tax: ₹${new Intl.NumberFormat("en-IN").format(p.newR.total)}`
      :`New Regime saves ₹${new Intl.NumberFormat("en-IN").format(savings)}. New tax: ₹${new Intl.NumberFormat("en-IN").format(p.newR.total)} vs Old tax: ₹${new Intl.NumberFormat("en-IN").format(p.old.total)}`,
      t:"s",s:{font:fnt({sz:10,color:{rgb:C.AMBERDK}}),fill:fill(C.GOLDLT),alignment:{horizontal:"left",vertical:"center",indent:1,wrapText:true},border:thin(C.GOLD)}
    },
    blk(C.GOLDLT),blk(C.GOLDLT),blk(C.GOLDLT)],28); m.mg(0,m.cur-1,4,m.cur-1);
  m.add(null,sep(NC,C.BORDER),6);
  m.add(null,[note(`Generated: ${new Date().toLocaleDateString("en-IN")}  ·  ${p.act}  ·  Results indicative only — verify with a qualified Chartered Accountant.  ·  © Associate Piyush, Pune  —  https://associatepiyush.co.in`),
    blk(C.GRLT),blk(C.GRLT),blk(C.GRLT),blk(C.GRLT)],28); m.mg(0,m.cur-1,4,m.cur-1);

  m.build([6,58,22,22,22],"Tax Computation",wb);

  // ── Write file ─────────────────────────────────────────────────────────────
  const safeName=(p.name||"Taxpayer").replace(/[^a-zA-Z0-9]/g,"_");
  const fyL=p.fy==="2526"?"FY_2025-26":"FY_2026-27";
  XLSX.writeFile(wb, `Income_Tax_Computation_${safeName}_${fyL}.xlsx`);
}

// Fix TS error for undeclared variable — hoisted declaration
declare let HOS_EXEMPT_REF: string;
