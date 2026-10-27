"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { THEME_KEY } from "@/lib/theme";

/** Light/dark switch. Saves the choice; until then the device setting applies. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));

    // Follow device changes while the visitor hasn't picked a theme
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null;
      try { saved = localStorage.getItem(THEME_KEY); } catch { /* private mode */ }
      if (saved) return;
      document.documentElement.classList.toggle("dark", e.matches);
      setDark(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem(THEME_KEY, next ? "dark" : "light"); } catch { /* private mode */ }
    setDark(next);
  };

  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-surface-2 ${className}`}
    >
      {/* Before hydration the icon is unknown; keep the button's space */}
      {dark === null ? <span className="h-5 w-5" /> : <Icon name={dark ? "sun" : "moon"} size={19} />}
    </button>
  );
}
