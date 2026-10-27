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
        // Themeable UI — values are RGB channels in app/globals.css
        // (:root = light, .dark = dark), so one class works in both modes.
        bg:            "rgb(var(--c-bg) / <alpha-value>)",
        surface:       "rgb(var(--c-surface) / <alpha-value>)",   // tray / card grey
        "surface-2":   "rgb(var(--c-surface-2) / <alpha-value>)",
        card:          "rgb(var(--c-card) / <alpha-value>)",      // cards inside trays
        ink:           "rgb(var(--c-ink) / <alpha-value>)",       // text + strong fills
        "on-ink":      "rgb(var(--c-on-ink) / <alpha-value>)",    // text on an ink fill
        muted:         "rgb(var(--c-muted) / <alpha-value>)",     // secondary text
        line:          "rgb(var(--c-line) / <alpha-value>)",
        "line-strong": "rgb(var(--c-line-strong) / <alpha-value>)",
        // Dark panels (community, footer, code) — dark in both modes
        night: {
          DEFAULT: "rgb(var(--c-night) / <alpha-value>)",
          2:       "rgb(var(--c-night-2) / <alpha-value>)",
          line:    "rgb(var(--c-night-line) / <alpha-value>)",
          muted:   "#A3A3A3",
        },
        // Brand lime — fills only (never text on white)
        accent: {
          DEFAULT: "#D6FD70",
          strong:  "#C4F43F", // hover
          dark:    "rgb(var(--c-accent-text) / <alpha-value>)", // green text on the page (AA both modes)
        },
        // Hero / CTA sky panels
        sky: {
          top:    "#123893",
          mid:    "#1F56C9",
          bottom: "#3C80E0",
        },
        // Primary action (WhatsApp community)
        wa: {
          DEFAULT: "#D6FD70",
          ink:     "#131313",
        },
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
        sans:    ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        panel: "1.5rem", // inset panels and trays
        card:  "1.25rem", // cards inside trays
      },
      maxWidth: {
        content: "1200px",
        prose:   "760px",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        float:  { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out both",
        float:     "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
