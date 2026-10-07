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
  { href: "/#story",     label: "My Story" },
  { href: "/#learn",     label: "What You’ll Learn" },
  { href: "/#community", label: "Community" },
  { href: "/#challenge", label: "30-Day Challenge" },
  { href: "/#faq",       label: "FAQ" },
  { href: "/blog",       label: "Blog" },
];

export default function SitemapPage() {
  const posts = getAllPosts();
  const byCategory = posts.reduce<Record<string, typeof posts>>((acc, p) => {
    (acc[p.catLabel] ??= []).push(p);
    return acc;
  }, {});

  return (
    <>
      <main className="container-x pb-20 pt-32 sm:pt-36">
        <p className="eyebrow">Sitemap</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Everything on this site</h1>
        <p className="lead mt-4 text-muted">
          {posts.length} articles. Also available as <a href="/sitemap.xml" className="text-accent-light underline underline-offset-4">XML</a>{" "}
          and an <a href="/feed.xml" className="text-accent-light underline underline-offset-4">RSS feed</a>.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-ink">Pages</h2>
          <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map(p => (
              <li key={p.href}>
                <Link href={p.href} className="inline-flex min-h-[40px] items-center text-muted hover:text-ink">{p.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        {Object.entries(byCategory).map(([cat, list]) => (
          <section key={cat} className="mt-12">
            <h2 className="text-2xl font-bold text-ink">{cat} <span className="text-base font-medium text-muted">({list.length})</span></h2>
            <ul className="mt-4 grid gap-x-8 gap-y-1 lg:grid-cols-2">
              {list.map(p => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="inline-flex min-h-[40px] items-center py-1 text-muted hover:text-ink">
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
