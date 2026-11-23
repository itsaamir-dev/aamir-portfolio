import type { Metadata } from "next";
import Link from "next/link";
import Motion from "@/components/admin/Motion";
import AreaChart from "@/components/admin/AreaChart";
import EmptyState from "@/components/admin/EmptyState";
import Symbol from "@/components/admin/Symbol";
import WorldMap from "@/components/admin/WorldMap";
import { Card, CardTitle, Kpi, BarList, DbNotConnected } from "@/components/admin/parts";
import { isDbConfigured } from "@/lib/db";
import { getAnalytics, A_RANGES, type ARangeKey } from "@/lib/analytics-data";
import { buildMap } from "@/lib/world-map";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

const RANGE_LABEL: Record<ARangeKey, string> = { "24h": "24 hours", "7d": "7 days", "30d": "30 days", "90d": "90 days" };

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const countryName = (code: string | null) => {
  if (!code) return "Unknown";
  try { return regionNames.of(code) ?? code; } catch { return code; }
};
const flag = (code: string | null) =>
  code && /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(127397 + code.charCodeAt(0), 127397 + code.charCodeAt(1)) : "🌐";

function trend(now: number, prev: number, what: string) {
  if (!prev && !now) return { dir: "flat" as const, text: `No ${what} yet` };
  if (!prev) return { dir: "up" as const, text: "New this period" };
  const change = Math.round(((now - prev) / prev) * 100);
  if (change === 0) return { dir: "flat" as const, text: "Same as the period before" };
  return { dir: change > 0 ? ("up" as const) : ("down" as const), text: `${change > 0 ? "+" : ""}${change}% vs the period before` };
}

