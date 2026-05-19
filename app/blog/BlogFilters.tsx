"use client";
import { useState } from "react";
import Reveal from "@/components/RevealOnScroll";
import { FeaturedCard, BlogCardItem } from "@/components/BlogCard";
import { BlogPost, BlogCat } from "@/lib/data";

const filters: { label: string; value: BlogCat }[] = [
  { label: "All Posts",   value: "all" },
  { label: "Android",     value: "android" },
  { label: "Full-Stack",  value: "fullstack" },
  { label: "AI & Tech",   value: "ai" },
  { label: "Freelancing", value: "freelance" },
  { label: "Career",      value: "career" },
];

export default function BlogFilters({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState<BlogCat>("all");

  const featured = posts.find(p => p.featured)!;
  const rest      = posts.filter(p => !p.featured);

  const visibleFeatured = active === "all" || featured.cat === active;
  const visibleRest     = rest.filter(p => active === "all" || p.cat === active);

  return (
    <>
      <Reveal>
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
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

      {visibleFeatured && (
        <Reveal>
          <FeaturedCard post={featured} />
        </Reveal>
      )}

      {visibleRest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {visibleRest.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 100}>
              <BlogCardItem post={post} delay={i} />
            </Reveal>
          ))}
        </div>
      )}

      {!visibleFeatured && visibleRest.length === 0 && (
        <div className="text-center py-20 text-mid-gray font-mono text-[0.8rem] tracking-widest uppercase">
          No posts in this category yet.
        </div>
      )}
    </>
  );
}
