import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy — main brand
        navy: {
          50:  "#F0F4FF",
          100: "#E0E8FF",
          200: "#C2D0F5",
          300: "#94AAEA",
          400: "#6080DC",
          500: "#3B5BCC",
          600: "#2A42A8",
          700: "#1F3088",
          800: "#0D1840",
          900: "#0A1220",
          950: "#050A14",
        },
        // Primary = Midnight Black (dark banner sections, headings)
        primary: {
          DEFAULT: "#030407",
          50:  "#F0F4FF",
          100: "#E0E8FF",
          200: "#C2D0F5",
          300: "#94AAEA",
          400: "#6080DC",
          500: "#3B5BCC",
          600: "#2A42A8",
          700: "#1F3088",
          800: "#030407",
          900: "#020305",
        },
        // "gold" now means the Electric Cobalt accent. It follows light/dark mode
        // through the --ap-accent-rgb variable in app/globals.css.
        gold: {
          DEFAULT: "rgb(var(--ap-accent-rgb) / <alpha-value>)",
          50:  "#EAF1FC",
          100: "#D0E0F8",
          200: "#A3C1F0",
          300: "#6E9BEA",
          400: "#3D78DC",
          500: "rgb(var(--ap-accent-rgb) / <alpha-value>)",
          600: "#1558C9",
          700: "#0F46A3",
        },
        // Acid Lime: highlight colour for use on dark backgrounds only
        lime: {
          DEFAULT: "#D4FF24",
          hover:   "#C2EE10",
        },
        cobalt: "#1558C9",
        dark:        "#030407",
        muted:       "#6B7A9C",
        background:  "#EEF2FF",
        surface:     "#F8FAFF",
        "dark-navy": "#030407",
      },
      fontFamily: {
        sans: [
          "-apple-system", "BlinkMacSystemFont",
          "Inter", "Segoe UI", "system-ui", "sans-serif",
        ],
      },
      borderRadius: {
        card: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        card:        "0 1px 3px rgba(10,22,64,0.06), 0 1px 2px rgba(10,22,64,0.04)",
        "card-hover":"0 8px 32px rgba(10,22,64,0.12), 0 2px 8px rgba(10,22,64,0.08)",
        glass:       "0 8px 32px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.1)",
        "glass-lg":  "0 24px 64px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.12)",
        gold:        "0 4px 24px rgba(21,88,201,0.30)",
        "gold-lg":   "0 8px 40px rgba(21,88,201,0.45)",
        glow:        "0 0 40px rgba(212,255,36,0.15)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        "fade-in":    "fadeIn 0.5s ease-out both",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in":   "scaleIn 0.2s ease-out",
        "float":      "float 4s ease-in-out infinite",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
        "spin-slow":  "spin 3s linear infinite",
      },
      keyframes: {
        fadeInUp:  { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn:    { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideDown: { "0%": { opacity: "0", transform: "translateY(-8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn:   { "0%": { opacity: "0", transform: "scale(0.95)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        float:     { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        glowPulse: { "0%,100%": { boxShadow: "0 0 20px rgba(21,88,201,0.25)" }, "50%": { boxShadow: "0 0 50px rgba(21,88,201,0.55)" } },
      },
      transitionDuration: { "400": "400ms" },
    },
  },
  plugins: [],
};
export default config;
