import type { Metadata } from "next";
import Link from "next/link";
import Motion from "@/components/admin/Motion";
import EmptyState from "@/components/admin/EmptyState";
import ApplicationActions from "@/components/admin/ApplicationActions";
import Symbol from "@/components/admin/Symbol";
import { Card, Initials, DbNotConnected, fmtDateTime } from "@/components/admin/parts";
import { isDbConfigured, listApplications, listJobsAdmin } from "@/lib/jobs-data";
import { PAYMENT_STATUSES, REVIEW_STATUSES, formatFee, type PaymentStatus, type ReviewStatus } from "@/lib/jobs";

export const metadata: Metadata = { title: "Applications" };
export const dynamic = "force-dynamic";

type SP = { job?: string; payment?: string; review?: string; q?: string; page?: string };

const PAYMENT_LABEL: Record<PaymentStatus | "all", string> = { paid: "Paid", pending: "Unpaid", failed: "Payment failed", refunded: "Refunded", all: "All" };
const PAYMENT_CHIP: Record<PaymentStatus, string> = {
  paid:     "bg-md-primary-container text-md-on-primary-container",
  pending:  "border border-md-outline text-md-on-surface-variant",
  failed:   "bg-md-error-container text-md-on-error-container",
  refunded: "bg-md-surface-container-highest text-md-on-surface-variant",
};

function href(sp: SP, patch: Partial<SP>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...sp, ...patch })) if (v && !(k === "page" && v === "1")) p.set(k, v);
  const s = p.toString();
  return `/admin/applications${s ? `?${s}` : ""}`;
}

const waLink = (phone: string) => `https://wa.me/${phone.replace(/^\+/, "")}`;

