import "server-only";
import fs from "fs";
import path from "path";
import { blogPosts as legacyPosts, BlogPost } from "@/lib/data";

export type { BlogPost };

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** Parses the display date ("Oct 5, 2026") or ISO date into a timestamp. */
export function postTime(post: BlogPost): number {
  const t = Date.parse(post.date);
  return Number.isNaN(t) ? 0 : t;
}

/** ISO yyyy-mm-dd for structured data and sitemaps. */
export function isoDate(post: BlogPost): string {
  const t = postTime(post);
  return t ? new Date(t).toISOString().split("T")[0] : "";
}

function loadGeneratedPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith(".json"))
    .map(f => JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), "utf8")) as BlogPost);
}

let cache: BlogPost[] | null = null;

/** All posts, newest first. Generated posts override legacy ones with the same slug. */
export function getAllPosts(): BlogPost[] {
  if (cache) return cache;
  const generated = loadGeneratedPosts();
  const seen = new Set(generated.map(p => p.slug));
  cache = [...generated, ...legacyPosts.filter(p => !seen.has(p.slug))]
    .sort((a, b) => postTime(b) - postTime(a));
  return cache;
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug);
}

/** What list views and client components need — no article HTML. */
export type BlogSummary = Omit<BlogPost, "content" | "tocItems">;

export function toSummary({ content: _c, tocItems: _t, ...rest }: BlogPost): BlogSummary {
  return rest;
}
