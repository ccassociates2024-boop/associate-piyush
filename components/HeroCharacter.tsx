"use client";

import { useEffect, useRef, useState } from "react";

/* ── Cursor-tracking character (home hero) ────────────────────────────────
   Plays a "head turn" as an image sequence: the frame shown depends on where
   the mouse is horizontally, so the character appears to look at the cursor.

   Files it expects (created from your Google Flow video):
     public/hero/frames.json   → { "count": 48, "pattern": "/hero/frames/f_{i}.webp",
                                   "pad": 3, "width": 900, "height": 1100 }
     public/hero/frames/f_001.webp … f_048.webp
   Frame 1 = looking far LEFT, last frame = looking far RIGHT.

   Single-image mode: with "count": 1 there is no head turn — the portrait
   instead tilts and shifts in 3D toward the cursor.

   If frames.json is missing, this renders nothing and the hero keeps its
   dot-grid background, so the site never shows a broken image.            */

type Manifest = { count: number; pattern: string; pad?: number; width: number; height: number };

const frameUrl = (m: Manifest, i: number) =>
  m.pattern.replace("{i}", String(i + 1).padStart(m.pad ?? 3, "0"));

export default function HeroCharacter() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [ready, setReady] = useState(false);

  // 1. Load the manifest (silently skip if not there yet)
  useEffect(() => {
    let alive = true;
    fetch("/hero/frames.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => { if (alive && m && m.count >= 1) setManifest(m); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // 2. Preload frames, then draw the one matching the cursor position
  useEffect(() => {
    if (!manifest) return;
    const canvas = canvasRef.current, wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx) return;

    const frames: HTMLImageElement[] = [];
    let raf = 0;
    const mid = Math.floor(manifest.count / 2);
    let target = mid, current = mid, drawn = -1;
    let tiltX = 0, tiltY = 0, tx = 0, ty = 0;

    canvas.width = manifest.width;
    canvas.height = manifest.height;

    const draw = (i: number) => {
      const img = frames[i];
      if (!img || !img.complete || !img.naturalWidth) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawn = i;
    };

    for (let i = 0; i < manifest.count; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(manifest, i);
      img.onload = () => {
        // Show the character as soon as the resting (middle) frame is in;
        // the other frames keep loading in the background.
        if (i === mid) { draw(mid); setReady(true); }
      };
      img.onerror = () => { if (i === mid) setReady(false); };
      frames.push(img);
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const single = manifest.count === 1;
    const TILT_X = single ? 16 : 8;   // stronger 3D turn when there is no head-turn video
    const TILT_Y = single ? 10 : 5;
    const SHIFT  = single ? 14 : 0;   // px the portrait slides toward the cursor
    let sx = 0, shiftX = 0;

    const tick = () => {
      current += (target - current) * 0.2;
      tiltX += (tx - tiltX) * 0.12;
      tiltY += (ty - tiltY) * 0.12;
      const idx = Math.round(current);
      if (idx !== drawn) draw(idx);
      shiftX += (sx - shiftX) * 0.12;
      wrap.style.transform =
        `perspective(1200px) translateX(${shiftX.toFixed(1)}px) rotateY(${tiltX.toFixed(2)}deg) rotateX(${tiltY.toFixed(2)}deg)`;
      const moving = Math.abs(target - current) > 0.05 || Math.abs(tx - tiltX) > 0.02 || Math.abs(ty - tiltY) > 0.02 || Math.abs(sx - shiftX) > 0.1;
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const aim = (clientX: number, clientY: number) => {
      const nx = Math.min(Math.max(clientX / window.innerWidth, 0), 1);   // 0 = left edge
      const ny = Math.min(Math.max(clientY / window.innerHeight, 0), 1);
      target = nx * (manifest.count - 1);
      tx = (nx - 0.5) * TILT_X;   // 3D tilt toward the cursor
      ty = (0.5 - ny) * TILT_Y;
      sx = (nx - 0.5) * 2 * SHIFT;
      kick();
    };

    const onPointer = (e: PointerEvent) => aim(e.clientX, e.clientY);
    const onLeave = () => { target = mid; tx = 0; ty = 0; sx = 0; kick(); };

    if (!reduce) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("mouseleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [manifest]);

  if (!manifest) return null;

  return (
    <div className={`hero-character${ready ? " is-ready" : ""}`} aria-hidden="true">
      <div className="hero-character__halo" />
      <div ref={wrapRef} className="hero-character__frame">
        <canvas ref={canvasRef} className="hero-character__canvas" />
      </div>
    </div>
  );
}
