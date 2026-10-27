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
        // Light UI — white canvas, grey trays, near-black ink
        bg:      "#FFFFFF",
        surface: "#F2F2F2", // tray / card grey
        "surface-2": "#ECECEC",
        ink:     "#131313",
        muted:   "#585858", // secondary text (7:1 on white)
        line:    "#E4E4E4",
        // Dark panels (community, footer, code)
        night: {
          DEFAULT: "#131313",
          2:       "#1E1E1E",
          line:    "#2F2F2F",
          muted:   "#A3A3A3",
        },
        // Brand lime — fills only (never text on white)
        accent: {
          DEFAULT: "#D6FD70",
          strong:  "#C4F43F", // hover
          dark:    "#3D6B00", // green text on white (AA)
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
