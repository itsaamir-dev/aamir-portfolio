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
        // Material 3 roles for the admin panel (values in app/admin/admin.css)
        md: {
          "primary": "var(--md-primary)",
          "on-primary": "var(--md-on-primary)",
          "primary-container": "var(--md-primary-container)",
          "on-primary-container": "var(--md-on-primary-container)",
          "secondary-container": "var(--md-secondary-container)",
          "on-secondary-container": "var(--md-on-secondary-container)",
          "tertiary": "var(--md-tertiary)",
          "tertiary-container": "var(--md-tertiary-container)",
          "on-tertiary-container": "var(--md-on-tertiary-container)",
          "error": "var(--md-error)",
          "on-error": "var(--md-on-error)",
          "error-container": "var(--md-error-container)",
          "on-error-container": "var(--md-on-error-container)",
          "surface": "var(--md-surface)",
          "on-surface": "var(--md-on-surface)",
          "on-surface-variant": "var(--md-on-surface-variant)",
          "surface-container-lowest": "var(--md-surface-container-lowest)",
          "surface-container-low": "var(--md-surface-container-low)",
          "surface-container": "var(--md-surface-container)",
          "surface-container-high": "var(--md-surface-container-high)",
          "surface-container-highest": "var(--md-surface-container-highest)",
          "outline": "var(--md-outline)",
          "outline-variant": "var(--md-outline-variant)",
          "inverse-surface": "var(--md-inverse-surface)",
          "inverse-on-surface": "var(--md-inverse-on-surface)",
          "inverse-primary": "var(--md-inverse-primary)",
          "series-1": "var(--md-series-1)",
          "series-2": "var(--md-series-2)",
        },
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
