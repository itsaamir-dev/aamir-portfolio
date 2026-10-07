import Link from "next/link";
import type { BlogSummary as Post } from "@/lib/posts";

function Meta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
      <span className="font-semibold text-accent-light">{post.catLabel}</span>
      <span aria-hidden="true">·</span>
      <span>{post.date}</span>
      <span aria-hidden="true">·</span>
      <span>{post.readTime}</span>
    </div>
  );
}

export function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className="group mb-10 grid overflow-hidden rounded-2xl border border-line bg-surface
                 transition-colors duration-200 hover:border-[#3A414D] md:grid-cols-[0.9fr_1.1fr]">

      <div className="relative flex min-h-[200px] items-center justify-center bg-[#0F1217] md:min-h-[320px]">
        <span className="absolute left-5 top-5 rounded-md bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] text-white">
          Featured
        </span>
        <span aria-hidden="true" className="text-[5rem] opacity-50">{post.icon}</span>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-10">
        <Meta post={post} />
        <h2 className="mt-4 text-2xl font-bold leading-tight text-ink sm:text-3xl">{post.title}</h2>
        <p className="mt-4 text-base leading-relaxed text-muted">{post.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-semibold text-accent-light">
          Read article <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

export function BlogCardItem({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface
                 transition-[border-color,transform] duration-200 hover:-translate-y-1 hover:border-[#3A414D]">

      <div className="flex h-36 items-center justify-center bg-[#0F1217]">
        <span aria-hidden="true" className="text-5xl opacity-60">{post.icon}</span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <Meta post={post} />
        <h3 className="mt-3 text-xl font-semibold leading-snug text-ink">{post.title}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-base leading-relaxed text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
