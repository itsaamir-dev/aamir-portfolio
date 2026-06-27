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
        navy:  "#0D1B2A",
        navy2: "#1B2D42",
        gold:  "#C9A84C",
        gold2: "#E8C97A",
        cream: "#F5EFE0",
        "off-white": "#FAFAF8",
        "mid-gray": "#8A9BB0",
        "light-blue": "#D4E1F0",
        accent: "#2A6496",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body:    ["var(--font-space-grotesk)", "sans-serif"],
        mono:    ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        fadeUp:   { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn:   { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        scrollPulse: { "0%,100%": { opacity: "0.4", transform: "scaleY(1)" }, "50%": { opacity: "1", transform: "scaleY(1.15)" } },
      },
      animation: {
        "fade-up":      "fadeUp 0.8s ease forwards",
        "fade-up-d1":   "fadeUp 0.8s 0.2s ease forwards",
        "fade-up-d2":   "fadeUp 0.8s 0.35s ease forwards",
        "fade-up-d3":   "fadeUp 0.8s 0.5s ease forwards",
        "fade-up-d4":   "fadeUp 0.8s 0.65s ease forwards",
        "fade-up-d5":   "fadeUp 0.8s 0.8s ease forwards",
        "fade-in":      "fadeIn 1s 1.2s ease forwards",
        "scroll-pulse": "scrollPulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
