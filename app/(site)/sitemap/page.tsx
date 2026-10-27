import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/posts";
import { ogDefaults } from "@/lib/seo";

export const metadata: Metadata = {
  title:       "Sitemap",
  description: "Every page and article on Build With Aamir, in one place.",
  alternates:  { canonical: "/sitemap" },
  openGraph:   { ...ogDefaults, url: "/sitemap", title: "Sitemap", description: "Every page and article on Build With Aamir." },
};

const pages = [
  { href: "/",           label: "Home" },
  { href: "/story",      label: "My Story" },
  { href: "/learn",      label: "Learn Freelancing" },
  { href: "/community",  label: "Free WhatsApp Community" },
  { href: "/challenge",  label: "30-Day Challenge" },
  { href: "/ebook",      label: "The Freelancing Playbook (E-book Waiting List)" },
  { href: "/#faq",       label: "FAQ" },
  { href: "/blog",       label: "Blog" },
  { href: "/resources/free-profile-websites", label: "Free Profile Websites" },
];

export default function SitemapPage() {
  const posts = getAllPosts();
  const byCategory = posts.reduce<Record<string, typeof posts>>((acc, p) => {
    (acc[p.catLabel] ??= []).push(p);
    return acc;
  }, {});

  return (
    <>
      <header className="pt-[72px] lg:pt-[80px]">
        <div className="panel bg-surface py-12 sm:py-16">
          <div className="container-x hero-stagger">
            <p className="eyebrow">Sitemap</p>
            <h1 className="h1 mt-4 text-ink">Everything on this site</h1>
            <p className="lead mt-4 text-muted">
              {posts.length} articles. Also available as <a href="/sitemap.xml" className="link">XML</a>{" "}
              and an <a href="/feed.xml" className="link">RSS feed</a>.
            </p>
          </div>
        </div>
      </header>

      <main className="container-x pb-20 pt-12 sm:pt-16">
        <section className="tray">
          <div className="tray-card">
            <h2 className="text-[1.75rem] font-medium tracking-[-0.045em] text-ink">Pages</h2>
            <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map(p => (
                <li key={p.href}>
                  <Link href={p.href} className="inline-flex min-h-[40px] items-center text-muted transition-colors hover:text-ink hover:underline">{p.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {Object.entries(byCategory).map(([cat, list]) => (
          <section key={cat} className="mt-12">
            <h2 className="flex items-center gap-3 text-[1.75rem] font-medium tracking-[-0.045em] text-ink">
              {cat} <span className="rounded-full bg-surface px-2.5 py-0.5 font-mono text-sm font-normal text-muted">({list.length})</span>
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-1 border-t border-line pt-3 lg:grid-cols-2">
              {list.map(p => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="inline-flex min-h-[40px] items-center py-1 text-muted transition-colors hover:text-ink hover:underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
