import type { Metadata } from "next";
import Link from "next/link";
import Motion from "@/components/admin/Motion";
import EmptyState from "@/components/admin/EmptyState";
import JobActions from "@/components/admin/JobActions";
import Symbol from "@/components/admin/Symbol";
import { Card, Kpi, DbNotConnected, fmtDate } from "@/components/admin/parts";
import { getJobStats, isDbConfigured, listJobsAdmin } from "@/lib/jobs-data";
import { activeProvider } from "@/lib/payments";
import { EMPLOYMENT_TYPES, formatDay, formatFee, type JobStatus } from "@/lib/jobs";

export const metadata: Metadata = { title: "Jobs" };
export const dynamic = "force-dynamic";

const STATUS: Record<JobStatus, { label: string; cls: string }> = {
  open:   { label: "Open",   cls: "bg-md-primary-container text-md-on-primary-container" },
  draft:  { label: "Draft",  cls: "border border-md-outline text-md-on-surface-variant" },
  closed: { label: "Closed", cls: "bg-md-surface-container-highest text-md-on-surface-variant" },
};

export default async function JobsAdminPage({ searchParams }: { searchParams: { saved?: string } }) {
  if (!isDbConfigured) return <DbNotConnected />;
  const [jobs, stats] = await Promise.all([listJobsAdmin(), getJobStats()]);

  return (
    <Motion className="mx-auto max-w-6xl space-y-4">
      {searchParams.saved && (
        <p data-anim role="status" className="flex items-center gap-2 rounded-2xl bg-md-primary-container px-4 py-3 text-sm text-md-on-primary-container">
          <Symbol name="check_circle" size={20} /> Saved “{searchParams.saved}”.
        </p>
      )}
      {!activeProvider() && (
        <p data-anim role="alert" className="flex items-start gap-2 rounded-2xl bg-md-error-container px-4 py-3 text-sm text-md-on-error-container">
          <Symbol name="error" size={20} />
          <span>No payment gateway is connected, so applicants can’t pay or submit yet. Add your Cashfree or Razorpay keys in Vercel — see <Link href="/admin/settings" className="font-medium underline underline-offset-4">Setup</Link>.</span>
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Open jobs" value={stats.openJobs} icon="work" />
        <Kpi label="Paid applications" value={stats.paidApplications} icon="description" />
        <Kpi label="New to review" value={stats.newApplications} icon="visibility" />
        <Kpi label="Fees collected (₹)" value={Math.round(stats.revenuePaise / 100)} icon="payments" />
      </div>

      <div data-anim className="flex items-center justify-between gap-3 pt-2">
        <h2 className="text-base font-medium text-md-on-surface">All jobs</h2>
        <Link href="/admin/jobs/new" className="state-layer inline-flex h-14 items-center gap-2 rounded-2xl bg-md-primary-container px-5 text-sm font-medium text-md-on-primary-container">
          <Symbol name="add" /> New job
        </Link>
      </div>

      <Card data-anim className="p-0 sm:p-0">
        {jobs.length === 0 ? (
          <EmptyState title="No jobs yet">
            <p>Create your first job. Save it as a draft to preview, then publish it to show it on <a href="/jobs" target="_blank" className="font-medium text-md-primary underline underline-offset-4">/jobs</a>.</p>
          </EmptyState>
        ) : (
          <ul className="divide-y divide-md-outline-variant">
            {jobs.map(j => (
              <li key={j.id} className="flex items-start gap-4 px-4 py-4 sm:px-5">
                <span className="mt-1 hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-md-tertiary-container text-md-on-tertiary-container sm:grid">
                  <Symbol name="work" size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/jobs/${j.id}`} className="truncate font-medium text-md-on-surface hover:underline">{j.title}</Link>
                    <span className={`inline-flex h-6 items-center rounded-lg px-2 text-xs font-medium ${STATUS[j.status].cls}`}>{STATUS[j.status].label}</span>
                  </div>
                  <p className="mt-1 text-sm text-md-on-surface-variant">
                    {[j.company || "Confidential client", j.location, EMPLOYMENT_TYPES[j.employmentType], `Fee ${formatFee(j.feePaise)}`,
                      j.applyBy ? `Apply by ${formatDay(j.applyBy)}` : null, `Created ${fmtDate(j.createdAt)}`].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <Link href={`/admin/applications?job=${j.id}`}
                          className="state-layer inline-flex h-8 items-center gap-1.5 rounded-lg border border-md-outline px-3 font-medium text-md-on-surface-variant">
                      <Symbol name="description" size={18} />{j.paidCount} paid application{j.paidCount === 1 ? "" : "s"}
                    </Link>
                    {j.pendingCount > 0 && (
                      <span className="inline-flex h-8 items-center rounded-lg px-1 text-md-on-surface-variant">{j.pendingCount} unpaid</span>
                    )}
                    {j.revenuePaise > 0 && (
                      <span className="inline-flex h-8 items-center gap-1.5 rounded-lg px-1 text-md-on-surface-variant"><Symbol name="payments" size={18} />{formatFee(j.revenuePaise)} collected</span>
                    )}
                  </div>
                </div>
                <JobActions id={j.id} slug={j.slug} title={j.title} status={j.status} applications={j.paidCount + j.pendingCount} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Motion>
  );
}
