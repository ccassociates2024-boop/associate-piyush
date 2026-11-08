/* ── Associate Piyush logo mark ─────────────────────────────────────────────
   "AP" monogram: the A and P share one stem; the lime stroke rising from the
   foot of the A to the stem doubles as the A's crossbar and a growth tick.
   Drawn on a 64-unit grid. Master files: public/brand/ (SVG + PNG).        */

type Props = {
  size?: number;
  /** Tile colour behind the letters. Midnight by default, cobalt for dark UIs. */
  tile?: "midnight" | "cobalt";
  className?: string;
  title?: string;
};

const TILE = { midnight: "#030407", cobalt: "#1558C9" } as const;

export default function LogoMark({ size = 36, tile = "midnight", className, title = "Associate Piyush" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
    >
      <rect width="64" height="64" rx="15" fill={TILE[tile]} />
      <path d="M19.8 50 L30 43 V38.8 L23 43.6 Z" fill="#D4FF24" />
      <path d="M12 50 L30 14 H37.8 L19.8 50 Z M30 14 H37.8 V50 H30 Z" fill="#FFFFFF" />
      <path
        d="M37.8 14 H41 A11 11 0 0 1 41 36 H37.8 Z M37.8 21.8 H41 A3.2 3.2 0 0 1 41 28.2 H37.8 Z"
        fill="#FFFFFF"
        fillRule="evenodd"
      />
    </svg>
  );
}
