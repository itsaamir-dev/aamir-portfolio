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
        bg:      "#0B0D10",
        surface: "#12161C",
        ink:     "#F5F7FA",
        muted:   "#A7AFBA",
        line:    "#252A33",
        // Brand accent — use sparingly
        accent: {
          DEFAULT: "#7C5CFF",
          light:   "#A78BFA",
          dark:    "#5B3FE0", // accent text on light sections (AA contrast)
        },
        // WhatsApp action only
        wa: {
          DEFAULT: "#25D366",
          ink:     "#07120A",
        },
        // Light sections
        paper:        "#F7F8FA",
        "ink-dark":   "#111827",
        "muted-dark": "#4B5563",
        "line-light": "#E5E7EB",
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
