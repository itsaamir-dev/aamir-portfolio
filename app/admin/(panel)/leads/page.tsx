import type { Metadata } from "next";
import Link from "next/link";
import Motion from "@/components/admin/Motion";
import EmptyState from "@/components/admin/EmptyState";
import LeadActions from "@/components/admin/LeadActions";
import Symbol from "@/components/admin/Symbol";
import { Card, Initials, ConsentChips, DbNotConnected, fmtDate } from "@/components/admin/parts";
import { getLeads, isDbConfigured, LEAD_FILTERS, type LeadFilter } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const FILTER_LABEL: Record<LeadFilter, string> = {
  all: "All", whatsapp: "WhatsApp opt-in", marketing: "Email tips opt-in", unsubscribed: "Unsubscribed",
};

type SP = { q?: string; filter?: string; page?: string; order?: string };

function href(sp: SP, patch: Partial<SP>) {
  const p = new URLSearchParams();
  const merged = { ...sp, ...patch };
  for (const [k, v] of Object.entries(merged)) if (v && !(k === "filter" && v === "all") && !(k === "page" && v === "1")) p.set(k, v);
  const s = p.toString();
  return `/admin/leads${s ? `?${s}` : ""}`;
}

function source(l: { utmSource: string | null; utmMedium: string | null; utmCampaign: string | null; source: string }) {
  return [l.utmSource ?? l.source, l.utmMedium, l.utmCampaign].filter(Boolean).join(" / ");
}

