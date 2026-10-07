import Link from "next/link";
import { PROMISE } from "@/lib/site";

const pageLinks = [
  { href: "/",            label: "Home" },
  { href: "/#story",      label: "My Story" },
  { href: "/#community",  label: "Community" },
  { href: "/blog",        label: "Blog" },
  { href: "/sitemap.xml", label: "Sitemap" },
];

const contactLinks = [
  { href: "mailto:aamirbashir.ahangar@gmail.com",   label: "Email" },
  { href: "https://linkedin.com/in/itsaamirbashir", label: "LinkedIn" },
  { href: "https://github.com/itsaamir-dev",        label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-[1.5fr_1fr_1fr] sm:py-16">
        <div>
          <Link href="/" className="text-xl font-bold tracking-tight text-ink">
            AB<span className="text-accent">.</span>
          </Link>
          <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-muted">
            Aamir Bashir · Software engineer and Top Rated Plus freelancer, documenting the journey.
          </p>
          <p className="mt-3 text-sm text-muted">{PROMISE}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink">Pages</h2>
          <ul className="mt-4 space-y-1">
            {pageLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-[36px] items-center text-[0.95rem] text-muted transition-colors hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink">Contact</h2>
          <ul className="mt-4 space-y-1">
            {contactLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center text-[0.95rem] text-muted transition-colors hover:text-ink"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="container-x py-6 text-sm text-muted">
          © {new Date().getFullYear()} Aamir Bashir · India · Working with clients worldwide
        </p>
      </div>
    </footer>
  );
}
