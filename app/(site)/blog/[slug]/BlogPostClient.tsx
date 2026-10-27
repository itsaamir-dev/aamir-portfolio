"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { Breadcrumb } from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import EbookBanner from "@/components/ebook/EbookBanner";
import type { BlogPost } from "@/lib/data";
import type { BlogSummary } from "@/lib/posts";
import { PROMISE } from "@/lib/site";

const chip = "chip !min-h-[40px] !text-sm";

export default function BlogPostClient({
  post, prev, next, related,
}: { post: BlogPost; prev: BlogSummary | null; next: BlogSummary | null; related: BlogSummary[] }) {

  const [progress, setProgress]   = useState(0);
  const [activeToc, setActiveToc] = useState(post.tocItems[0]?.id ?? "");
  const [copied, setCopied]       = useState(false);
  const [url, setUrl]             = useState("");

  useEffect(() => {
    setUrl(window.location.href);
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active heading = the last one scrolled above the reading line (just
  // below the fixed header), so TOC jumps and normal reading both update it.
  // Queried on every update: the post HTML can be re-rendered after mount.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const headings = Array.from(document.querySelectorAll<HTMLElement>(".post-content h2[id], .post-content h3[id]"));
      let current = headings[0]?.id ?? "";
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= 140) current = h.id; else break;
      }
      setActiveToc(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { label: "X / Twitter", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}` },
    { label: "LinkedIn",    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  return (
    <>
      <div id="read-progress" aria-hidden="true" style={{ width: `${progress}%` }} />

      {/* Hero */}
      <header className="pt-[72px] lg:pt-[80px]">
        <div className="panel bg-surface pb-12 pt-10 sm:pb-16 sm:pt-14">
          <div className="hero-stagger mx-auto max-w-[52rem] px-5 sm:px-6">
            <Breadcrumb items={[{ href: "/blog", label: "Blog" }, { label: post.catLabel }]} />

            <h1 className="mt-8 text-[2.1rem] font-medium leading-[1.08] tracking-[-0.05em] text-ink sm:text-[2.75rem] lg:text-[3.4rem]">
              {post.title}
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-mono text-sm text-accent">AB</div>
                <div>
                  <strong className="block text-[0.95rem] font-semibold text-ink">Aamir Bashir</strong>
                  <span>Senior Software Engineer</span>
                </div>
              </div>
              <span className="rounded-full bg-white px-3 py-1">{post.date}</span>
              <span className="rounded-full bg-white px-3 py-1">{post.readTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="container-x grid grid-cols-1 gap-16 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_280px]">

        <article className="mx-auto w-full max-w-prose">
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-line pt-6">
            <span className="mr-2 font-mono text-xs uppercase tracking-[0.1em] text-muted">Tags:</span>
            {post.tags.map(t => (
              <span key={t} className="rounded-full bg-surface px-3 py-1 text-sm text-ink">{t}</span>
            ))}
          </div>

          {/* Share */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-xs uppercase tracking-[0.1em] text-muted">Share:</span>
            {shareLinks.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={chip}>{s.label}</a>
            ))}
            <button onClick={handleCopy} className={chip} aria-live="polite">
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>

          {/* Author card */}
          <div className="card mt-10 flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-lg text-accent">AB</div>
            <div>
              <strong className="block text-lg font-semibold text-ink">Aamir Bashir</strong>
              <span className="mt-0.5 block text-sm font-medium text-accent-dark">Senior Software Engineer · Top Rated Plus on Upwork</span>
              <p className="mt-3 text-base leading-relaxed text-muted">
                8+ years building mobile and full-stack applications. I write about Android architecture, API design,
                and the realities of freelancing with international clients.
              </p>
            </div>
          </div>

          {/* Community CTA */}
          <div className="on-dark relative mt-2 overflow-hidden rounded-card bg-night p-6 text-white sm:p-8">
            <div className="relative">
              <h2 className="text-[1.5rem] font-medium tracking-[-0.04em]">Build With Aamir Community</h2>
              <p className="mt-2 text-base text-night-muted">{PROMISE}</p>
              <WhatsAppButton location="blog_post" className="mt-5" />
            </div>
          </div>

          {/* E-book waiting list — only on freelancing/career articles */}
          {(post.cat === "freelance" || post.cat === "career") && (
            <EbookBanner location="blog_post" className="mt-2" />
          )}
        </article>

        {/* Sidebar */}
        <aside className="sticky top-28 hidden h-fit flex-col gap-2 lg:flex">
          {post.tocItems.length > 0 && (
            <nav aria-label="In this article" className="card p-5">
              <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-ink">In This Article</h2>
              <ul className="mt-4 space-y-1 border-l border-[#D6D6D6]">
                {post.tocItems.map(({ id, label }) => (
                  <li key={id}>
                    <a href={`#${id}`}
                      aria-current={activeToc === id ? "location" : undefined}
                      className={`-ml-px block border-l-2 py-1.5 pl-3 text-[0.9rem] leading-snug transition-colors duration-200
                                  ${activeToc === id ? "border-ink font-medium text-ink" : "border-transparent text-muted hover:text-ink"}`}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {related.length > 0 && (
            <div className="card p-5">
              <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-ink">Related Posts</h2>
              <div className="mt-3">
                {related.map(r => (
                  <Link key={r.slug} href={`/blog/${r.slug}`}
                    className="group block border-b border-[#DEDEDE] py-3 last:border-none">
                    <span className="block font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">{r.catLabel}</span>
                    <span className="mt-1 block text-[0.9rem] font-medium leading-snug text-ink group-hover:underline">{r.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Prev / Next */}
      <nav aria-label="More posts" className="container-x grid grid-cols-1 gap-2 pb-16 md:grid-cols-2">
        {prev ? (
          <Link href={`/blog/${prev.slug}`}
            className="group card flex items-center gap-4 transition-colors duration-200 hover:bg-surface-2">
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 rotate-180 items-center justify-center rounded-full bg-white transition-colors group-hover:bg-accent">
              <Icon name="arrow" size={18} />
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted">← Previous</span>
              <span className="text-base font-medium leading-snug text-ink">{prev.title}</span>
            </span>
          </Link>
        ) : <div />}
        {next && (
          <Link href={`/blog/${next.slug}`}
            className="group card flex flex-row-reverse items-center gap-4 text-right transition-colors duration-200 hover:bg-surface-2">
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white transition-colors group-hover:bg-accent">
              <Icon name="arrow" size={18} />
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Next →</span>
              <span className="text-base font-medium leading-snug text-ink">{next.title}</span>
            </span>
          </Link>
        )}
      </nav>

      <Footer />
    </>
  );
}
