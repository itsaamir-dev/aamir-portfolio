"use client";
import { useState } from "react";
import Reveal from "@/components/RevealOnScroll";
import { FeaturedCard, BlogCardItem } from "@/components/BlogCard";
import type { BlogCat } from "@/lib/data";
import type { BlogSummary } from "@/lib/posts";

const filters: { label: string; value: BlogCat }[] = [
  { label: "All Posts",   value: "all" },
  { label: "Android",     value: "android" },
  { label: "Full-Stack",  value: "fullstack" },
  { label: "AI & Tech",   value: "ai" },
  { label: "Freelancing", value: "freelance" },
  { label: "Career",      value: "career" },
];

export default function BlogFilters({ posts }: { posts: BlogSummary[] }) {
  const [active, setActive] = useState<BlogCat>("all");

  const featured = posts.find(p => p.featured) ?? posts[0];
  const rest      = posts.filter(p => p !== featured);

  const visibleFeatured = active === "all" || featured.cat === active;
  const visibleRest     = rest.filter(p => active === "all" || p.cat === active);

  return (
    <>
      <div role="group" aria-label="Filter posts by category" className="mb-12 flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            aria-pressed={active === f.value}
            className={`chip font-mono !text-[0.8125rem] uppercase tracking-[0.08em] ${active === f.value ? "chip-active" : ""}`}>
            {f.label}
          </button>
        ))}
      </div>

      {visibleFeatured && (
        <Reveal>
          <FeaturedCard post={featured} />
        </Reveal>
      )}

      {visibleRest.length > 0 && (
        <div className="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {visibleRest.map(post => (
            <BlogCardItem key={post.slug} post={post} />
          ))}
        </div>
      )}

      {!visibleFeatured && visibleRest.length === 0 && (
        <p className="rounded-panel bg-surface py-20 text-center text-muted">No posts in this category yet.</p>
      )}
    </>
  );
}
