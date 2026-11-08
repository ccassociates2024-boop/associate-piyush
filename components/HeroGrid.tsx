"use client";

import { useEffect, useRef } from "react";

/* ── Interactive cursor-glow dot grid ─────────────────────────────────────
   Sits behind the home hero. A faint dot grid covers the section; dots near
   the mouse light up in the accent colour and a soft glow follows the cursor.
   • Mouse devices: glow eases toward the pointer, rests when it leaves.
   • Touch devices: glow drifts slowly on its own while the hero is visible.
   • prefers-reduced-motion: stays still at its resting spot.
   Styling lives in app/globals.css under "HERO GRID".                      */

const REST = { x: 0.72, y: 0.32 };

export default function HeroGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let x = REST.x, y = REST.y;          // current position (0–1)
    let tx = REST.x, ty = REST.y;        // target position
    let raf = 0;
    let visible = true;

    const apply = () => {
      el.style.setProperty("--gx", `${(x * 100).toFixed(2)}%`);
      el.style.setProperty("--gy", `${(y * 100).toFixed(2)}%`);
    };

    const tick = (t: number) => {
      if (!finePointer) {
        tx = 0.5 + 0.32 * Math.sin(t / 4300);
        ty = 0.42 + 0.22 * Math.cos(t / 5600);
      }
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      apply();

      const settled = Math.abs(tx - x) < 0.0008 && Math.abs(ty - y) < 0.0008;
      if (visible && (!finePointer || !settled)) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const start = () => { if (!raf && visible) raf = requestAnimationFrame(tick); };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
      el.classList.add("is-active");
      start();
    };
    const onLeave = () => {
      tx = REST.x; ty = REST.y;
      el.classList.remove("is-active");
      start();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(host);

    if (finePointer) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    } else {
      el.classList.add("is-active");
      start();
    }
    apply();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="hero-grid" aria-hidden="true">
      <div className="hero-grid__glow" />
      <div className="hero-grid__dots" />
      <div className="hero-grid__lit" />
    </div>
  );
}
