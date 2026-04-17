"use client";
import { useState } from "react";
import Reveal from "@/components/RevealOnScroll";
import { FeaturedCard, BlogCardItem } from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { blogPosts, BlogCat } from "@/lib/data";

const filters: { label: string; value: BlogCat }[] = [
  { label: "All Posts",    value: "all" },
  { label: "Android",      value: "android" },
  { label: "Full-Stack",   value: "fullstack" },
  { label: "AI & Tech",    value: "ai" },
  { label: "Freelancing",  value: "freelance" },
  { label: "Career",       value: "career" },
];

export default function BlogPage() {
  const [active, setActive] = useState<BlogCat>("all");

  const featured = blogPosts.find(p => p.featured)!;
  const rest      = blogPosts.filter(p => !p.featured);

  const visibleFeatured = active === "all" || featured.cat === active;
  const visibleRest     = rest.filter(p => active === "all" || p.cat === active);

  return (
    <>
      {/* Page header */}
      <div className="relative overflow-hidden pt-36 pb-16 px-16"
           style={{ background: "linear-gradient(160deg, #0D1B2A 0%, #0a1520 100%)" }}>
        {/* Watermark */}
        <span className="absolute right-12 bottom-[-1rem] font-display font-black text-[12rem] leading-none
                          text-[rgba(201,168,76,0.04)] pointer-events-none select-none tracking-tight">
          BLOG
        </span>
        <div className="max-w-[1100px] mx-auto relative z-10">
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-[0.67rem] tracking-[0.2em] uppercase text-gold mb-3
                           before:content-[''] before:block before:w-8 before:h-px before:bg-gold">
              Writing &amp; Insights
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-[clamp(2.8rem,6vw,5rem)] font-black text-off-white leading-none mb-4">
              The <span className="text-gold">Blog</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-[1rem] text-mid-gray max-w-xl leading-[1.8] font-light">
              Deep dives into Android development, full-stack architecture, freelancing, and the craft of building software that lasts.
            </p>
          </Reveal>
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-16 py-16 relative z-10">

        {/* Filters */}
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map(f => (
              <button key={f.value} onClick={() => setActive(f.value)}
                className={`px-5 py-2 font-mono text-[0.62rem] tracking-[0.1em] uppercase border transition-all duration-200
                  ${active === f.value
                    ? "bg-[rgba(201,168,76,0.12)] text-gold border-gold"
                    : "bg-transparent text-mid-gray border-[rgba(201,168,76,0.18)] hover:text-gold2 hover:border-[rgba(201,168,76,0.4)]"
                  }`}>
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Featured */}
        {visibleFeatured && (
          <Reveal>
            <FeaturedCard post={featured} />
          </Reveal>
        )}

        {/* Grid */}
        {visibleRest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {visibleRest.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 100}>
                <BlogCardItem post={post} delay={i} />
              </Reveal>
            ))}
          </div>
        )}

        {visibleFeatured === false && visibleRest.length === 0 && (
          <div className="text-center py-20 text-mid-gray font-mono text-[0.8rem] tracking-widest uppercase">
            No posts in this category yet.
          </div>
        )}

        {/* Newsletter */}
        <Reveal>
          <div className="relative overflow-hidden mt-16 px-12 py-10 border border-[rgba(201,168,76,0.2)]
                          flex items-center justify-between gap-8 flex-wrap"
               style={{ background: "linear-gradient(135deg, rgba(27,45,66,0.7), rgba(13,27,42,0.9))" }}>
            <div className="absolute top-0 left-0 right-0 h-0.5"
                 style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
            <div>
              <h3 className="font-display text-[1.4rem] text-off-white mb-1">Get new articles in your inbox</h3>
              <p className="text-[0.85rem] text-mid-gray">No spam. One email when something worth reading is published.</p>
            </div>
            <form className="flex flex-1 max-w-md" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com"
                className="flex-1 bg-[rgba(13,27,42,0.8)] border border-[rgba(201,168,76,0.2)] border-r-0
                           text-cream px-5 py-3 font-body text-[0.88rem] outline-none focus:border-[rgba(201,168,76,0.5)]
                           placeholder:text-mid-gray/50" />
              <button type="submit"
                className="px-6 py-3 bg-gold text-navy font-mono text-[0.63rem] tracking-[0.1em] uppercase font-semibold
                           border border-gold transition-colors duration-200 hover:bg-gold2 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </Reveal>

      </main>

      <Footer />
    </>
  );
}
