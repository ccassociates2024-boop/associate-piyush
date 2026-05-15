"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Re-run on every client-side route change so [data-reveal] elements
    // on newly rendered pages get observed (layout never remounts in Next.js).
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    // Small delay lets React finish painting the incoming page before we query
    const timer = setTimeout(() => {
      const targets = document.querySelectorAll("[data-reveal]:not(.revealed)");
      targets.forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]); // ← re-observe whenever the route changes

  return <>{children}</>;
}