function ago(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

const DEVICE_ICON: Record<string, string> = { mobile: "smartphone", tablet: "tablet", desktop: "computer" };

export default async function AnalyticsPage({ searchParams }: { searchParams: { range?: string } }) {
  if (!isDbConfigured) return <DbNotConnected />;
  const range = (searchParams.range && searchParams.range in A_RANGES ? searchParams.range : "7d") as ARangeKey;
  const a = await getAnalytics(range);
  const map = buildMap(a.cities);
  const per = RANGE_LABEL[range];

  const rangeNav = (
    <nav aria-label="Time range" className="flex h-10 overflow-hidden rounded-full border border-md-outline text-sm font-medium">
      {(Object.keys(A_RANGES) as ARangeKey[]).map((k, i) => {
        const on = k === range;
        return (
          <Link key={k} href={`/admin/analytics?range=${k}`} scroll={false} aria-current={on ? "true" : undefined}
                className={`state-layer flex items-center gap-1 px-3 sm:px-4 ${i ? "border-l border-md-outline" : ""}
                            ${on ? "bg-md-secondary-container text-md-on-secondary-container" : "text-md-on-surface"}`}>
            {on && <Symbol name="check" size={18} />}{k === "24h" ? "24h" : RANGE_LABEL[k]}
          </Link>
        );
      })}
    </nav>
  );

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[1.75rem] font-normal tracking-tight text-md-on-surface">Analytics</h1>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-md-on-surface-variant">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-md-primary-container px-2.5 py-1 font-medium text-md-on-primary-container">
            <span aria-hidden="true" className="relative flex h-2 w-2">
              {a.live > 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-md-primary opacity-60 motion-reduce:animate-none" />}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-md-primary" />
            </span>
            {a.live} live now
          </span>
          Public site only · your own visits while signed in aren’t counted
        </p>
      </div>
      {rangeNav}
    </div>
  );

  if (a.views === 0 && a.prevViews === 0 && a.recent.length === 0) {
    return (
      <Motion className="mx-auto max-w-6xl space-y-4">
        {header}
        <Card data-anim className="mx-auto mt-6 max-w-2xl">
          <EmptyState title="No visits recorded yet">
            <p>Page views from the public site will appear here within seconds — including the country and city each visit came from.</p>
          </EmptyState>
        </Card>
      </Motion>
    );
  }

  const topCountry = a.countries[0];
  const devTotal = a.devices.reduce((s, d) => s + d.count, 0);

  return (
    <Motion className="mx-auto max-w-6xl space-y-4">
      {header}

      <section aria-label="Key numbers" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Kpi label="Page views" value={a.views} icon="visibility" trend={trend(a.views, a.prevViews, "views")} />
        <Kpi label="Unique visitors" value={a.visitors} icon="group" trend={trend(a.visitors, a.prevVisitors, "visitors")} />
        <Kpi label="Countries" value={a.countriesCount} icon="public"
             note={topCountry ? `Most from ${flag(topCountry.code)} ${countryName(topCountry.code)}` : "No location data yet"} />
        <Kpi label="Pages per visitor" value={a.visitors ? Math.round((a.views / a.visitors) * 10) / 10 : 0} icon="insights"
             note={a.pages[0] ? `Top page: ${a.pages[0].path}` : undefined} />
      </section>

      {/* Map + countries */}
      <Card data-anim aria-labelledby="map-h" className="overflow-hidden">
        <CardTitle id="map-h" sub={`Last ${per} · approximate location from each visitor’s IP (city level)`}>Where visitors are</CardTitle>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] [&>*]:min-w-0">
          <div className="-mx-2 rounded-2xl bg-md-surface-container px-2 py-3 sm:px-4">
            {a.cities.length
              ? <WorldMap {...map} label={`World map of visitors, last ${per}: ${a.cities.length} cities in ${a.countriesCount} countries.`} />
              : <p className="py-16 text-center text-sm text-md-on-surface-variant">No location data in this range yet.</p>}
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-md-on-surface">Top countries</h3>
            {a.countries.length ? (
              <ol className="space-y-3">
                {a.countries.slice(0, 8).map((c, i) => (
                  <li key={c.code}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 text-md-on-surface">
                        <span className="w-4 text-right text-xs text-md-on-surface-variant">{i + 1}</span>
                        <span aria-hidden="true" className="text-base leading-none">{flag(c.code)}</span>
                        <span className="truncate">{countryName(c.code)}</span>
                      </span>
                      <span className="shrink-0 font-medium text-md-on-surface">{c.views.toLocaleString("en-US")}</span>
                    </div>
                    <div className="ml-6 h-1.5 rounded-full bg-md-surface-container-highest">
                      <div data-bar className="h-full origin-left rounded-full" style={{ width: `${Math.max(4, (c.views / a.countries[0].views) * 100)}%`, background: "var(--md-series-1)" }} />
                    </div>
                  </li>
                ))}
              </ol>
            ) : <p className="text-sm text-md-on-surface-variant">No country data yet.</p>}
          </div>
        </div>
      </Card>

      <Card data-anim aria-labelledby="trend-h">
        <CardTitle id="trend-h" sub={a.hourly ? "Hourly, last 24 hours (UTC)" : `Daily, last ${per} (UTC)`}>Page views over time</CardTitle>
        <AreaChart data={a.series} label={`Page views, last ${per}`} unit="view" />
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
        {/* Top pages */}
        <Card data-anim aria-labelledby="pages-h">
          <CardTitle id="pages-h" sub={`Last ${per} · which pages get the most hits`}>Top pages</CardTitle>
          {a.pages.length ? (
            <div className="-mx-2">
              <table className="w-full table-fixed text-sm">
                <thead>
                  <tr className="text-left text-xs text-md-on-surface-variant">
                    <th scope="col" className="px-2 pb-2 font-medium">Page</th>
                    <th scope="col" className="w-16 px-2 pb-2 text-right font-medium">Views</th>
                    <th scope="col" className="w-[4.5rem] px-2 pb-2 text-right font-medium">Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {a.pages.map(p => (
                    <tr key={p.path} className="group border-t border-md-outline-variant">
                      <td className="relative px-2 py-2.5">
                        <span aria-hidden="true" className="absolute inset-y-1 left-0 rounded-lg bg-md-primary/10"
                              style={{ width: `${(p.views / a.pages[0].views) * 100}%` }} />
                        <a href={p.path} target="_blank" rel="noopener noreferrer"
                           className="relative flex items-center gap-1 truncate text-md-on-surface hover:text-md-primary hover:underline">
                          <span className="truncate">{p.path}</span>
                          <Symbol name="open_in_new" size={14} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                        </a>
                      </td>
                      <td className="px-2 py-2.5 text-right font-medium text-md-on-surface">{p.views.toLocaleString("en-US")}</td>
                      <td className="px-2 py-2.5 text-right text-md-on-surface-variant">{p.visitors.toLocaleString("en-US")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="py-6 text-sm text-md-on-surface-variant">No page views in this range.</p>}
        </Card>

        {/* Top cities */}
        <Card data-anim aria-labelledby="cities-h">
          <CardTitle id="cities-h" sub={`Last ${per} · views by city`}>Top cities</CardTitle>
          {a.cities.length ? (
            <ol className="-mx-2 divide-y divide-md-outline-variant">
              {a.cities.slice(0, 10).map((c, i) => (
                <li key={`${c.city}-${c.country}`} className="flex items-center gap-3 px-2 py-2.5 text-sm">
                  <span className="w-5 text-right text-xs text-md-on-surface-variant">{i + 1}</span>
                  <span aria-hidden="true" className="text-base leading-none">{flag(c.country)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-md-on-surface">{c.city}</span>
                    <span className="block truncate text-xs text-md-on-surface-variant">{[c.region, countryName(c.country)].filter(Boolean).join(", ")}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-medium text-md-on-surface">{c.views.toLocaleString("en-US")}</span>
                    <span className="block text-xs text-md-on-surface-variant">{c.visitors} visitor{c.visitors === 1 ? "" : "s"}</span>
                  </span>
                </li>
              ))}
            </ol>
          ) : <p className="py-6 text-sm text-md-on-surface-variant">No city data in this range.</p>}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        <Card data-anim aria-labelledby="ref-h">
          <CardTitle id="ref-h" sub="Visitors by the site that sent them">Traffic sources</CardTitle>
          <BarList rows={a.referrers} empty="No visits in this range." />
        </Card>
        <Card data-anim aria-labelledby="dev-h">
          <CardTitle id="dev-h" sub="Share of visitors">Devices</CardTitle>
          {devTotal ? (
            <ul className="space-y-4">
              {a.devices.map(d => {
                const p = Math.round((d.count / devTotal) * 100);
                return (
                  <li key={d.label}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 capitalize text-md-on-surface"><Symbol name={DEVICE_ICON[d.label] ?? "devices"} size={20} />{d.label}</span>
                      <span className="text-md-on-surface"><span className="font-medium">{p}%</span> <span className="text-md-on-surface-variant">· {d.count}</span></span>
                    </div>
                    <div className="h-3 rounded-full bg-md-surface-container-highest">
                      <div data-bar className="h-full origin-left rounded-full" style={{ width: `${Math.max(3, p)}%`, background: "var(--md-series-2)" }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : <p className="py-6 text-sm text-md-on-surface-variant">No visits in this range.</p>}
        </Card>
        <Card data-anim aria-labelledby="br-h">
          <CardTitle id="br-h" sub="Visitors by browser">Browsers</CardTitle>
          <BarList rows={a.browsers} empty="No visits in this range." />
        </Card>
      </div>

      <Card data-anim aria-labelledby="recent-h">
        <CardTitle id="recent-h" sub="The latest page views, newest first">Recent visits</CardTitle>
        <ul className="-mx-2 divide-y divide-md-outline-variant">
          {a.recent.map((r, i) => (
            <li key={`${r.at}-${i}`} className="flex items-center gap-3 px-2 py-2.5 text-sm">
              <span aria-hidden="true" className="text-lg leading-none">{flag(r.country)}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-md-on-surface">{r.path}</span>
                <span className="block truncate text-xs text-md-on-surface-variant">
                  {[r.city, countryName(r.country)].filter(Boolean).join(", ")}{r.device ? ` · ${r.device}` : ""}
                </span>
              </span>
              <time dateTime={r.at} className="shrink-0 text-xs text-md-on-surface-variant">{ago(r.at)}</time>
            </li>
          ))}
        </ul>
      </Card>
    </Motion>
  );
}
