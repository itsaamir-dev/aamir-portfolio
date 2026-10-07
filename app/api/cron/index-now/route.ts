import { getAllPosts, postTime } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo";
import { rejectUnauthorized } from "@/lib/cron-auth";

export const dynamic = "force-dynamic";

// Must match public/<key>.txt
const INDEXNOW_KEY = "a8f3d9c2e5b7a1d4c6e8f2b9a3d5c7e1";
const LOOKBACK_MS  = 3 * 24 * 60 * 60 * 1000;

/**
 * Vercel Cron: tells IndexNow (Bing, Yandex, Seznam…) about posts published in
 * the last few days, plus the pages that list them. Runs after the post cron,
 * once the new deployment is live.
 */
export async function GET(req: Request) {
  const denied = rejectUnauthorized(req);
  if (denied) return denied;

  const since  = Date.now() - LOOKBACK_MS;
  const recent = getAllPosts().filter(p => postTime(p) >= since);
  if (recent.length === 0) return Response.json({ ok: true, submitted: 0 });

  const urlList = [
    SITE_URL, `${SITE_URL}/blog`, `${SITE_URL}/sitemap`,
    ...recent.map(p => `${SITE_URL}/blog/${p.slug}`),
  ];

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method:  "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host:        new URL(SITE_URL).hostname,
      key:         INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  const ok = res.status === 200 || res.status === 202;
  return Response.json({ ok, status: res.status, submitted: urlList.length, urlList }, { status: ok ? 200 : 502 });
}
