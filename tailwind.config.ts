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
        // Dark UI
        bg:      "#080A09", // deep black
        surface: "#111315", // charcoal
        ink:     "#FFFFFF",
        muted:   "#A7ADB4",
        line:    "#292E33",
        // Brand green — actions and selected highlights
        accent: {
          DEFAULT: "#39F56A", // neon green
          light:   "#39F56A", // green text on dark backgrounds
          dark:    "#0B6B35", // deep green: green text on light sections (AA contrast)
        },
        // Yellow — important numbers only, use sparingly
        highlight: "#FFD83D",
        // Primary action (WhatsApp community)
        wa: {
          DEFAULT: "#39F56A",
          ink:     "#080A09",
        },
        // Light sections
        paper:        "#F6F7F5",
        "ink-dark":   "#111315",
        "muted-dark": "#4A5058",
        "line-light": "#E3E6E2",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: {
        content: "1200px",
        prose:   "760px",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
