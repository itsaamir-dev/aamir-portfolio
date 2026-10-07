"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { WHATSAPP_URL } from "@/lib/site";
import { trackJoinCommunity } from "@/lib/analytics";

const links = [
  { href: "/",           label: "Home" },
  { href: "/#story",     label: "My Story" },
  { href: "/#learn",     label: "Learn" },
  { href: "/#community", label: "Community" },
  { href: "/#challenge", label: "30-Day Challenge" },
  { href: "/blog",       label: "Blog" },
];

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href === "/blog") return pathname.startsWith("/blog");
  return false;
}

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="text-xl font-bold tracking-tight text-ink">
      AB<span className="text-accent">.</span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
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

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-line bg-[rgba(11,13,16,0.92)] backdrop-blur-md">
        <nav aria-label="Main" className="container-x flex h-16 items-center justify-between gap-6">
          <Logo />

          <ul className="hidden items-center gap-7 lg:flex">
            {links.map(({ href, label }) => {
              const active = isActive(href, pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-1 text-[0.95rem] font-medium transition-colors duration-200
                      after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-accent
                      after:transition-transform after:duration-300
                      ${active ? "text-ink after:scale-x-100" : "text-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100"}`}
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
            className="btn-wa hidden !min-h-[44px] !rounded-[10px] !px-4 !py-0 !text-sm lg:inline-flex"
          >
            <Icon name="chat" size={16} />
            Join Free Community
          </a>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-ink lg:hidden"
          >
            <Icon name="menu" size={22} />
          </button>
        </nav>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[110] bg-black/60 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        id="mobile-menu"
        aria-label="Menu"
        className={`fixed inset-y-0 right-0 z-[120] flex w-[min(20rem,85vw)] flex-col border-l border-line bg-bg
                    transition-[transform,visibility] duration-300 ease-out lg:hidden ${
          open ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Logo onClick={() => setOpen(false)} />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:text-ink"
          >
            <Icon name="x" size={22} />
          </button>
        </div>

        <ul className="flex flex-1 flex-col gap-1 px-3 py-4">
          {links.map(({ href, label }) => {
            const active = isActive(href, pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[48px] items-center rounded-lg px-4 text-base font-medium transition-colors
                    ${active ? "bg-surface text-ink" : "text-muted hover:bg-surface hover:text-ink"}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-line p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackJoinCommunity("mobile_menu")}
            className="btn-wa w-full"
          >
            <Icon name="chat" size={18} />
            Join Free Community
          </a>
        </div>
      </aside>
    </>
  );
}
