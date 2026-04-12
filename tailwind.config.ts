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
        // Primary = Purple-600 (authority + trust)
        primary: {
          DEFAULT: "#534AB7",
          50: "#EEEDFE",
          100: "#CECBF6",
          200: "#AFA9EC",
          300: "#9F96E4",
          400: "#7F77DD",
          500: "#534AB7",
          600: "#534AB7",
          700: "#3C3489",
          800: "#3C3489",
          900: "#26215C",
        },
        // Custom purple palette overrides Tailwind defaults
        purple: {
          50: "#EEEDFE",
          100: "#CECBF6",
          200: "#AFA9EC",
          400: "#7F77DD",
          600: "#534AB7",
          800: "#3C3489",
          900: "#26215C",
        },
        // Gold accent
        gold: {
          DEFAULT: "#C9A84C",
          50: "#FBF5E6",
          100: "#F4E4B8",
          200: "#EDD389",
          300: "#E6C25A",
          400: "#C9A84C",
          500: "#B8973A",
          600: "#9A7A2E",
          700: "#7C6125",
          800: "#5E491C",
          900: "#403213",
        },
        dark: "#26215C",       // deepest text / hero headlines
        muted: "#7F77DD",      // subheadings, helper text (purple-400)
        background: "#F5F3FF", // page / section backgrounds
        surface: "#F5F3FF",    // alias
        "dark-navy": "#1A1630", // footer, dark sections
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(83,74,183,0.08), 0 1px 2px -1px rgba(83,74,183,0.06)",
        "card-hover":
          "0 4px 16px 0 rgba(83,74,183,0.14), 0 2px 6px -1px rgba(83,74,183,0.10)",
        gold: "0 4px 16px 0 rgba(201,168,76,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
