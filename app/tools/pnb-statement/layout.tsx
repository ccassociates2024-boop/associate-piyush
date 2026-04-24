import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bank Statement to Excel | Associate Piyush",
  description:
    "Convert any Indian bank PDF statement (PNB, SBI, HDFC, ICICI, Axis, Kotak, Canara) to Excel. Auto-detects Dr/Cr columns, merges multi-line narrations, verifies running balance. 100% browser-based.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
