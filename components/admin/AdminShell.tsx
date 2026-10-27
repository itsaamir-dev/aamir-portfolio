"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import Symbol from "@/components/admin/Symbol";
import { logout } from "@/app/admin/actions";
import Snackbar from "@/components/admin/Snackbar";

const NAV = [
  { href: "/admin",          label: "Overview", icon: "space_dashboard" },
  { href: "/admin/leads",    label: "Leads",    icon: "group" },
  { href: "/admin/settings", label: "Setup",    icon: "settings" },
];

const isActive = (href: string, path: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    setTheme((document.getElementById("admin-root")?.getAttribute("data-theme") as "dark" | "light") ?? "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.getElementById("admin-root")?.setAttribute("data-theme", next);
    try { localStorage.setItem("bwa-admin-theme", next); } catch { /* storage blocked */ }
    setTheme(next);
  };
  return (
    <button type="button" onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="state-layer grid h-12 w-12 place-items-center rounded-full text-md-on-surface-variant">
      <Symbol name={theme === "dark" ? "light_mode" : "dark_mode"} />
    </button>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const current = NAV.find(n => isActive(n.href, path));

  return (
    <div className="min-h-dvh lg:pl-24">
      {/* Navigation rail — desktop */}
      <nav aria-label="Admin" className="fixed inset-y-0 left-0 z-30 hidden w-24 flex-col items-center gap-3 bg-md-surface py-6 lg:flex">
        <Link href="/" aria-label="Back to buildwithaamir.com" title="View site"
              className="state-layer mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-md-primary-container text-lg font-bold text-md-on-primary-container">
          AB
        </Link>
        {NAV.map(n => {
          const active = isActive(n.href, path);
          return (
            <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}
                  className="group flex w-full flex-col items-center gap-1 py-1 text-xs font-medium">
              <span className={`state-layer grid h-8 w-14 place-items-center rounded-full transition-colors duration-200
                                ${active ? "bg-md-secondary-container text-md-on-secondary-container" : "text-md-on-surface-variant"}`}>
                <Symbol name={n.icon} fill={active} />
              </span>
              <span className={active ? "text-md-on-surface" : "text-md-on-surface-variant"}>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Top app bar */}
      <header className="sticky top-0 z-20 flex h-16 items-center gap-2 bg-md-surface/95 px-4 backdrop-blur sm:px-6">
        <h1 className="text-[1.375rem] font-normal leading-7 text-md-on-surface">{current?.label ?? "Admin"}</h1>
        <span className="ml-1 hidden rounded-lg border border-md-outline-variant px-2 py-0.5 text-xs font-medium text-md-on-surface-variant sm:inline">
          E-book waiting list
        </span>
        <div className="ml-auto flex items-center">
          <a href="/ebook" target="_blank" rel="noopener noreferrer" aria-label="Open the e-book page"
             className="state-layer grid h-12 w-12 place-items-center rounded-full text-md-on-surface-variant">
            <Symbol name="open_in_new" />
          </a>
          <ThemeToggle />
          <form action={logout}>
            <button type="submit" aria-label="Sign out"
                    className="state-layer grid h-12 w-12 place-items-center rounded-full text-md-on-surface-variant">
              <Symbol name="logout" />
            </button>
          </form>
        </div>
      </header>

      <main id="admin-main" className="px-4 pb-28 pt-2 sm:px-6 lg:pb-12">{children}</main>
      <Snackbar />

      {/* Navigation bar — phones and tablets */}
      <nav aria-label="Admin" className="fixed inset-x-0 bottom-0 z-30 flex h-20 bg-md-surface-container pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV.map(n => {
          const active = isActive(n.href, path);
          return (
            <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}
                  className="flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium">
              <span className={`state-layer grid h-8 w-16 place-items-center rounded-full
                                ${active ? "bg-md-secondary-container text-md-on-secondary-container" : "text-md-on-surface-variant"}`}>
                <Symbol name={n.icon} fill={active} />
              </span>
              <span className={active ? "text-md-on-surface" : "text-md-on-surface-variant"}>{n.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
