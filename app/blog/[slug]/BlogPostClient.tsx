"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { BlogPost } from "@/lib/data";

export default function BlogPostClient({
  post, prev, next, related,
}: { post: BlogPost; prev: BlogPost | null; next: BlogPost | null; related: BlogPost[] }) {

  const [progress, setProgress]   = useState(0);
  const [activeToc, setActiveToc] = useState(post.tocItems[0]?.id ?? "");
  const [copied, setCopied]       = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
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

  return (
    <>
      {/* Progress bar */}
      <div id="read-progress" style={{ width: `${progress}%` }} />

      {/* Hero */}
      <div className="relative overflow-hidden pt-36 pb-12 px-16"
           style={{ background: "linear-gradient(160deg, #0a1520 0%, #0D1B2A 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: "radial-gradient(ellipse 60% 50% at 60% 60%, rgba(42,100,150,0.14), transparent)" }} />
        <span className="absolute right-12 top-1/2 -translate-y-1/2 font-display font-black text-[16rem] leading-none
                          opacity-[0.04] pointer-events-none select-none text-gold">{post.icon}</span>

        <div className="max-w-[820px] mx-auto relative z-10">
          <div className="flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.1em] uppercase mb-7 flex-wrap">
            <Link href="/" className="text-mid-gray hover:text-gold transition-colors">Home</Link>
            <span className="text-white/20">/</span>
            <Link href="/blog" className="text-mid-gray hover:text-gold transition-colors">Blog</Link>
            <span className="text-white/20">/</span>
            <span className="text-gold2">{post.catLabel}</span>
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            <span className="px-3 py-1 font-mono text-[0.58rem] tracking-[0.1em] uppercase text-gold bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.25)]">
              {post.catLabel}
            </span>
          </div>

          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-black text-off-white leading-[1.1] mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 flex-wrap pb-6 border-b border-[rgba(201,168,76,0.15)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold2 flex items-center justify-center font-display font-black text-navy">AB</div>
              <div>
                <strong className="block text-[0.85rem] text-off-white">Aamir Bashir</strong>
                <span className="font-mono text-[0.58rem] tracking-[0.08em] text-mid-gray uppercase">Senior Software Engineer</span>
              </div>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <span className="font-mono text-[0.6rem] tracking-[0.08em] text-mid-gray uppercase">{post.date}</span>
            <div className="w-px h-7 bg-white/10" />
            <span className="font-mono text-[0.6rem] tracking-[0.08em] text-mid-gray uppercase">{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-[1100px] mx-auto px-16 py-16 relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">

        {/* Article */}
        <article>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <hr className="border-none border-t border-[rgba(201,168,76,0.12)] my-10" />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 items-center pt-6 border-t border-[rgba(201,168,76,0.12)]">
            <span className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-mid-gray mr-2">Tags:</span>
            {post.tags.map(t => (
              <span key={t} className="px-3 py-1.5 border border-[rgba(201,168,76,0.2)] font-mono text-[0.58rem] tracking-[0.08em] uppercase text-gold2 bg-transparent transition-all duration-200 hover:bg-[rgba(201,168,76,0.1)] hover:border-gold cursor-default">{t}</span>
            ))}
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 mt-5 p-5 bg-[rgba(27,45,66,0.4)] border border-[rgba(201,168,76,0.12)] flex-wrap">
            <span className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-mid-gray mr-2">Share:</span>
            {["Twitter / X", "LinkedIn"].map(s => (
              <button key={s} className="px-4 py-2 font-mono text-[0.6rem] tracking-[0.08em] uppercase border border-[rgba(201,168,76,0.25)] text-gold2 bg-transparent transition-all duration-200 hover:bg-[rgba(201,168,76,0.1)] hover:border-gold">
                {s}
              </button>
            ))}
            <button onClick={handleCopy}
              className="px-4 py-2 font-mono text-[0.6rem] tracking-[0.08em] uppercase border border-[rgba(201,168,76,0.25)] text-gold2 bg-transparent transition-all duration-200 hover:bg-[rgba(201,168,76,0.1)] hover:border-gold">
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          {/* Author card */}
          <div className="relative overflow-hidden mt-10 p-8 border border-[rgba(201,168,76,0.15)] flex gap-6 items-start"
               style={{ background: "linear-gradient(135deg, rgba(27,45,66,0.6), rgba(13,27,42,0.8))" }}>
            <div className="absolute top-0 left-0 right-0 h-0.5"
                 style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
            <div className="w-16 h-16 rounded-full flex-shrink-0 bg-gradient-to-br from-gold to-gold2 flex items-center justify-center font-display font-black text-2xl text-navy">AB</div>
            <div>
              <strong className="block text-[1rem] text-off-white mb-0.5">Aamir Bashir</strong>
              <span className="block font-mono text-[0.6rem] tracking-[0.1em] uppercase text-gold mb-3">Senior Software Engineer · Top Rated Plus on Upwork</span>
              <p className="text-[0.87rem] text-mid-gray leading-[1.75]">8+ years building mobile and full-stack applications. I write about Android architecture, API design, and the realities of freelancing globally. Based in India, open to remote work with US/EU teams.</p>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24 h-fit">

          {post.tocItems.length > 0 && (
            <div className="bg-[rgba(27,45,66,0.4)] border border-[rgba(201,168,76,0.12)] p-6">
              <h4 className="font-mono text-[0.63rem] tracking-[0.15em] uppercase text-gold mb-4 pb-3 border-b border-[rgba(201,168,76,0.12)]">In This Article</h4>
              <ul className="space-y-1">
                {post.tocItems.map(({ id, label }) => (
                  <li key={id}>
                    <a href={`#${id}`}
                      className={`flex items-start gap-2 text-[0.82rem] py-1.5 no-underline transition-colors duration-200 leading-snug
                                  ${activeToc === id ? "text-gold2" : "text-mid-gray hover:text-gold2"}`}>
                      <span className={`text-gold text-[0.85rem] flex-shrink-0 mt-0.5 transition-opacity duration-200 ${activeToc === id ? "opacity-100" : "opacity-0"}`}>›</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div className="bg-[rgba(27,45,66,0.4)] border border-[rgba(201,168,76,0.12)] p-6">
              <h4 className="font-mono text-[0.63rem] tracking-[0.15em] uppercase text-gold mb-4">Related Posts</h4>
              <div className="space-y-1">
                {related.map(r => (
                  <Link key={r.slug} href={`/blog/${r.slug}`}
                    className="flex items-start gap-3 py-3 border-b border-[rgba(255,255,255,0.05)] last:border-none no-underline group transition-all duration-200 hover:translate-x-1">
                    <div className="w-9 h-9 flex-shrink-0 bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.15)] flex items-center justify-center text-[1rem]">{r.icon}</div>
                    <div>
                      <span className="block font-mono text-[0.56rem] tracking-[0.08em] uppercase text-gold mb-1">{r.catLabel}</span>
                      <p className="text-[0.78rem] text-light-blue leading-snug group-hover:text-gold2 transition-colors">{r.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 border border-[rgba(201,168,76,0.2)] bg-[rgba(201,168,76,0.04)]">
            <h4 className="font-mono text-[0.63rem] tracking-[0.15em] uppercase text-gold mb-3">Newsletter</h4>
            <p className="text-[0.8rem] text-mid-gray leading-[1.7] mb-4">New articles in your inbox. No spam.</p>
            <input type="email" placeholder="your@email.com"
              className="w-full bg-[rgba(13,27,42,0.8)] border border-[rgba(201,168,76,0.2)] text-cream px-4 py-2.5
                         font-body text-[0.82rem] outline-none mb-3 focus:border-[rgba(201,168,76,0.5)] placeholder:text-mid-gray/50 block" />
            <button className="w-full py-2.5 bg-gold text-navy font-mono text-[0.6rem] tracking-[0.1em] uppercase font-semibold transition-colors hover:bg-gold2">
              Subscribe
            </button>
          </div>
        </aside>
      </div>

      {/* Prev / Next */}
      <div className="max-w-[1100px] mx-auto px-16 pb-16 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        {prev ? (
          <Link href={`/blog/${prev.slug}`}
            className="p-6 border border-[rgba(201,168,76,0.15)] no-underline flex flex-col gap-2 transition-all duration-250 hover:border-[rgba(201,168,76,0.4)] hover:bg-[rgba(27,45,66,0.3)] hover:-translate-y-0.5">
            <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-gold">← Previous</span>
            <span className="font-display text-[0.95rem] text-light-blue leading-snug">{prev.title}</span>
          </Link>
        ) : <div />}
        {next && (
          <Link href={`/blog/${next.slug}`}
            className="p-6 border border-[rgba(201,168,76,0.15)] no-underline flex flex-col gap-2 text-right transition-all duration-250 hover:border-[rgba(201,168,76,0.4)] hover:bg-[rgba(27,45,66,0.3)] hover:-translate-y-0.5">
            <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-gold">Next →</span>
            <span className="font-display text-[0.95rem] text-light-blue leading-snug">{next.title}</span>
          </Link>
        )}
      </div>

      <Footer />
    </>
  );
}
