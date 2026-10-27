import type { Metadata } from "next";
import Link from "next/link";
import Motion from "@/components/admin/Motion";
import AreaChart from "@/components/admin/AreaChart";
import EmptyState from "@/components/admin/EmptyState";
import Symbol from "@/components/admin/Symbol";
import { Card, CardTitle, Kpi, BarList, Meter, Initials, ConsentChips, DbNotConnected, fmtDateTime } from "@/components/admin/parts";
import { getOverview, isDbConfigured, RANGES, type RangeKey } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

const RANGE_LABEL: Record<RangeKey, string> = { "7d": "7 days", "30d": "30 days", "90d": "90 days" };

function weekTrend(last7: number, prev7: number) {
  if (!prev7 && !last7) return { dir: "flat" as const, text: "No sign-ups in the last 2 weeks" };
  if (!prev7) return { dir: "up" as const, text: "First sign-ups this week" };
  const change = Math.round(((last7 - prev7) / prev7) * 100);
  if (change === 0) return { dir: "flat" as const, text: "Same as the week before" };
  return { dir: change > 0 ? ("up" as const) : ("down" as const), text: `${change > 0 ? "+" : ""}${change}% vs the week before` };
}

export default async function OverviewPage({ searchParams }: { searchParams: { range?: string } }) {
  if (!isDbConfigured) return <DbNotConnected />;

  const range = (searchParams.range && searchParams.range in RANGES ? searchParams.range : "30d") as RangeKey;
  const o = await getOverview(range);

  if (o.total === 0) {
    return (
      <Card className="mx-auto mt-6 max-w-2xl">
        <EmptyState title="No sign-ups yet">
          <p>
            New waiting-list sign-ups from <a href="/ebook" target="_blank" className="font-medium text-md-primary underline underline-offset-4">/ebook</a> will
            appear here. Share the page with a <code className="rounded bg-md-surface-container-highest px-1">?utm_source=</code> tag to see where people come from.
          </p>
        </EmptyState>
      </Card>
    );
  }

  return (
    <Motion className="mx-auto max-w-6xl space-y-4">
      {/* KPIs */}
      <section aria-label="Key numbers" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Kpi label="On the waiting list" value={o.active} icon="group"
             note={o.unsubscribed ? `${o.unsubscribed} unsubscribed` : "No one has unsubscribed"} />
        <Kpi label="New this week" value={o.last7} icon="trending_flat" trend={weekTrend(o.last7, o.prev7)} />
        <Kpi label="WhatsApp opt-ins" value={o.whatsappOptIn} icon="chat" note={`${o.withWhatsapp} left a number`} />
        <Kpi label="Email tips opt-ins" value={o.marketingOptIn} icon="mail" note="Beyond launch updates" />
      </section>

      {/* Trend */}
      <Card data-anim aria-labelledby="trend-h">
        <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
          <CardTitle id="trend-h" sub={`Daily, last ${RANGE_LABEL[range]} (UTC)`}>Sign-ups over time</CardTitle>
          {/* M3 segmented buttons */}
          <nav aria-label="Time range" className="flex h-10 overflow-hidden rounded-full border border-md-outline text-sm font-medium">
            {(Object.keys(RANGES) as RangeKey[]).map((k, i) => {
              const on = k === range;
              return (
                <Link key={k} href={`/admin?range=${k}`} scroll={false} aria-current={on ? "true" : undefined}
                      className={`state-layer flex items-center gap-1 px-4 ${i ? "border-l border-md-outline" : ""}
                                  ${on ? "bg-md-secondary-container text-md-on-secondary-container" : "text-md-on-surface"}`}>
                  {on && <Symbol name="check" size={18} />}{RANGE_LABEL[k]}
                </Link>
              );
            })}
          </nav>
        </div>
        <AreaChart data={o.daily} label={`Sign-ups per day, last ${RANGE_LABEL[range]}`} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card data-anim aria-labelledby="src-h">
          <CardTitle id="src-h" sub={`Last ${RANGE_LABEL[range]} · UTM source, or the form location`}>Where sign-ups come from</CardTitle>
          <BarList rows={o.sources} empty="No sign-ups in this range." />
        </Card>
        <Card data-anim aria-labelledby="cmp-h">
          <CardTitle id="cmp-h" sub={`Last ${RANGE_LABEL[range]} · utm_campaign`}>Campaigns</CardTitle>
          <BarList rows={o.campaigns} empty="No tagged campaigns yet. Add ?utm_campaign=… to your links." />
        </Card>
        <Card data-anim aria-labelledby="opt-h">
          <CardTitle id="opt-h" sub="Share of people still on the list">Opt-ins</CardTitle>
          <div className="space-y-5">
            <Meter label="WhatsApp updates" value={o.whatsappOptIn} total={o.active} color="var(--md-series-1)" icon="chat" />
            <Meter label="Email tips" value={o.marketingOptIn} total={o.active} color="var(--md-series-2)" icon="mail" />
          </div>
          <p className="mt-5 text-xs leading-relaxed text-md-on-surface-variant">
            Only contact people on a channel they opted into. Everyone on the list gets e-book launch emails.
          </p>
        </Card>
      </div>

      {/* Recent */}
      <Card data-anim aria-labelledby="recent-h">
        <div className="flex items-center justify-between">
          <CardTitle id="recent-h">Latest sign-ups</CardTitle>
          <Link href="/admin/leads" className="state-layer -mt-4 inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium text-md-primary">
            All leads <Symbol name="chevron_right" size={20} />
          </Link>
        </div>
        <ul className="-mx-2 divide-y divide-md-outline-variant">
          {o.recent.map(l => (
            <li key={l.id} className="flex items-center gap-3 px-2 py-3">
              <Initials name={l.firstName} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-md-on-surface">{l.firstName}</p>
                <p className="truncate text-sm text-md-on-surface-variant">{l.email}</p>
              </div>
              <div className="hidden sm:block"><ConsentChips lead={l} /></div>
              <time dateTime={l.createdAt} className="shrink-0 text-xs text-md-on-surface-variant">{fmtDateTime(l.createdAt)}</time>
            </li>
          ))}
        </ul>
      </Card>
    </Motion>
  );
}
