import Link from "next/link";
import Icon from "@/components/Icon";
import type { BlogSummary as Post } from "@/lib/posts";

function Meta({ post, onDark = false }: { post: Post; onDark?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${onDark ? "text-night-muted" : "text-muted"}`}>
      <span className={`rounded-full px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.1em]
                        ${onDark ? "bg-accent text-ink" : "bg-surface text-ink"}`}>{post.catLabel}</span>
      <span>{post.date}</span>
      <span aria-hidden="true">·</span>
      <span>{post.readTime}</span>
    </div>
  );
}

function ArrowDot({ size = "h-11 w-11" }: { size?: string }) {
  return (
    <span aria-hidden="true"
          className={`absolute bottom-4 right-4 flex ${size} items-center justify-center rounded-full bg-accent text-ink
                      transition-transform duration-300 group-hover:rotate-45`}>
      <Icon name="external" size={18} />
    </span>
  );
}

export function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className="group mb-12 grid gap-6 md:grid-cols-[1fr_1fr] md:items-center md:gap-10">

      <div className="sky relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-panel">
        <span className="scheme-light absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-ink backdrop-blur">
          Featured
        </span>
        <span aria-hidden="true" className="text-[5.5rem] transition-transform duration-500 group-hover:scale-110">{post.icon}</span>
        <ArrowDot size="h-12 w-12" />
      </div>

      <div>
        <Meta post={post} />
        <h2 className="mt-4 text-[1.85rem] font-medium leading-[1.12] tracking-[-0.045em] text-ink sm:text-[2.25rem]">{post.title}</h2>
        <p className="mt-4 text-base leading-relaxed text-muted">{post.excerpt}</p>
        <span className="btn-dark pointer-events-none mt-6">
          Read article
          <span aria-hidden="true" className="btn-arrow bg-accent text-ink"><Icon name="external" size={14} /></span>
        </span>
      </div>
    </Link>
  );
}

export function BlogCardItem({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-panel bg-surface
                      transition-colors duration-300 group-hover:bg-surface-2">
        <span aria-hidden="true" className="text-6xl transition-transform duration-500 group-hover:scale-110">{post.icon}</span>
        <ArrowDot />
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <Meta post={post} />
        <h3 className="mt-3 text-xl font-medium leading-snug tracking-[-0.035em] text-ink underline-offset-4 group-hover:underline">{post.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-base leading-relaxed text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
