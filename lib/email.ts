import "server-only";
import { SITE_URL } from "@/lib/seo";
import { ebook } from "@/lib/ebook";
import { formatFee } from "@/lib/jobs";

// Transactional email through Resend's REST API (no SDK). RESEND_API_KEY is
// added by the Resend integration on Vercel. The sending domain
// (buildwithaamir.com) must be verified in Resend. Replies go to the Zoho
// inbox via Reply-To. Without a key, sending is skipped quietly.
const API_KEY = process.env.RESEND_API_KEY;
export const EMAIL_FROM     = process.env.EMAIL_FROM ?? "Aamir from Build With Aamir <freelance@buildwithaamir.com>";
export const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO ?? "freelance@buildwithaamir.com";
export const isEmailConfigured = Boolean(API_KEY);

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

type Mail = { to: string; subject: string; html: string; text: string; idempotencyKey?: string; headers?: Record<string, string> };

/** Sends one email. Never throws: a failed email must not break a payment or sign-up. */
export async function sendEmail(m: Mail): Promise<boolean> {
  if (!API_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        ...(m.idempotencyKey ? { "Idempotency-Key": m.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from: EMAIL_FROM, to: [m.to], reply_to: EMAIL_REPLY_TO,
        subject: m.subject, html: m.html, text: m.text, headers: m.headers,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { name?: string; message?: string };
      console.error(`[email] send failed (${res.status}): ${body.name ?? ""} ${body.message ?? ""}`.trim());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed:", (err as Error).message);
    return false;
  }
}

// ─── Layout ─────────────────────────────────────────────────────────────────
// Table layout + inline styles: what email clients (Gmail, Outlook) render reliably.

function layout({ preheader, heading, body, footer }: { preheader: string; heading: string; body: string; footer?: string }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>${esc(heading)}</title></head>
<body style="margin:0;padding:0;background:#F2F2F2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2F2;">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
    <tr><td style="padding:0 4px 16px;">
      <a href="${SITE_URL}" style="text-decoration:none;color:#131313;font:600 18px/1.2 Georgia,'Times New Roman',serif;">
        <img src="${SITE_URL}/brand/logo-icon.png" width="32" height="32" alt="" style="vertical-align:middle;border-radius:8px;margin-right:8px;">Build With Aamir</a>
    </td></tr>
    <tr><td style="background:#FFFFFF;border-radius:20px;padding:32px 28px;font:16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#3A3A3A;">
      <h1 style="margin:0 0 16px;font:500 26px/1.2 Georgia,'Times New Roman',serif;color:#131313;letter-spacing:-0.5px;">${esc(heading)}</h1>
      ${body}
      <p style="margin:24px 0 0;">— Aamir</p>
    </td></tr>
    <tr><td style="padding:16px 8px;font:13px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#6B6B6B;">
      ${footer ? `${footer}<br>` : ""}Reply to this email to reach me directly.<br>
      Build With Aamir · India · <a href="${SITE_URL}" style="color:#6B6B6B;">buildwithaamir.com</a>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

const p = (html: string) => `<p style="margin:0 0 14px;">${html}</p>`;
const button = (href: string, label: string) =>
  `<p style="margin:22px 0;"><a href="${href}" style="display:inline-block;background:#131313;color:#FFFFFF;text-decoration:none;font-weight:600;padding:13px 22px;border-radius:999px;">${esc(label)}</a></p>`;
const firstName = (full: string) => full.trim().split(/\s+/)[0] || "there";

// ─── Job application confirmation ──────────────────────────────────────────

export function sendApplicationConfirmation(a: {
  to: string; fullName: string; jobTitle: string; jobSlug: string; feePaise: number; reference: string; paymentId: string | null;
}) {
  const name = firstName(a.fullName);
  const fee = formatFee(a.feePaise);
  const jobUrl = `${SITE_URL}/jobs/${a.jobSlug}`;
  const steps = [
    "Your résumé and proposal are reviewed against the role.",
    "If your profile fits, it’s referred directly to the hiring team.",
    "You’ll hear back by email or WhatsApp with next steps.",
  ];
  const html = layout({
    preheader: `Your application for ${a.jobTitle} is in. Reference ${a.reference}.`,
    heading: "Application received",
    body:
      p(`Hi ${esc(name)},`) +
      p(`Thanks for applying for <strong style="color:#131313;">${esc(a.jobTitle)}</strong>. Your application and the ${esc(fee)} referral fee went through.`) +
      `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#F2F2F2;border-radius:14px;margin:6px 0 18px;">
        <tr><td style="padding:14px 16px;font-size:14px;line-height:1.8;color:#3A3A3A;">
          <strong style="color:#131313;">Reference:</strong> ${esc(a.reference)}<br>
          ${a.paymentId ? `<strong style="color:#131313;">Payment ID:</strong> ${esc(a.paymentId)}<br>` : ""}
          <strong style="color:#131313;">Amount paid:</strong> ${esc(fee)} (non-refundable)
        </td></tr></table>` +
      p(`<strong style="color:#131313;">What happens next</strong>`) +
      `<ol style="margin:0 0 14px;padding-left:20px;">${steps.map(s => `<li style="margin:0 0 6px;">${esc(s)}</li>`).join("")}</ol>` +
      button(jobUrl, "View the job") +
      p(`Keep this email for your records. If you have a question, just reply and include your reference.`),
    footer: `<a href="${SITE_URL}/refund-policy" style="color:#6B6B6B;">Refund policy</a> · <a href="${SITE_URL}/privacy" style="color:#6B6B6B;">Privacy</a>`,
  });
  const text = [
    `Hi ${name},`, "",
    `Thanks for applying for ${a.jobTitle}. Your application and the ${fee} referral fee went through.`, "",
    `Reference: ${a.reference}`, ...(a.paymentId ? [`Payment ID: ${a.paymentId}`] : []), `Amount paid: ${fee} (non-refundable)`, "",
    "What happens next:", ...steps.map((s, i) => `${i + 1}. ${s}`), "",
    `The job: ${jobUrl}`, "",
    "Keep this email for your records. If you have a question, just reply and include your reference.", "", "— Aamir",
  ].join("\n");
  return sendEmail({
    to: a.to, subject: `Application received: ${a.jobTitle} (ref ${a.reference})`, html, text,
    idempotencyKey: `job-application-${a.reference}`,
  });
}

// ─── E-book waiting list confirmation ──────────────────────────────────────

export function sendWaitlistConfirmation(a: { to: string; firstName: string; unsubscribeToken: string }) {
  const unsubscribe = `${SITE_URL}/ebook/unsubscribe?token=${a.unsubscribeToken}`;
  const name = firstName(a.firstName);
  const offer = `${ebook.discountPercent}% off at launch`;
  const html = layout({
    preheader: `You’re on the waiting list for ${ebook.title}.`,
    heading: "You’re on the list",
    body:
      p(`Hi ${esc(name)},`) +
      p(`Thanks for joining the waiting list for <strong style="color:#131313;">${esc(ebook.title)}</strong>: ${esc(ebook.subtitle)}.`) +
      p(`The book is still being written. When it’s ready, you’ll hear first${ebook.offerIsPlanned ? `, along with the planned early-bird offer (${esc(offer)})` : ""}. Final price, launch date and offer terms will be shared before anything goes on sale.`) +
      p(`Until then, there are free lessons on the site and in the WhatsApp community.`) +
      button(`${SITE_URL}/learn`, "Read the free lessons"),
    footer: `You’re getting this because you joined the ${esc(ebook.title)} waiting list on buildwithaamir.com. <a href="${unsubscribe}" style="color:#6B6B6B;">Unsubscribe</a>`,
  });
  const text = [
    `Hi ${name},`, "",
    `Thanks for joining the waiting list for ${ebook.title}: ${ebook.subtitle}.`, "",
    `The book is still being written. When it’s ready, you’ll hear first${ebook.offerIsPlanned ? `, along with the planned early-bird offer (${offer})` : ""}. Final price, launch date and offer terms will be shared before anything goes on sale.`, "",
    `Free lessons: ${SITE_URL}/learn`, "", "— Aamir", "",
    `Unsubscribe: ${unsubscribe}`,
  ].join("\n");
  return sendEmail({
    to: a.to, subject: `You’re on the list for ${ebook.title}`, html, text,
    headers: { "List-Unsubscribe": `<${unsubscribe}>` },
  });
}
