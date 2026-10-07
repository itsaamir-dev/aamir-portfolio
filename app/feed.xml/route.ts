import { getAllPosts, postTime } from "@/lib/posts";
import { SITE_URL, SITE_NAME, BLOG_DESCRIPTION, AUTHOR } from "@/lib/seo";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const posts = getAllPosts().slice(0, 30);
  const items = posts.map(p => `
    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(postTime(p) || Date.now()).toUTCString()}</pubDate>
      <category>${esc(p.catLabel)}</category>
      <description>${esc(p.excerpt)}</description>
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)} — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>${esc(BLOG_DESCRIPTION)}</description>
    <language>en-us</language>
    <managingEditor>aamirbashir.ahangar@gmail.com (${AUTHOR})</managingEditor>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
