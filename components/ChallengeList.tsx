import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { challengeDays, latestChallengeDay, CHALLENGE_TOTAL, type ChallengeDay } from "@/lib/site";

const pad = (n: number) => String(n).padStart(2, "0");

export function ChallengeProgress() {
  const current = latestChallengeDay.day;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm font-medium text-muted-dark">
        <span>Journey progress</span>
        <span>Day <strong className="text-ink-dark">{current}</strong> of {CHALLENGE_TOTAL}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line-light"
           role="progressbar" aria-valuemin={0} aria-valuemax={CHALLENGE_TOTAL} aria-valuenow={current}
           aria-label="30-day journey progress">
        <div className="progress-fill h-full rounded-full bg-accent-dark" style={{ width: `${(current / CHALLENGE_TOTAL) * 100}%` }} />
      </div>
    </div>
  );
}

/** Featured card for the latest day (light background). */
export function LatestDay({ day = latestChallengeDay }: { day?: ChallengeDay }) {
  return (
    <article className="rounded-2xl border border-line-light bg-white p-6 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.1em] text-accent-dark">Latest · Day {pad(day.day)}</p>
      <h3 className="mt-2 text-2xl font-bold leading-snug">{day.title}</h3>
      {day.summary && <p className="mt-3 text-base leading-relaxed text-muted-dark">{day.summary}</p>}
      {day.points && (
        <ol className="mt-5 space-y-3">
          {day.points.map((p, i) => (
            <li key={p} className="flex gap-3 text-base">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(11,107,53,0.1)] text-sm font-bold text-accent-dark">{i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
      )}
      {day.href && (
        <TrackedLink href={day.href} event="challenge_click" params={{ day: day.day, target: "post" }}
                     className="mt-6 inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent-dark underline underline-offset-4">
          Read Day {day.day}
        </TrackedLink>
      )}
      {day.related && (
        <TrackedLink href={day.related.href} event="challenge_click" params={{ day: day.day, target: "related_article" }}
                     className="group mt-5 inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent-dark">
          {day.related.label}
          <Icon name="arrow" size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
        </TrackedLink>
      )}
      <p className="mt-5 text-sm text-muted-dark">Practical recommendations — not a guaranteed way to win projects.</p>
    </article>
  );
}

/** Every day so far, newest first, plus a note for what's still to come. */
export function ChallengeDayList({ limit }: { limit?: number }) {
  const days  = [...challengeDays].reverse();
  const shown = limit ? days.slice(0, limit) : days;
  const remaining = CHALLENGE_TOTAL - latestChallengeDay.day;

  return (
    <ol className="divide-y divide-line-light rounded-2xl border border-line-light bg-white">
      {shown.map(({ day, title, href }) => {
        const body = (
          <>
            <span className="w-16 shrink-0 text-sm font-bold uppercase tracking-[0.1em] text-accent-dark">Day {pad(day)}</span>
            <span className="text-base font-semibold sm:text-lg">{title}</span>
          </>
        );
        return (
          <li key={day}>
            {href ? (
              <TrackedLink href={href} event="challenge_click" params={{ day, target: "post" }}
                           className="flex min-h-[60px] items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-paper sm:px-6">
                {body}
              </TrackedLink>
            ) : (
              <div className="flex min-h-[60px] items-center gap-4 px-5 py-4 sm:px-6">{body}</div>
            )}
          </li>
        );
      })}
      {remaining > 0 && (
        <li className="flex min-h-[60px] items-center gap-4 px-5 py-4 text-muted-dark sm:px-6">
          <span className="w-16 shrink-0 text-sm font-bold uppercase tracking-[0.1em]">Next</span>
          <span className="text-base">Days {latestChallengeDay.day + 1}–{CHALLENGE_TOTAL} are still to come.</span>
        </li>
      )}
    </ol>
  );
}
