import Link from "next/link";
import Logo from "@/components/Logo";
import WhatsAppButton from "@/components/WhatsAppButton";
import { PROMISE, EARNINGS } from "@/lib/site";

const pageLinks = [
  { href: "/",            label: "Home" },
  { href: "/story",       label: "My Story" },
  { href: "/learn",       label: "Learn" },
  { href: "/community",   label: "Community" },
  { href: "/challenge",   label: "30-Day Challenge" },
  { href: "/blog",        label: "Blog" },
  { href: "/ebook",       label: "E-book Waiting List" },
  { href: "/resources/free-profile-websites", label: "Free Profile Sites" },
  { href: "/sitemap",     label: "Sitemap" },
  { href: "/sitemap.xml", label: "XML Sitemap" },
  { href: "/feed.xml",    label: "RSS Feed" },
];

const contactLinks = [
  { href: "mailto:aamirbashir.ahangar@gmail.com",   label: "Email" },
  { href: "https://linkedin.com/in/itsaamirbashir", label: "LinkedIn" },
  { href: "https://github.com/itsaamir-dev",        label: "GitHub" },
];

const linkCls = "inline-flex min-h-[36px] items-center text-[0.95rem] text-night-muted transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="on-dark relative z-10 pb-2">
      <div data-arrow-zone className="panel bg-night text-white">
        <div className="container-x grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.3fr_1fr_0.6fr]">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-white/85">
              Aamir Bashir · Software engineer and Top Rated Plus Upwork freelancer ({EARNINGS} earned), documenting the journey.
            </p>
            <p className="mt-3 max-w-sm text-sm text-night-muted">{PROMISE}</p>
            <WhatsAppButton location="footer" className="mt-7" />
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-white">Pages</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6">
              {pageLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkCls}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-white">Contact</h2>
            <ul className="mt-4">
              {contactLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={linkCls}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-night-line">
          <p className="container-x py-6 text-sm text-night-muted">
            © {new Date().getFullYear()} Aamir Bashir · India · Working with clients worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
