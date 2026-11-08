"use client";

import { useEffect, useRef } from "react";

/* ── Custom cursor: accent dot + trailing ring ──────────────────────────────
   Desktop (fine pointer) only. Off for touch devices and reduced motion.
   The ring grows over links/buttons and hides over text fields, where the
   normal text cursor comes back. Styling: "CUSTOM CURSOR" in globals.css. */

const INTERACTIVE = "a, button, [role='button'], summary, label, select, .ap-card";
const TEXT_FIELDS = "input, textarea, [contenteditable='true']";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine   = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = dotRef.current, ring = ringRef.current;
    if (!fine || reduce || !dot || !ring) return;

    const root = document.documentElement;
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0, shown = false;

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform  = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(mx - rx) + Math.abs(my - ry) > 0.2 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; rx = mx; ry = my; root.classList.add("ap-cursor-on"); }
      const t = e.target as Element | null;
      root.classList.toggle("ap-cursor-hover", !!t?.closest?.(INTERACTIVE));
      root.classList.toggle("ap-cursor-text",  !!t?.closest?.(TEXT_FIELDS));
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onDown  = () => root.classList.add("ap-cursor-down");
    const onUp    = () => root.classList.remove("ap-cursor-down");
    const onLeave = () => { shown = false; root.classList.remove("ap-cursor-on"); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      root.classList.remove("ap-cursor-on", "ap-cursor-hover", "ap-cursor-text", "ap-cursor-down");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="ap-cursor-ring" aria-hidden="true" />
      <div ref={dotRef}  className="ap-cursor-dot"  aria-hidden="true" />
    </>
  );
}
