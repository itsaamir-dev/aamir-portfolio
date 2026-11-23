import { createHash } from "crypto";
import { getPool, ensureSchema, isDbConfigured } from "@/lib/db";
import { createOrder, razorpayKeyId } from "@/lib/razorpay";
import { cashfreeMode, createCashfreeOrder } from "@/lib/cashfree";
import { activeProvider } from "@/lib/payments";
import {
  attachOrder, createPendingApplication, discardApplication, getPublicJob, hasPaidApplication, pruneUnpaid,
} from "@/lib/jobs-data";
import { checkResumeFile, isAcceptingApplications, normalizeUrl, validateApplication, EXPERIENCE_OPTIONS, type ApplicationInput } from "@/lib/jobs";
import { normalizeEmail, normalizeWhatsapp, clip } from "@/lib/waitlist";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const RATE_LIMIT     = 6;            // apply attempts…
const RATE_WINDOW_MS = 30 * 60_000;  // …per IP per 30 minutes

const json = (body: object, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function ipHash(req: Request): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const salt = process.env.WAITLIST_HASH_SALT ?? process.env.CRON_SECRET ?? "";
  return createHash("sha256").update(`${salt}:jobs:${ip}`).digest("hex").slice(0, 32);
}

/** Identify the file by its first bytes, not the name the browser sent. */
function sniffResume(buf: Buffer): { type: string; ext: string } | null {
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") return { type: "application/pdf", ext: "pdf" };
  if (buf.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])))
    return { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ext: "docx" };
  if (buf.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])))
    return { type: "application/msword", ext: "doc" };
  return null;
}

const safeFileName = (name: string, ext: string) => {
  const base = name.split(/[\\/]/).pop()!.replace(/\.[^.]*$/, "").replace(/[^\w .()-]+/g, "").trim().slice(0, 80) || "resume";
  return `${base}.${ext}`;
};

const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
};

