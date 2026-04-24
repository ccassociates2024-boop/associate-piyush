import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PNB Statement to Excel | Associate Piyush",
  description:
    "Convert Punjab National Bank (PNB) PDF account statements to Excel. Handles Dr/Cr columns, multi-line descriptions, running balance verification. 100% browser-based.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