export default async function ApplicationsPage({ searchParams }: { searchParams: SP }) {
  if (!isDbConfigured) return <DbNotConnected />;

  const jobId = Number(searchParams.job) || undefined;
  // Default to paid: unpaid rows are abandoned checkouts.
  const payment = ([...PAYMENT_STATUSES, "all"] as string[]).includes(searchParams.payment ?? "") ? (searchParams.payment as PaymentStatus | "all") : "paid";
  const review = (searchParams.review ?? "") in REVIEW_STATUSES ? (searchParams.review as ReviewStatus) : "all";
  const q = (searchParams.q ?? "").slice(0, 100);

  const [{ applications, total, page, pages }, jobs] = await Promise.all([
    listApplications({ jobId, payment, review, q, page: Number(searchParams.page) || 1 }),
    listJobsAdmin(),
  ]);
  const sp: SP = { job: jobId ? String(jobId) : undefined, payment: payment === "paid" ? undefined : payment,
                   review: review === "all" ? undefined : review, q: q || undefined };
  const chip = (on: boolean) =>
    `state-layer inline-flex h-8 items-center gap-1 rounded-lg px-3 text-sm font-medium ${on ? "bg-md-secondary-container text-md-on-secondary-container" : "border border-md-outline text-md-on-surface-variant"}`;

  return (
    <Motion className="mx-auto max-w-5xl space-y-4">
      {/* Search + job filter */}
      <form data-anim action="/admin/applications" className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-14 flex-1 items-center gap-2 rounded-full bg-md-surface-container-high px-4">
          <Symbol name="search" className="text-md-on-surface-variant" />
          <label htmlFor="app-search" className="sr-only">Search applications</label>
          <input id="app-search" name="q" defaultValue={q} placeholder="Search name, email or number"
                 className="h-full min-w-0 flex-1 bg-transparent text-base text-md-on-surface outline-none placeholder:text-md-on-surface-variant" />
        </div>
        <label htmlFor="app-job" className="sr-only">Job</label>
        <select id="app-job" name="job" defaultValue={jobId ?? ""}
                className="h-14 rounded-2xl border border-md-outline bg-transparent px-4 text-sm text-md-on-surface sm:max-w-[16rem]">
          <option value="">All jobs</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        {payment !== "paid" && <input type="hidden" name="payment" value={payment} />}
        {review !== "all" && <input type="hidden" name="review" value={review} />}
        <button type="submit" className="state-layer inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-md-primary-container px-5 text-sm font-medium text-md-on-primary-container">
          <Symbol name="filter_list" /> Apply
        </button>
      </form>

      {/* Filter chips */}
      <div data-anim className="flex flex-wrap items-center gap-2" role="group" aria-label="Payment status">
        {(["paid", "pending", "failed", "refunded", "all"] as const).map(p => (
          <Link key={p} href={href(sp, { payment: p === "paid" ? undefined : p, page: "1" })} aria-current={p === payment ? "true" : undefined} className={chip(p === payment)}>
            {p === payment && <Symbol name="check" size={18} />}{PAYMENT_LABEL[p]}
          </Link>
        ))}
        <span className="mx-1 hidden h-6 w-px bg-md-outline-variant sm:block" />
        {(["all", ...Object.keys(REVIEW_STATUSES)] as (ReviewStatus | "all")[]).map(r => (
          <Link key={r} href={href(sp, { review: r === "all" ? undefined : r, page: "1" })} aria-current={r === review ? "true" : undefined} className={chip(r === review)}>
            {r === review && <Symbol name="check" size={18} />}{r === "all" ? "Any review" : REVIEW_STATUSES[r]}
          </Link>
        ))}
      </div>

      <p data-anim className="text-sm text-md-on-surface-variant" aria-live="polite">
        {total.toLocaleString("en-US")} application{total === 1 ? "" : "s"}
      </p>

      {applications.length === 0 ? (
        <Card data-anim>
          <EmptyState title="No applications match">
            {q || jobId || review !== "all" || payment !== "paid"
              ? <p>Try a different search or <Link href="/admin/applications" className="font-medium text-md-primary underline underline-offset-4">clear the filters</Link>.</p>
              : <p>Paid applications from your <a href="/jobs" target="_blank" className="font-medium text-md-primary underline underline-offset-4">job posts</a> will appear here.</p>}
          </EmptyState>
        </Card>
      ) : (
        <ul className="space-y-3">
          {applications.map(a => (
            <li key={a.id} data-anim>
              <details className="group rounded-3xl bg-md-surface-container-low">
                <summary className="state-layer flex cursor-pointer list-none items-start gap-3 rounded-3xl p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                  <Initials name={a.fullName} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-md-on-surface">{a.fullName}</span>
                      <span className={`inline-flex h-6 items-center rounded-lg px-2 text-xs font-medium ${PAYMENT_CHIP[a.paymentStatus]}`}>
                        {PAYMENT_LABEL[a.paymentStatus]}{a.paymentStatus === "paid" ? ` · ${formatFee(a.feePaise)}` : ""}
                      </span>
                      <span className="inline-flex h-6 items-center rounded-lg bg-md-secondary-container px-2 text-xs font-medium text-md-on-secondary-container">
                        {REVIEW_STATUSES[a.reviewStatus]}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-md-on-surface-variant">
                      {a.jobTitle} · <time dateTime={a.createdAt}>{fmtDateTime(a.createdAt)}</time>
                    </p>
                  </div>
                  <Symbol name="chevron_right" className="mt-2 text-md-on-surface-variant transition-transform group-open:rotate-90" />
                </summary>

                <div className="grid gap-6 border-t border-md-outline-variant p-4 sm:p-5 lg:grid-cols-[1.3fr_1fr]">
                  <div className="min-w-0 space-y-4">
                    <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[8rem_minmax(0,1fr)]">
                      <dt className="text-md-on-surface-variant">Email</dt>
                      <dd><a href={`mailto:${a.email}`} className="break-all text-md-primary underline underline-offset-4">{a.email}</a></dd>
                      <dt className="text-md-on-surface-variant">WhatsApp / phone</dt>
                      <dd><a href={waLink(a.phone)} target="_blank" rel="noopener noreferrer" className="text-md-primary underline underline-offset-4">{a.phone}</a></dd>
                      {a.location && <><dt className="text-md-on-surface-variant">Location</dt><dd className="text-md-on-surface">{a.location}</dd></>}
                      {a.experienceYears && <><dt className="text-md-on-surface-variant">Experience</dt><dd className="text-md-on-surface">{a.experienceYears}</dd></>}
                      {a.portfolioUrl && <><dt className="text-md-on-surface-variant">Portfolio</dt><dd><a href={a.portfolioUrl} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-md-primary underline underline-offset-4">{a.portfolioUrl}</a></dd></>}
                      {a.linkedinUrl && <><dt className="text-md-on-surface-variant">LinkedIn</dt><dd><a href={a.linkedinUrl} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-md-primary underline underline-offset-4">{a.linkedinUrl}</a></dd></>}
                      {a.paymentId && <><dt className="text-md-on-surface-variant">Payment ID</dt><dd className="font-mono text-xs text-md-on-surface">{a.paymentId} <span className="font-sans text-md-on-surface-variant">· {a.paymentProvider === "cashfree" ? "Cashfree" : "Razorpay"}</span></dd></>}
                      <dt className="text-md-on-surface-variant">Reference</dt><dd className="font-mono text-xs text-md-on-surface">{a.publicId.slice(0, 8).toUpperCase()}</dd>
                    </dl>
                    <a href={`/api/admin/applications/${a.id}/resume`}
                       className="state-layer inline-flex h-10 items-center gap-2 rounded-full border border-md-outline px-4 text-sm font-medium text-md-primary">
                      <Symbol name="download" size={18} /> Résumé · {a.resumeName}
                    </a>
                    <div>
                      <p className="text-sm font-medium text-md-on-surface">Proposal</p>
                      <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-md-surface-container p-4 text-sm leading-relaxed text-md-on-surface">{a.proposal}</p>
                    </div>
                  </div>
                  <ApplicationActions id={a.id} name={a.fullName} review={a.reviewStatus} notes={a.adminNotes} payment={a.paymentStatus} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-end gap-1 text-sm text-md-on-surface-variant">
          <span className="mr-2">Page {page} of {pages}</span>
          {page > 1
            ? <Link href={href(sp, { page: String(page - 1) })} aria-label="Previous page" className="state-layer grid h-10 w-10 place-items-center rounded-full"><Symbol name="chevron_left" /></Link>
            : <span aria-hidden="true" className="grid h-10 w-10 place-items-center opacity-40"><Symbol name="chevron_left" /></span>}
          {page < pages
            ? <Link href={href(sp, { page: String(page + 1) })} aria-label="Next page" className="state-layer grid h-10 w-10 place-items-center rounded-full"><Symbol name="chevron_right" /></Link>
            : <span aria-hidden="true" className="grid h-10 w-10 place-items-center opacity-40"><Symbol name="chevron_right" /></span>}
        </nav>
      )}
    </Motion>
  );
}
