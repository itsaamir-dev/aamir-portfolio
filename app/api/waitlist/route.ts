import { createHash } from "crypto";
import { getPool, ensureSchema, isDbConfigured } from "@/lib/db";
import { validateWaitlist, normalizeEmail, normalizeWhatsapp, clip, type WaitlistInput } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

const RATE_LIMIT     = 5;            // submissions…
const RATE_WINDOW_MS = 10 * 60_000;  // …per IP per 10 minutes

function ipHash(req: Request): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const salt = process.env.WAITLIST_HASH_SALT ?? process.env.CRON_SECRET ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

const json = (body: object, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  if (!isDbConfigured) {
    console.error("[waitlist] DATABASE_URL is not configured");
    return json({ ok: false, error: "The waiting list isn’t available right now. Please try again later." }, 503);
  }

  let input: WaitlistInput;
  try {
    input = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Bots fill the hidden field; pretend success without saving anything.
  if (input.company) return json({ ok: true });

  const fieldErrors = validateWaitlist(input);
  if (Object.keys(fieldErrors).length) {
    return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, 400);
  }

  try {
    await ensureSchema();
    const db   = getPool();
    const hash = ipHash(req);

    const { rows } = await db.query<{ n: number }>(
      `SELECT count(*)::int AS n FROM ebook_waitlist_attempts WHERE ip_hash = $1 AND created_at > now() - $2::interval`,
      [hash, `${RATE_WINDOW_MS / 1000} seconds`],
    );
    if (rows[0].n >= RATE_LIMIT) {
      return json({ ok: false, error: "Too many attempts. Please wait a few minutes and try again." }, 429);
    }
    await db.query(`INSERT INTO ebook_waitlist_attempts (ip_hash) VALUES ($1)`, [hash]);
    // Occasionally prune old attempts so the table stays small.
    if (Math.random() < 0.02) await db.query(`DELETE FROM ebook_waitlist_attempts WHERE created_at < now() - interval '1 day'`);

    const whatsapp = input.whatsapp?.trim() ? normalizeWhatsapp(input.whatsapp) : null;

    // Unique on email. A repeat sign-up keeps the original row and only adds
    // newly given details or consent — it never removes consent.
    await db.query(
      `INSERT INTO ebook_waitlist
         (first_name, email, whatsapp_number, source, campaign,
          utm_source, utm_medium, utm_campaign, landing_page, referrer,
          marketing_consent, whatsapp_consent)
       VALUES ($1,$2,$3,$4,'ebook_launch',$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (email) DO UPDATE SET
         whatsapp_number   = COALESCE(EXCLUDED.whatsapp_number, ebook_waitlist.whatsapp_number),
         marketing_consent = ebook_waitlist.marketing_consent OR EXCLUDED.marketing_consent,
         whatsapp_consent  = ebook_waitlist.whatsapp_consent  OR EXCLUDED.whatsapp_consent,
         unsubscribed_at   = NULL,
         updated_at        = now()`,
      [
        input.firstName.trim(),
        normalizeEmail(input.email),
        whatsapp,
        clip(input.source, 40) ?? "website",
        clip(input.utmSource, 100),
        clip(input.utmMedium, 100),
        clip(input.utmCampaign, 100),
        clip(input.landingPage),
        clip(input.referrer),
        input.marketingConsent === true,
        input.whatsappConsent === true && Boolean(whatsapp),
      ],
    );

    // Same response for new and existing emails, so the form can't be used to
    // check whether someone is on the list.
    return json({ ok: true });
  } catch (err) {
    // Log the failure without the submitted personal data.
    const e = err as { code?: string; name?: string; message?: string };
    console.error("[waitlist] save failed:", e?.code ?? e?.name ?? "error", e?.message ?? "");
    return json({ ok: false, error: "We couldn’t save your details. Please try again in a moment." }, 500);
  }
}
