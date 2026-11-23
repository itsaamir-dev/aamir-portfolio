import type { Metadata } from "next";
import Symbol from "@/components/admin/Symbol";
import Motion from "@/components/admin/Motion";
import { Card, CardTitle } from "@/components/admin/parts";
import { isDbConfigured } from "@/lib/admin-data";
import { getPool } from "@/lib/db";
import { ebook, launchPrice, formatPrice } from "@/lib/ebook";
import { GA_ID } from "@/lib/analytics";
import { WHATSAPP_URL } from "@/lib/site";
import { isRazorpayConfigured, isRazorpayWebhookConfigured, razorpayMode } from "@/lib/razorpay";
import { cashfreeMode, isCashfreeConfigured } from "@/lib/cashfree";
import { activeProvider, PROVIDER_LABEL } from "@/lib/payments";

export const metadata: Metadata = { title: "Setup" };
export const dynamic = "force-dynamic";

async function dbStatus(): Promise<{ ok: boolean; text: string }> {
  if (!isDbConfigured) return { ok: false, text: "DATABASE_URL isn’t set." };
  try {
    await getPool().query("SELECT 1");
    return { ok: true, text: "Connected." };
  } catch (e) {
    return { ok: false, text: `Can’t connect (${(e as { code?: string }).code ?? "error"}). Check the connection string.` };
  }
}

function Row({ ok, title, text, warn }: { ok: boolean; title: string; text: string; warn?: boolean }) {
  const icon = ok ? "check_circle" : warn ? "error" : "error";
  return (
    <li className="flex items-start gap-4 py-4">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${ok ? "bg-md-primary-container text-md-on-primary-container" : warn ? "bg-md-surface-container-highest text-md-on-surface-variant" : "bg-md-error-container text-md-on-error-container"}`}>
        <Symbol name={icon} fill />
      </span>
      <div className="min-w-0">
        <p className="font-medium text-md-on-surface">{title}</p>
        <p className="mt-0.5 break-words text-sm leading-relaxed text-md-on-surface-variant [overflow-wrap:anywhere]">{text}</p>
      </div>
    </li>
  );
}

export default async function SettingsPage() {
  const db = await dbStatus();
  const price = launchPrice();

  return (
    <Motion className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2 [&>*]:min-w-0">
      <Card data-anim aria-labelledby="checks-h">
        <CardTitle id="checks-h" sub="What the waiting list and job referrals need to run">Setup checklist</CardTitle>
        <ul className="divide-y divide-md-outline-variant">
          <Row ok={db.ok} title="Database (Neon Postgres)" text={db.text} />
          <Row ok title="Admin sign-in" text="Protected by ADMIN_PASSWORD. Sessions last 7 days." />
          <Row ok={Boolean(GA_ID)} warn title="Google Analytics" text={GA_ID ? `Tracking with ${GA_ID}. E-book events: ebook_waitlist_success and others.` : "NEXT_PUBLIC_GA_ID isn’t set — sign-ups still save, but aren’t tracked."} />
          <Row ok={false} warn title="Confirmation emails" text="Not set up. Sign-ups are saved and see an on-page confirmation. Add an email provider (e.g. Resend) to send emails." />
          <Row ok title="WhatsApp community link" text={WHATSAPP_URL} />
          <Row ok={Boolean(activeProvider())} title="Job referral payments"
               text={activeProvider()
                 ? `New applications pay through ${PROVIDER_LABEL[activeProvider()!]}.${isCashfreeConfigured && isRazorpayConfigured ? " Both gateways are set up — PAYMENT_PROVIDER picks one (Cashfree by default)." : ""}`
                 : "No payment gateway is set up. Add Cashfree (CASHFREE_APP_ID, CASHFREE_SECRET_KEY) or Razorpay keys — applicants can’t pay or submit until you do."} />
          <Row ok={isCashfreeConfigured} warn title="Cashfree"
               text={isCashfreeConfigured
                 ? `Connected in ${cashfreeMode} mode.${cashfreeMode === "sandbox" ? " Test payments only — use production keys (and CASHFREE_ENV=production) to take real money." : ""} Payment webhooks go to /api/cashfree/webhook automatically.`
                 : "CASHFREE_APP_ID and CASHFREE_SECRET_KEY aren’t set."} />
          <Row ok={isRazorpayConfigured} warn title="Razorpay"
               text={isRazorpayConfigured
                 ? `Connected in ${razorpayMode} mode.${razorpayMode === "test" ? " Test payments only — switch to rzp_live_ keys to take real money." : ""}`
                 : "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET aren’t set."} />
          {isRazorpayConfigured && <Row ok={isRazorpayWebhookConfigured} warn title="Razorpay webhook"
               text={isRazorpayWebhookConfigured
                 ? "RAZORPAY_WEBHOOK_SECRET is set. Payments are confirmed even if an applicant closes the tab."
                 : "Optional but recommended: add a webhook to /api/razorpay/webhook (payment.captured, payment.failed, order.paid) and set RAZORPAY_WEBHOOK_SECRET."} />}
        </ul>
      </Card>

      <Card data-anim aria-labelledby="offer-h">
        <CardTitle id="offer-h" sub="Edit in lib/ebook.ts and redeploy">E-book offer</CardTitle>
        <dl className="divide-y divide-md-outline-variant text-sm">
          {[
            ["Title", `${ebook.title}: ${ebook.subtitle}`],
            ["Status", ebook.status === "waitlist" ? "Waiting list open — not on sale" : "Launched"],
            ["Launch discount", `${ebook.discountPercent}%${ebook.offerIsPlanned ? " (planned, terms not confirmed)" : ""}`],
            ["Regular price", ebook.regularPrice != null ? formatPrice(ebook.regularPrice) : "Not set"],
            ["Launch price", price != null ? formatPrice(price) : "Shown once the regular price is set"],
            ["Launch date", ebook.launchDate ?? "Not set — no date is shown on the site"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <dt className="text-md-on-surface-variant">{k}</dt>
              <dd className="text-md-on-surface">{v}</dd>
            </div>
          ))}
        </dl>
        <a href="/ebook" target="_blank" rel="noopener noreferrer"
           className="state-layer mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-md-outline px-4 text-sm font-medium text-md-primary">
          <Symbol name="menu_book" size={20} /> Open the e-book page
        </a>
      </Card>
    </Motion>
  );
}