export default async function LeadsPage({ searchParams }: { searchParams: SP }) {
  if (!isDbConfigured) return <DbNotConnected />;

  const filter = (LEAD_FILTERS as readonly string[]).includes(searchParams.filter ?? "") ? (searchParams.filter as LeadFilter) : "all";
  const order  = searchParams.order === "old" ? "old" : "new";
  const q      = (searchParams.q ?? "").slice(0, 100);
  const { leads, total, page, pages } = await getLeads({ q, filter, order, page: Number(searchParams.page) || 1 });
  const sp: SP = { q: q || undefined, filter, order: order === "old" ? "old" : undefined };
  const exportHref = `/api/admin/leads/export?${new URLSearchParams({ ...(q && { q }), ...(filter !== "all" && { filter }) })}`;

  return (
    <Motion className="mx-auto max-w-6xl space-y-4">
      {/* Search + export */}
      <div data-anim className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form role="search" action="/admin/leads" className="flex h-14 flex-1 items-center gap-2 rounded-full bg-md-surface-container-high px-4">
          <Symbol name="search" className="text-md-on-surface-variant" />
          <label htmlFor="lead-search" className="sr-only">Search leads</label>
          <input id="lead-search" name="q" defaultValue={q} placeholder="Search name, email or number"
                 className="h-full min-w-0 flex-1 bg-transparent text-base text-md-on-surface outline-none placeholder:text-md-on-surface-variant" />
          {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
          {q && <Link href={href(sp, { q: undefined, page: "1" })} aria-label="Clear search" className="state-layer grid h-10 w-10 place-items-center rounded-full text-md-on-surface-variant"><Symbol name="close" /></Link>}
        </form>
        <a href={exportHref} download
           className="state-layer inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-md-primary-container px-5 text-sm font-medium text-md-on-primary-container">
          <Symbol name="download" /> Export CSV
        </a>
      </div>

      {/* Filter chips */}
      <div data-anim className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter leads">
        {LEAD_FILTERS.map(f => {
          const on = f === filter;
          return (
            <Link key={f} href={href(sp, { filter: f, page: "1" })} aria-current={on ? "true" : undefined}
                  className={`state-layer inline-flex h-8 items-center gap-1 rounded-lg px-3 text-sm font-medium
                              ${on ? "bg-md-secondary-container text-md-on-secondary-container" : "border border-md-outline text-md-on-surface-variant"}`}>
              {on && <Symbol name="check" size={18} />}{FILTER_LABEL[f]}
            </Link>
          );
        })}
        <Link href={href(sp, { order: order === "new" ? "old" : undefined, page: "1" })}
              className="state-layer ml-auto inline-flex h-8 items-center gap-1 rounded-lg px-3 text-sm font-medium text-md-primary">
          <Symbol name="filter_list" size={18} />{order === "new" ? "Newest first" : "Oldest first"}
        </Link>
      </div>

      <Card data-anim className="p-0 sm:p-0">
        {leads.length === 0 ? (
          <EmptyState title={q || filter !== "all" ? "No leads match" : "No sign-ups yet"}>
            {q || filter !== "all"
              ? <p>Try a different search or <Link href="/admin/leads" className="font-medium text-md-primary underline underline-offset-4">clear the filters</Link>.</p>
              : <p>Sign-ups from the <a href="/ebook" target="_blank" className="font-medium text-md-primary underline underline-offset-4">e-book page</a> will appear here.</p>}
          </EmptyState>
        ) : (
          <>
            <p className="px-5 pt-5 text-sm text-md-on-surface-variant" aria-live="polite">
              {total.toLocaleString("en-US")} lead{total === 1 ? "" : "s"}{q && <> matching “{q}”</>}
            </p>

            {/* Table — tablets and up */}
            <div className="hidden md:block">
              <table className="mt-2 w-full text-left text-sm">
                <thead className="text-md-on-surface-variant">
                  <tr className="border-b border-md-outline-variant">
                    <th scope="col" className="px-5 py-3 font-medium">Name</th>
                    <th scope="col" className="px-3 py-3 font-medium">WhatsApp</th>
                    <th scope="col" className="px-3 py-3 font-medium">Source</th>
                    <th scope="col" className="px-3 py-3 font-medium">Opt-ins</th>
                    <th scope="col" className="px-3 py-3 font-medium" aria-sort={order === "new" ? "descending" : "ascending"}>Joined</th>
                    <th scope="col" className="w-14 px-3 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l.id} className={`border-b border-md-outline-variant last:border-0 ${l.unsubscribed ? "opacity-60" : ""}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Initials name={l.firstName} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-md-on-surface">{l.firstName}</p>
                            <p className="truncate text-md-on-surface-variant">{l.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-md-on-surface">{l.whatsapp ?? <span className="text-md-on-surface-variant">—</span>}</td>
                      <td className="max-w-[14rem] truncate px-3 py-3 text-md-on-surface-variant" title={source(l)}>{source(l)}</td>
                      <td className="px-3 py-3"><ConsentChips lead={l} /></td>
                      <td className="whitespace-nowrap px-3 py-3 text-md-on-surface-variant"><time dateTime={l.createdAt}>{fmtDate(l.createdAt)}</time></td>
                      <td className="px-3 py-3"><LeadActions id={l.id} name={l.firstName} email={l.email} unsubscribed={l.unsubscribed} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* List — phones */}
            <ul className="mt-2 divide-y divide-md-outline-variant md:hidden">
              {leads.map(l => (
                <li key={l.id} className={`flex gap-3 px-4 py-4 ${l.unsubscribed ? "opacity-60" : ""}`}>
                  <Initials name={l.firstName} />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="truncate font-medium text-md-on-surface">{l.firstName}</p>
                    <p className="truncate text-sm text-md-on-surface-variant">{l.email}</p>
                    {l.whatsapp && <p className="text-sm text-md-on-surface">{l.whatsapp}</p>}
                    <ConsentChips lead={l} />
                    <p className="text-xs text-md-on-surface-variant">{source(l)} · <time dateTime={l.createdAt}>{fmtDate(l.createdAt)}</time></p>
                  </div>
                  <LeadActions id={l.id} name={l.firstName} email={l.email} unsubscribed={l.unsubscribed} />
                </li>
              ))}
            </ul>

            {pages > 1 && (
              <nav aria-label="Pagination" className="flex items-center justify-end gap-1 border-t border-md-outline-variant px-3 py-2 text-sm text-md-on-surface-variant">
                <span className="mr-2">Page {page} of {pages}</span>
                {page > 1
                  ? <Link href={href(sp, { page: String(page - 1) })} aria-label="Previous page" className="state-layer grid h-10 w-10 place-items-center rounded-full"><Symbol name="chevron_left" /></Link>
                  : <span aria-hidden="true" className="grid h-10 w-10 place-items-center opacity-40"><Symbol name="chevron_left" /></span>}
                {page < pages
                  ? <Link href={href(sp, { page: String(page + 1) })} aria-label="Next page" className="state-layer grid h-10 w-10 place-items-center rounded-full"><Symbol name="chevron_right" /></Link>
                  : <span aria-hidden="true" className="grid h-10 w-10 place-items-center opacity-40"><Symbol name="chevron_right" /></span>}
              </nav>
            )}
          </>
        )}
      </Card>
    </Motion>
  );
}
