"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import { WHATSAPP_URL, CTA_LABEL } from "@/lib/site";
import { trackJoinCommunity } from "@/lib/analytics";

const links = [
  { href: "/",           label: "Home" },
  { href: "/story",      label: "My Story" },
  { href: "/learn",      label: "Learn" },
  { href: "/community",  label: "Community" },
  { href: "/challenge",  label: "30-Day Challenge" },
  { href: "/blog",       label: "Blog" },
  { href: "/ebook",      label: "E-book" },
];

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Lock body scroll and allow Escape to close while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Hairline under the bar once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a href="#main"
         className="sr-only z-[130] rounded-full bg-ink px-4 py-2 font-mono text-sm uppercase tracking-[0.1em] text-accent focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>

      <header className={`fixed inset-x-0 top-0 z-[100] bg-white/85 backdrop-blur-md transition-shadow duration-300
                          ${scrolled ? "shadow-[0_1px_0_#E4E4E4]" : ""}`}>
        <nav aria-label="Main" className="container-x flex h-16 items-center justify-between gap-3 lg:h-[72px]">
          <Logo />

          <ul className="hidden items-center gap-0.5 xl:flex">
            {links.map(({ href, label }) => {
              const active = isActive(href, pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-[40px] items-center whitespace-nowrap rounded-full px-2.5 font-display text-[0.94rem] 2xl:px-3.5 2xl:text-[0.975rem]
                                font-medium tracking-[-0.01em] transition-colors duration-200
                                ${active ? "bg-surface text-ink" : "text-muted hover:bg-surface hover:text-ink"}`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackJoinCommunity("navbar")}
            className="btn-wa hidden !min-h-[42px] whitespace-nowrap !px-4 font-display !text-[0.94rem] font-semibold !normal-case !tracking-[-0.01em] xl:inline-flex"
          >
            <Icon name="chat" size={16} />
            {CTA_LABEL}
          </a>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-1 flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-surface-2 xl:hidden"
          >
            <Icon name="menu" size={20} />
          </button>
        </nav>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[110] bg-ink/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer — an inset panel like the rest of the site */}
      <aside
        id="mobile-menu"
        aria-label="Menu"
        className={`fixed bottom-2 right-2 top-2 z-[120] flex w-[min(21rem,calc(100vw-1rem))] flex-col rounded-panel bg-white
                    shadow-[0_20px_60px_rgba(19,19,19,0.18)] transition-[transform,visibility] duration-300 ease-out xl:hidden ${
          open ? "visible translate-x-0" : "invisible translate-x-[110%]"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo onClick={() => setOpen(false)} />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="-mr-1 flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink hover:bg-surface-2"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3">
          {links.map(({ href, label }) => {
            const active = isActive(href, pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[52px] items-center justify-between rounded-2xl px-4 font-display text-lg font-medium tracking-[-0.02em] transition-colors
                    ${active ? "bg-surface text-ink" : "text-muted hover:bg-surface hover:text-ink"}`}
                >
                  {label}
                  {active && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink ring-4 ring-accent" />}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackJoinCommunity("mobile_menu")}
            className="btn-wa w-full font-display !text-base font-semibold !normal-case !tracking-[-0.01em]"
          >
            <Icon name="chat" size={18} />
            {CTA_LABEL}
          </a>
        </div>
      </aside>
    </>
  );
}
