import Link from "next/link";
import Symbol from "@/components/admin/Symbol";
import type { Lead } from "@/lib/admin-data";

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" }) + " UTC";
export const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

/** M3 card surface. */
export function Card({ children, className = "", ...rest }: React.HTMLAttributes<HTMLElement>) {
  return <section {...rest} className={`rounded-3xl bg-md-surface-container-low p-5 sm:p-6 ${className}`}>{children}</section>;
}

export function CardTitle({ children, sub, id }: { children: React.ReactNode; sub?: string; id?: string }) {
  return (
    <div className="mb-4">
      <h2 id={id} className="text-base font-medium text-md-on-surface">{children}</h2>
      {sub && <p className="mt-0.5 text-sm text-md-on-surface-variant">{sub}</p>}
    </div>
  );
}

/** KPI tile: the number is the content; the label says what it counts. */
export function Kpi({ label, value, suffix = "", icon, note, trend }: {
  label: string; value: number; suffix?: string; icon: string; note?: string;
  trend?: { dir: "up" | "down" | "flat"; text: string };
}) {
  const trendIcon = trend?.dir === "up" ? "north_east" : trend?.dir === "down" ? "south_east" : "trending_flat";
  return (
    <div data-anim className="flex flex-col rounded-3xl bg-md-surface-container-low p-5">
      <div className="flex items-center justify-between text-md-on-surface-variant">
        <span className="text-sm font-medium">{label}</span>
        <Symbol name={icon} size={22} />
      </div>
      <p className="mt-4 text-[2.25rem] font-normal leading-none tracking-tight text-md-on-surface">
        <span data-count={value} data-suffix={suffix}>{value.toLocaleString("en-US")}{suffix}</span>
      </p>
      {trend && (
        <p className={`mt-3 flex items-center gap-1 text-sm ${trend.dir === "down" ? "text-md-error" : trend.dir === "up" ? "text-md-primary" : "text-md-on-surface-variant"}`}>
          <Symbol name={trendIcon} size={18} /> {trend.text}
        </p>
      )}
      {note && <p className="mt-3 text-sm text-md-on-surface-variant">{note}</p>}
    </div>
  );
}

/** Horizontal bars, single series, values direct-labelled. */
export function BarList({ rows, empty }: { rows: { label: string; count: number }[]; empty: string }) {
  if (!rows.length) return <p className="py-6 text-sm text-md-on-surface-variant">{empty}</p>;
  const max = Math.max(...rows.map(r => r.count));
  return (
    <ul className="space-y-3">
      {rows.map(r => (
        <li key={r.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-md-on-surface" title={r.label}>{r.label}</span>
            <span className="font-medium text-md-on-surface">{r.count.toLocaleString("en-US")}</span>
          </div>
          <div className="h-2 rounded-full bg-md-surface-container-highest">
            <div data-bar className="h-full origin-left rounded-full bg-md-primary" style={{ width: `${Math.max(4, (r.count / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Opt-in meters: share of active leads, labelled with the number and percent. */
export function Meter({ label, value, total, color, icon }: { label: string; value: number; total: number; color: string; icon: string }) {
  const p = pct(value, total);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 text-md-on-surface"><Symbol name={icon} size={20} /> {label}</span>
        <span className="text-md-on-surface"><span className="font-medium">{p}%</span> <span className="text-md-on-surface-variant">· {value} of {total}</span></span>
      </div>
      <div className="h-3 rounded-full bg-md-surface-container-highest" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p}>
        <div data-bar className="h-full origin-left rounded-full" style={{ width: `${p}%`, background: color }} />
      </div>
    </div>
  );
}

export function Initials({ name }: { name: string }) {
  return (
    <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-md-tertiary-container text-sm font-medium text-md-on-tertiary-container">
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

export function ConsentChips({ lead }: { lead: Pick<Lead, "whatsappConsent" | "marketingConsent" | "unsubscribed"> }) {
  if (lead.unsubscribed) {
    return <span className="inline-flex h-7 items-center gap-1 rounded-lg border border-md-outline-variant px-2 text-xs text-md-on-surface-variant"><Symbol name="person_remove" size={16} />Unsubscribed</span>;
  }
  return (
    <span className="flex flex-wrap gap-1.5">
      {lead.whatsappConsent && <span className="inline-flex h-7 items-center gap-1 rounded-lg bg-md-secondary-container px-2 text-xs text-md-on-secondary-container"><Symbol name="chat" size={16} />WhatsApp</span>}
      {lead.marketingConsent && <span className="inline-flex h-7 items-center gap-1 rounded-lg bg-md-secondary-container px-2 text-xs text-md-on-secondary-container"><Symbol name="mail" size={16} />Tips</span>}
      {!lead.whatsappConsent && !lead.marketingConsent && <span className="text-xs text-md-on-surface-variant">Launch updates only</span>}
    </span>
  );
}

/** Shown when DATABASE_URL isn't set yet. */
export function DbNotConnected() {
  return (
    <Card className="mx-auto mt-6 max-w-2xl">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-md-tertiary-container text-md-on-tertiary-container"><Symbol name="database" /></span>
        <div>
          <h2 className="text-lg font-medium text-md-on-surface">Connect the database to see leads</h2>
          <p className="mt-2 text-sm leading-relaxed text-md-on-surface-variant">
            The waiting list stores sign-ups in Postgres. Add your Neon connection string as <code className="rounded bg-md-surface-container-highest px-1">DATABASE_URL</code> in
            Vercel (Production), then redeploy. Tables are created automatically on the first sign-up or visit here.
          </p>
          <Link href="/admin/settings" className="state-layer mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-md-outline px-4 text-sm font-medium text-md-primary">
            View setup checklist
          </Link>
        </div>
      </div>
    </Card>
  );
}
