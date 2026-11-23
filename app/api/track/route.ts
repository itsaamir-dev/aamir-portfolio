import { createHash } from "crypto";
import { cookies } from "next/headers";
import { getPool, ensureSchema, isDbConfigured } from "@/lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { SITE_URL } from "@/lib/seo";

const bare = (h: string) => h.toLowerCase().replace(/^www\./, "");
// The canonical domain counts as "this site" even when SITE_URL points elsewhere (e.g. locally).
const OWN_HOSTS = new Set([bare(new URL(SITE_URL).hostname), "buildwithaamir.com"]);

export const dynamic = "force-dynamic";

const ok = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

const BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|discord|slack|linkedin|embedly|preview|headless|lighthouse|pagespeed|gtmetrix|curl|wget|python|axios|node-fetch|go-http|java\//i;

function device(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android/i.test(ua)) return "mobile";
  return "desktop";
}
function browser(ua: string) {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

/** "/blog/x/?a=1#b" → "/blog/x". Only real site paths are kept. */
function cleanPath(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) return null;
  let p = raw.split(/[?#]/)[0].slice(0, 200);
  try { p = decodeURIComponent(p); } catch { /* keep as sent */ }
  if (p.length > 1) p = p.replace(/\/+$/, "");
  if (/^\/(admin|api|_next)(\/|$)/.test(p) || /[<>"\s]/.test(p)) return null;
  return p || "/";
}

function referrerHost(raw: unknown, ownHost: string | null): string | null {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const host = new URL(raw).hostname.toLowerCase();
    // Moving between pages of this site isn't a traffic source.
    if (!host || OWN_HOSTS.has(bare(host)) || (ownHost && bare(host) === bare(ownHost)) ||
        host.endsWith(".vercel.app") || host === "localhost") return null;
    return host.slice(0, 120);
  } catch { return null; }
}

const header = (req: Request, name: string) => {
  const v = req.headers.get(name);
  if (!v) return null;
  try { return decodeURIComponent(v).slice(0, 80); } catch { return v.slice(0, 80); }
};
const coord = (v: string | null, max: number) => {
  const n = v === null ? NaN : Number(v);
  return Number.isFinite(n) && Math.abs(n) <= max ? Math.round(n * 100) / 100 : null;
};

/**
 * Page-view beacon from the public site. Always answers 204 so it never
 * shows errors to visitors. Skips bots, prefetches and signed-in admins.
 */
export async function POST(req: Request) {
  if (!isDbConfigured) return ok();
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || BOT.test(ua) || req.headers.get("purpose") === "prefetch") return ok();
  if (await verifySessionToken(cookies().get(ADMIN_COOKIE)?.value)) return ok(); // don't count your own visits

  let body: { path?: unknown; referrer?: unknown };
  try { body = JSON.parse(await req.text()); } catch { return ok(); }
  const path = cleanPath(body.path);
  if (!path) return ok();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const salt = process.env.WAITLIST_HASH_SALT ?? process.env.CRON_SECRET ?? "";
  const day = new Date().toISOString().slice(0, 10);
  const visitor = createHash("sha256").update(`${salt}:pv:${day}:${ip}:${ua}`).digest("hex").slice(0, 32);
  const ownHost = req.headers.get("host")?.split(":")[0].toLowerCase() ?? null;

  const country = header(req, "x-vercel-ip-country");
  try {
    await ensureSchema();
    const db = getPool();
    // Same visitor reloading the same page within 10 s counts once.
    await db.query(
      `INSERT INTO page_views (path, country, region, city, latitude, longitude, referrer_host, device, browser, visitor_hash)
       SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
       WHERE NOT EXISTS (SELECT 1 FROM page_views WHERE visitor_hash = $10 AND path = $1 AND created_at > now() - interval '10 seconds')`,
      [
        path,
        country && /^[A-Z]{2}$/.test(country) ? country : null,
        header(req, "x-vercel-ip-country-region"),
        header(req, "x-vercel-ip-city"),
        coord(req.headers.get("x-vercel-ip-latitude"), 90),
        coord(req.headers.get("x-vercel-ip-longitude"), 180),
        referrerHost(body.referrer, ownHost),
        device(ua),
        browser(ua),
        visitor,
      ],
    );
    // Keep about 13 months of history.
    if (Math.random() < 0.002) await db.query(`DELETE FROM page_views WHERE created_at < now() - interval '400 days'`);
  } catch (err) {
    console.error("[track] failed:", (err as Error).message);
  }
  return ok();
}
