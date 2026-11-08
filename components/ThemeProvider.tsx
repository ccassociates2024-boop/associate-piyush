"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* ── Counter animation helper ─────────────────────────────────────────────
   Reads data-counter="950" and animates from 0 to that value when the
   element first enters the viewport. Supports a suffix (e.g. "+", "k").   */
function animateCounter(el: Element) {
  const raw    = el.getAttribute("data-counter") ?? "0";
  const suffix = el.getAttribute("data-counter-suffix") ?? "";
  const target = parseInt(raw.replace(/\D/g, ""), 10);
  if (!target) return;

  const duration = 1600; // ms
  const start    = performance.now();

  const step = (now: number) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value  = Math.floor(eased * target);
    el.textContent = value.toLocaleString("en-IN") + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/* ── Automatic scroll reveal ───────────────────────────────────────────────
   Adds data-reveal to headings, cards and grid items that start BELOW the
   fold, so every page gets the same fade-up without editing each page.
   Grid children get a small stagger. Individual tool pages (/tools/xyz) are
   skipped so forms and results never animate while someone is working.   */
const AUTO_REVEAL_SELECTOR = [
  "main section h2",
  "main section h3",
  "main section .grid > *",
  "main .ap-card",
  "main .card",
  "main section > div > p",
].join(",");

function autoTagReveal(pathname: string | null) {
  if (pathname && /^\/tools\/.+/.test(pathname)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const fold = window.innerHeight;
  document.querySelectorAll<HTMLElement>(AUTO_REVEAL_SELECTOR).forEach((el) => {
    if (el.hasAttribute("data-reveal") || el.closest("[data-reveal]")) return;
    if (el.closest("nav, footer, [data-no-reveal]")) return;
    if (el.getBoundingClientRect().top < fold) return;   // already on screen: leave it

    el.setAttribute("data-reveal", "auto");
    const parent = el.parentElement;
    if (parent && parent.classList.contains("grid")) {
      const index = Array.prototype.indexOf.call(parent.children, el) as number;
      el.style.transitionDelay = `${(index % 6) * 70}ms`;
    }
  });
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /* ── Scroll reveal (data-reveal) ──────────────────────────────────────── */
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("revealed");
            revealObserver.unobserve(el);
            // Once the fade-up has finished, hand the element back to its own
            // styles so card hover effects (lift, glow) work normally again.
            if (el.getAttribute("data-reveal") === "auto") {
              setTimeout(() => {
                el.removeAttribute("data-reveal");
                el.classList.remove("revealed");
                el.style.transitionDelay = "";
              }, 1300);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const timer = setTimeout(() => {
      autoTagReveal(pathname);
      document
        .querySelectorAll("[data-reveal]:not(.revealed)")
        .forEach((el) => revealObserver.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      revealObserver.disconnect();
    };
  }, [pathname]);

  /* ── Counter animation (data-counter) ───────────────────────────────── */
  useEffect(() => {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const timer = setTimeout(() => {
      document
        .querySelectorAll("[data-counter]:not([data-counter-done])")
        .forEach((el) => {
          el.setAttribute("data-counter-done", "");
          counterObserver.observe(el);
        });
    }, 80);

    return () => {
      clearTimeout(timer);
      counterObserver.disconnect();
    };
  }, [pathname]);

  /* ── Scroll progress bar ─────────────────────────────────────────────── */
  useEffect(() => {
    const bar = document.getElementById("ap-progress-bar");
    if (!bar) return;

    const onScroll = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width  = `${Math.min(pct, 100)}%`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <>{children}</>;
}
