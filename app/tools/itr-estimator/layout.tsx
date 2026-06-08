import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Income Tax Estimator FY 2025-26 & 2026-27",
  description:
    "Free Income Tax Estimator for FY 2025-26 and FY 2026-27 — compare Old vs New Tax Regime. Zero tax up to ₹12L in new regime (87A rebate). Updated for Income-tax Act 2025. Includes surcharge & cess.",
  keywords: [
    "income tax estimator 2025-26",
    "income tax estimator 2026-27",
    "income tax calculator india",
    "old vs new tax regime calculator",
    "income tax slab 2025-26",
    "87A rebate calculator",
    "new tax regime slab",
    "income tax estimator india",
  ],
  alternates: { canonical: "https://associatepiyush.co.in/tools/itr-estimator" },
  openGraph: {
    title: "Free Income Tax Estimator FY 2026-27 | Associate Piyush",
    description: "Compare Old vs New Tax Regime. New regime: zero tax up to ₹12L. Updated for Income-tax Act 2025.",
    url: "https://associatepiyush.co.in/tools/itr-estimator",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