export async function POST(req: Request) {
  if (!isDbConfigured) {
    console.error("[jobs/apply] DATABASE_URL is not configured");
    return json({ ok: false, error: "Applications aren’t available right now. Please try again later." }, 503);
  }
  const provider = activeProvider();
  if (!provider) {
    console.error("[jobs/apply] no payment gateway is configured (Cashfree or Razorpay keys)");
    return json({ ok: false, error: "Payments aren’t set up yet, so applications can’t be submitted. Please try again soon." }, 503);
  }

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return json({ ok: false, error: "We couldn’t read your application. If your résumé is over 4 MB, please upload a smaller file." }, 400);
  }

  // Bots fill the hidden field.
  if (str(fd, "company")) return json({ ok: false, error: "Invalid request." }, 400);

  const input: ApplicationInput = {
    fullName: str(fd, "fullName"), email: str(fd, "email"), phone: str(fd, "phone"),
    location: str(fd, "location"), portfolioUrl: str(fd, "portfolioUrl"), linkedinUrl: str(fd, "linkedinUrl"),
    experienceYears: str(fd, "experienceYears"), proposal: str(fd, "proposal"), agree: str(fd, "agree") === "on",
  };
  const file = fd.get("resume");
  const resume = file instanceof File ? file : null;

  const fieldErrors = validateApplication(input);
  const resumeError = checkResumeFile(resume);
  if (resumeError) fieldErrors.resume = resumeError;
  if (Object.keys(fieldErrors).length) {
    return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, 400);
  }

  try {
    const job = await getPublicJob(str(fd, "job"));
    if (!job || !isAcceptingApplications(job)) {
      return json({ ok: false, error: "This job is no longer accepting applications." }, 410);
    }

    await ensureSchema();
    const db = getPool();
    const hash = ipHash(req);
    const { rows } = await db.query<{ n: number }>(
      `SELECT count(*)::int AS n FROM job_application_attempts WHERE ip_hash = $1 AND created_at > now() - $2::interval`,
      [hash, `${RATE_WINDOW_MS / 1000} seconds`],
    );
    if (rows[0].n >= RATE_LIMIT) {
      return json({ ok: false, error: "Too many attempts. Please wait a few minutes and try again." }, 429);
    }
    await db.query(`INSERT INTO job_application_attempts (ip_hash) VALUES ($1)`, [hash]);

    const email = normalizeEmail(input.email);
    if (await hasPaidApplication(job.id, email)) {
      return json({
        ok: false, error: "You’ve already applied to this job.",
        fieldErrors: { email: "There’s already a paid application for this job with this email." },
      }, 409);
    }

    const buf = Buffer.from(await resume!.arrayBuffer());
    const kind = sniffResume(buf);
    if (!kind) {
      return json({ ok: false, error: "Please check the highlighted fields.",
                    fieldErrors: { resume: "That file doesn’t look like a PDF or Word document. Please upload your résumé as a PDF." } }, 400);
    }

    const experience = (EXPERIENCE_OPTIONS as readonly string[]).includes(input.experienceYears ?? "") ? input.experienceYears! : null;
    const app = await createPendingApplication({
      jobId: job.id,
      fullName: input.fullName.trim(),
      email,
      phone: normalizeWhatsapp(input.phone)!,
      location: clip(input.location, 100),
      portfolioUrl: normalizeUrl(input.portfolioUrl),
      linkedinUrl: normalizeUrl(input.linkedinUrl),
      experienceYears: experience,
      proposal: input.proposal.trim(),
      resumeName: safeFileName(resume!.name, kind.ext),
      resumeType: kind.type,
      resume: buf,
      feePaise: job.feePaise,
    });

    const prefill = { name: input.fullName.trim(), email, contact: normalizeWhatsapp(input.phone)! };
    let checkout: Record<string, unknown>;
    try {
      if (provider === "cashfree") {
        const orderId = `cf_${app.publicId}`;
        const origin = new URL(req.url).origin;
        const order = await createCashfreeOrder({
          orderId,
          amountPaise: job.feePaise,
          customerId: `app${app.publicId}`,
          name: prefill.name, email, phone: prefill.contact,
          note: `Referral fee - ${job.title}`,
          // Used only when the checkout can't open as a popup (e.g. in-app browsers).
          returnUrl: `${origin}/jobs/${job.slug}?application=${app.publicId}#apply`,
          // Cashfree only calls https URLs; locally, payment is confirmed by the browser.
          notifyUrl: origin.startsWith("https://") ? `${origin}/api/cashfree/webhook` : undefined,
          tags: { application: app.publicId, job: job.slug.slice(0, 200) },
        });
        await attachOrder(app.id, "cashfree", orderId);
        checkout = { provider, mode: cashfreeMode, sessionId: order.payment_session_id };
      } else {
        const order = await createOrder({
          amountPaise: job.feePaise,
          receipt: `job${job.id}-app${app.id}`,
          notes: { application: app.publicId, job: job.slug },
        });
        await attachOrder(app.id, "razorpay", order.id);
        checkout = { provider, keyId: razorpayKeyId(), order: { id: order.id, amount: order.amount, currency: order.currency }, prefill };
      }
    } catch (err) {
      console.error(`[jobs/apply] ${provider} order failed:`, (err as Error).message);
      await discardApplication(app.id);
      return json({ ok: false, error: "We couldn’t start the payment. Please try again in a moment." }, 502);
    }

    // Occasionally clear old unpaid applications and attempts.
    if (Math.random() < 0.05) {
      await pruneUnpaid();
      await db.query(`DELETE FROM job_application_attempts WHERE created_at < now() - interval '1 day'`);
    }

    return json({
      ok: true,
      application: app.publicId,
      ...checkout,
      job: { title: job.title, slug: job.slug },
    });
  } catch (err) {
    // Log the failure without the applicant's personal data.
    const e = err as { code?: string; name?: string; message?: string };
    console.error("[jobs/apply] failed:", e?.code ?? e?.name ?? "error", e?.message ?? "");
    return json({ ok: false, error: "We couldn’t save your application. Please try again in a moment." }, 500);
  }
}
