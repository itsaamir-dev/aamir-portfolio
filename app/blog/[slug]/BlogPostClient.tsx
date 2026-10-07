"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { BlogPost } from "@/lib/data";
import { PROMISE } from "@/lib/site";

const chip = "inline-flex min-h-[40px] items-center rounded-[10px] border border-line px-4 text-sm font-medium text-muted transition-colors duration-200 hover:border-[#3A414D] hover:text-ink";

export default function BlogPostClient({
  post, prev, next, related,
}: { post: BlogPost; prev: BlogPost | null; next: BlogPost | null; related: BlogPost[] }) {

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

  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>(".post-content h2[id], .post-content h3[id]");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveToc(e.target.id); });
    }, { rootMargin: "-20% 0px -70% 0px" });
    headings.forEach(h => obs.observe(h));
    return () => obs.disconnect();
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
      <header className="border-b border-line bg-bg pb-10 pt-28 sm:pt-36">
        <div className="mx-auto max-w-prose px-5 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-ink">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-accent-light">{post.catLabel}</span>
          </nav>

          <h1 className="mt-6 text-[2rem] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-bold text-white">AB</div>
              <div>
                <strong className="block text-[0.95rem] font-semibold text-ink">Aamir Bashir</strong>
                <span>Senior Software Engineer</span>
              </div>
            </div>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
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
            <span className="mr-2 text-sm text-muted">Tags:</span>
            {post.tags.map(t => (
              <span key={t} className="rounded-md border border-line px-2.5 py-1 text-sm text-muted">{t}</span>
            ))}
          </div>

          {/* Share */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="mr-2 text-sm text-muted">Share:</span>
            {shareLinks.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={chip}>{s.label}</a>
            ))}
            <button onClick={handleCopy} className={chip}>
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>

          {/* Author card */}
          <div className="card mt-10 flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-xl font-bold text-white">AB</div>
            <div>
              <strong className="block text-lg font-semibold text-ink">Aamir Bashir</strong>
              <span className="mt-0.5 block text-sm text-accent-light">Senior Software Engineer · Top Rated Plus on Upwork</span>
              <p className="mt-3 text-base leading-relaxed text-muted">
                8+ years building mobile and full-stack applications. I write about Android architecture, API design,
                and the realities of freelancing with international clients.
              </p>
            </div>
          </div>

          {/* Community CTA */}
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0"
                 style={{ background: "radial-gradient(ellipse 70% 80% at 0% 0%, rgba(124,92,255,0.14), transparent 70%)" }} />
            <div className="relative">
              <h2 className="text-xl font-bold text-ink">Build With Aamir Community</h2>
              <p className="mt-2 text-base text-muted">{PROMISE}</p>
              <WhatsAppButton className="mt-5" />
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="sticky top-24 hidden h-fit flex-col gap-6 lg:flex">
          {post.tocItems.length > 0 && (
            <nav aria-label="In this article" className="card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink">In This Article</h2>
              <ul className="mt-4 space-y-1 border-l border-line">
                {post.tocItems.map(({ id, label }) => (
                  <li key={id}>
                    <a href={`#${id}`}
                      className={`-ml-px block border-l-2 py-1.5 pl-3 text-[0.9rem] leading-snug transition-colors duration-200
                                  ${activeToc === id ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"}`}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {related.length > 0 && (
            <div className="card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink">Related Posts</h2>
              <div className="mt-3">
                {related.map(r => (
                  <Link key={r.slug} href={`/blog/${r.slug}`}
                    className="group block border-b border-line py-3 last:border-none">
                    <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-accent-light">{r.catLabel}</span>
                    <span className="mt-1 block text-[0.9rem] leading-snug text-muted group-hover:text-ink">{r.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Prev / Next */}
      <nav aria-label="More posts" className="container-x grid grid-cols-1 gap-4 pb-16 md:grid-cols-2">
        {prev ? (
          <Link href={`/blog/${prev.slug}`}
            className="card flex flex-col gap-2 transition-colors duration-200 hover:border-[#3A414D]">
            <span className="text-sm font-semibold text-accent-light">← Previous</span>
            <span className="text-base font-medium leading-snug text-ink">{prev.title}</span>
          </Link>
        ) : <div />}
        {next && (
          <Link href={`/blog/${next.slug}`}
            className="card flex flex-col gap-2 text-right transition-colors duration-200 hover:border-[#3A414D]">
            <span className="text-sm font-semibold text-accent-light">Next →</span>
            <span className="text-base font-medium leading-snug text-ink">{next.title}</span>
          </Link>
        )}
      </nav>

      <Footer />
    </>
  );
}
