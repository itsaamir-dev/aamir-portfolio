import type { Metadata } from "next";
import Symbol from "@/components/admin/Symbol";
import Motion from "@/components/admin/Motion";
import { Card, CardTitle } from "@/components/admin/parts";
import { isDbConfigured } from "@/lib/admin-data";
import { getPool } from "@/lib/db";
import { ebook, launchPrice, formatPrice } from "@/lib/ebook";
import { GA_ID } from "@/lib/analytics";
import { WHATSAPP_URL } from "@/lib/site";

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
        <CardTitle id="checks-h" sub="What the waiting list needs to run">Setup checklist</CardTitle>
        <ul className="divide-y divide-md-outline-variant">
          <Row ok={db.ok} title="Database (Neon Postgres)" text={db.text} />
          <Row ok title="Admin sign-in" text="Protected by ADMIN_PASSWORD. Sessions last 7 days." />
          <Row ok={Boolean(GA_ID)} warn title="Google Analytics" text={GA_ID ? `Tracking with ${GA_ID}. E-book events: ebook_waitlist_success and others.` : "NEXT_PUBLIC_GA_ID isn’t set — sign-ups still save, but aren’t tracked."} />
          <Row ok={false} warn title="Confirmation emails" text="Not set up. Sign-ups are saved and see an on-page confirmation. Add an email provider (e.g. Resend) to send emails." />
          <Row ok title="WhatsApp community link" text={WHATSAPP_URL} />
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
