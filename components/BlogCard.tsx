import Link from "next/link";
import { blogPosts } from "@/lib/data";

type Post = (typeof blogPosts)[number];

export function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className="group relative grid grid-cols-1 md:grid-cols-2 border border-[rgba(201,168,76,0.18)] mb-12 overflow-hidden
                 no-underline text-inherit transition-all duration-300 hover:border-[rgba(201,168,76,0.4)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]">

      {/* Featured label */}
      <span className="absolute top-4 left-4 z-10 font-mono text-[0.56rem] tracking-[0.15em] uppercase
                       bg-gold text-navy px-2.5 py-1 font-semibold">
        FEATURED
      </span>

      {/* Image panel */}
      <div className="min-h-[280px] md:min-h-[340px] relative flex items-center justify-center overflow-hidden"
           style={{ background: "linear-gradient(135deg, #0a1828 0%, #1b2d42 100%)" }}>
        <span className="text-[6rem] opacity-25 relative z-10">{post.icon}</span>
        <div className="absolute inset-0"
             style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(42,100,150,0.12))" }} />
      </div>

      {/* Body */}
      <div className="p-10 flex flex-col justify-center bg-[rgba(27,45,66,0.5)]">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-gold bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.25)] px-3 py-1">
            {post.catLabel}
          </span>
          <span className="font-mono text-[0.58rem] tracking-[0.08em] text-mid-gray">{post.date}</span>
          <span className="font-mono text-[0.58rem] text-mid-gray">· {post.readTime}</span>
        </div>
        <h2 className="font-display text-[1.85rem] font-bold text-off-white leading-[1.2] mb-4">{post.title}</h2>
        <p className="text-[0.9rem] text-[#8a9bb0] leading-[1.8] mb-6 font-light">{post.excerpt}</p>
        <span className="inline-flex items-center gap-2 font-mono text-[0.63rem] tracking-[0.1em] uppercase text-gold
                         group-hover:gap-4 transition-all duration-200 after:content-['→']">
          Read Article
        </span>
      </div>
    </Link>
  );
}

export function BlogCardItem({ post, delay = 0 }: { post: Post; delay?: number }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className="group flex flex-col border border-[rgba(201,168,76,0.1)] overflow-hidden no-underline text-inherit
                 transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(201,168,76,0.3)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.4)]"
      style={{ background: "linear-gradient(145deg, rgba(27,45,66,0.6), rgba(13,27,42,0.85))" }}>

      {/* Thumbnail */}
      <div className="h-[180px] relative flex items-center justify-center overflow-hidden"
           style={{ background: "linear-gradient(135deg, #0a1828, #1b2d42)" }}>
        <span className="text-[3.5rem] relative z-10 opacity-60">{post.icon}</span>
        <span className="absolute bottom-3 right-4 font-display font-black text-[3rem] leading-none
                         text-[rgba(201,168,76,0.08)] select-none pointer-events-none">
          {String(delay + 2).padStart(2, "0")}
        </span>
        <div className="absolute inset-0"
             style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05), rgba(42,100,150,0.08))" }} />
      </div>

      {/* Body */}
      <div className="p-7 flex flex-col flex-1">
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <span className="font-mono text-[0.57rem] tracking-[0.12em] uppercase text-gold bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.25)] px-2.5 py-0.5">
            {post.catLabel}
          </span>
          <span className="font-mono text-[0.57rem] text-mid-gray">{post.date}</span>
        </div>
        <h3 className="font-display text-[1.12rem] font-bold text-off-white leading-[1.3] mb-3">{post.title}</h3>
        <p className="text-[0.85rem] text-[#7a8ea8] leading-[1.75] flex-1 mb-5 font-light line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold2 flex items-center justify-center
                            font-display font-bold text-[0.72rem] text-navy">AB</div>
            <span className="text-[0.73rem] text-mid-gray">{post.readTime}</span>
          </div>
          <span className="font-mono text-[0.68rem] text-gold opacity-0 group-hover:opacity-100 transition-all duration-200
                           -translate-x-1 group-hover:translate-x-0">→</span>
        </div>
      </div>
    </Link>
  );
}
