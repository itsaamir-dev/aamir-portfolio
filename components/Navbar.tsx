"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/#about",      label: "About" },
  { href: "/#skills",     label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects",   label: "Projects" },
  { href: "/#freelance",  label: "Freelance" },
  { href: "/blog",        label: "Blog" },
  { href: "/#contact",    label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-16 py-5 transition-all duration-300 ${
          scrolled ? "bg-[rgba(13,27,42,0.97)] backdrop-blur-xl border-b border-[rgba(201,168,76,0.12)]"
                   : "bg-gradient-to-b from-[rgba(13,27,42,0.98)] to-transparent"
        }`}
      >
        <Link href="/" className="font-display text-xl font-bold text-gold">AB.</Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-9 list-none">
          {links.map(({ href, label }) => {
            const active = pathname === href || (href === "/blog" && pathname.startsWith("/blog"));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`font-mono text-[0.7rem] tracking-[0.12em] uppercase relative transition-colors duration-200
                    after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-px after:bg-gold
                    after:transition-transform after:duration-300 after:origin-left
                    ${active ? "text-gold after:scale-x-100" : "text-light-blue hover:text-gold after:scale-x-0 hover:after:scale-x-100"}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
        >
          <span className="block w-6 h-px bg-gold" />
          <span className="block w-4 h-px bg-gold" />
          <span className="block w-6 h-px bg-gold" />
        </button>
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[120] w-72 bg-[#0D1B2A] border-r border-[rgba(201,168,76,0.15)]
                    flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(201,168,76,0.1)]">
          <Link href="/" onClick={() => setOpen(false)} className="font-display text-xl font-bold text-gold">AB.</Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center text-light-blue hover:text-gold transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <line x1="1" y1="1" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="17" y1="1" x2="1" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <ul className="flex flex-col gap-1 px-4 py-6 flex-1 list-none">
          {links.map(({ href, label }, i) => {
            const active = pathname === href || (href === "/blog" && pathname.startsWith("/blog"));
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                  className={`flex items-center gap-3 px-4 py-3 rounded font-mono text-[0.72rem] tracking-[0.14em] uppercase
                              transition-all duration-200
                              ${active
                                ? "text-gold bg-[rgba(201,168,76,0.08)]"
                                : "text-light-blue hover:text-gold hover:bg-[rgba(201,168,76,0.05)]"
                              }`}
                >
                  {active && <span className="block w-1 h-1 rounded-full bg-gold flex-shrink-0" />}
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Drawer footer accent */}
        <div className="px-6 py-5 border-t border-[rgba(201,168,76,0.1)]">
          <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-mid-gray">Senior Software Engineer</span>
        </div>
      </aside>
    </>
  );
}
