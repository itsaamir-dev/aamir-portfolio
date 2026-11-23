import Link from "next/link";
import Icon from "@/components/Icon";
import { EMPLOYMENT_TYPES, companyLabel, formatDay, formatFee, type Job } from "@/lib/jobs";

/** Job summary card for the /jobs list. */
export default function JobCard({ job }: { job: Job }) {
  const meta = [companyLabel(job), job.location, EMPLOYMENT_TYPES[job.employmentType]];
  return (
    <Link href={`/jobs/${job.slug}`}
          className="tray-card group flex h-full flex-col transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(19,19,19,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted">{meta.join(" · ")}</p>
          <h2 className="mt-2 text-[1.375rem] font-medium leading-snug tracking-[-0.03em] text-ink group-hover:underline group-hover:underline-offset-4">
            {job.title}
          </h2>
        </div>
        <span aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink transition-[transform,background-color] duration-300 group-hover:rotate-45 group-hover:bg-accent">
          <Icon name="external" size={16} />
        </span>
      </div>

      <p className="mt-3 text-base leading-relaxed text-muted">{job.summary}</p>

      {job.skills.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">
          {job.skills.slice(0, 6).map(s => (
            <li key={s} className="rounded-full bg-surface px-2.5 py-1 text-sm text-ink">{s}</li>
          ))}
          {job.skills.length > 6 && <li className="px-1 py-1 text-sm text-muted">+{job.skills.length - 6} more</li>}
        </ul>
      )}

      {/* Pinned to the bottom so cards in a row line up */}
      <div className="mt-auto pt-6">
        <dl className="grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm sm:grid-cols-3">
          {job.compensation && (
            <div className="min-w-0">
              <dt className="text-muted">Pay</dt>
              <dd className="truncate font-medium text-ink" title={job.compensation}>{job.compensation}</dd>
            </div>
          )}
          <div>
            <dt className="text-muted">Apply by</dt>
            <dd className="font-medium text-ink">{job.applyBy ? formatDay(job.applyBy) : "Open until filled"}</dd>
          </div>
          <div>
            <dt className="text-muted">Referral fee</dt>
            <dd className="font-medium text-ink">{formatFee(job.feePaise)}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
