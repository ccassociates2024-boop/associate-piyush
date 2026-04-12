import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A3A6B",
          50: "#E8EEF7",
          100: "#C5D3E9",
          200: "#9FB5D8",
          300: "#7996C7",
          400: "#5C7EBB",
          500: "#3F66AE",
          600: "#2E53A0",
          700: "#1A3A6B",
          800: "#152F56",
          900: "#0F2240",
        },
        gold: {
          DEFAULT: "#C9A84C",
          50: "#FBF5E6",
          100: "#F4E4B8",
          200: "#EDD389",
          300: "#E6C25A",
          400: "#C9A84C",
          500: "#B8933A",
          600: "#9A7A2E",
          700: "#7C6125",
          800: "#5E491C",
          900: "#403213",
        },
        dark: "#1A1A2E",
        muted: "#5A6A7A",
        background: "#F7F9FC",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-hover":
          "0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 6px -1px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
