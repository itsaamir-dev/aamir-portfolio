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
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-16 py-5 transition-all duration-300 ${
        scrolled ? "bg-[rgba(13,27,42,0.97)] backdrop-blur-xl border-b border-[rgba(201,168,76,0.12)]"
                 : "bg-gradient-to-b from-[rgba(13,27,42,0.98)] to-transparent"
      }`}
    >
      <Link href="/" className="font-display text-xl font-bold text-gold">AB.</Link>
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
    </nav>
  );
}
