import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { challengeDays, latestChallengeDay, CHALLENGE_TOTAL, type ChallengeDay } from "@/lib/site";

const pad = (n: number) => String(n).padStart(2, "0");

export function ChallengeProgress() {
  const current = latestChallengeDay.day;
  return (
    <div className="rounded-card bg-surface p-5">
      <div className="flex items-baseline justify-between text-sm font-medium text-muted">
        <span>Journey progress</span>
        <span>Day <strong className="text-2xl font-medium tracking-[-0.04em] text-ink">{current}</strong> of {CHALLENGE_TOTAL}</span>
      </div>
      {/* One segment per day */}
      <div className="mt-3 flex gap-[3px]"
           role="progressbar" aria-valuemin={0} aria-valuemax={CHALLENGE_TOTAL} aria-valuenow={current}
           aria-label="30-day journey progress">
        {Array.from({ length: CHALLENGE_TOTAL }, (_, i) => (
          <span key={i} aria-hidden="true"
                className={`h-3 flex-1 rounded-full ${i < current ? (i === current - 1 ? "bg-ink" : "bg-accent") : "bg-card"}`} />
        ))}
      </div>
    </div>
  );
}

/** Featured card for the latest day. */
export function LatestDay({ day = latestChallengeDay }: { day?: ChallengeDay }) {
  return (
    <div className="tray">
      <article className="tray-card sm:!p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-ink">
          Latest · Day {pad(day.day)}
        </p>
        <h3 className="mt-4 text-[1.75rem] font-medium leading-tight tracking-[-0.045em]">{day.title}</h3>
        {day.summary && <p className="mt-3 text-base leading-relaxed text-muted">{day.summary}</p>}
        {day.points && (
          <ol className="mt-6 space-y-2">
            {day.points.map((p, i) => (
              <li key={p} className="flex gap-3 rounded-2xl bg-surface p-3.5 text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs text-on-ink">{i + 1}</span>
                <span className="pt-0.5">{p}</span>
              </li>
            ))}
          </ol>
        )}
        {day.href && (
          <TrackedLink href={day.href} event="challenge_click" params={{ day: day.day, target: "post" }}
                       className="link mt-6 inline-flex min-h-[44px] items-center gap-2">
            Read Day {day.day}
          </TrackedLink>
        )}
        {day.related && (
          <TrackedLink href={day.related.href} event="challenge_click" params={{ day: day.day, target: "related_article" }}
                       className="group mt-5 inline-flex min-h-[44px] items-center gap-2 font-semibold text-ink">
            {day.related.label}
            <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-accent transition-transform duration-200 group-hover:translate-x-1">
              <Icon name="arrow" size={14} />
            </span>
          </TrackedLink>
        )}
        <p className="mt-5 text-sm text-muted">Practical recommendations — not a guaranteed way to win projects.</p>
      </article>
    </div>
  );
}

/** Every day so far, newest first, plus a note for what's still to come. */
export function ChallengeDayList({ limit }: { limit?: number }) {
  const days  = [...challengeDays].reverse();
  const shown = limit ? days.slice(0, limit) : days;
  const remaining = CHALLENGE_TOTAL - latestChallengeDay.day;

  return (
    <ol className="tray space-y-1">
      {shown.map(({ day, title, href }) => {
        const body = (
          <>
            <span className="w-16 shrink-0 font-mono text-xs uppercase tracking-[0.1em] text-muted">Day {pad(day)}</span>
            <span className="text-base font-medium tracking-[-0.02em] sm:text-lg">{title}</span>
          </>
        );
        return (
          <li key={day}>
            {href ? (
              <TrackedLink href={href} event="challenge_click" params={{ day, target: "post" }}
                           className="flex min-h-[60px] items-center gap-4 rounded-2xl bg-card px-5 py-4 transition-colors duration-200 hover:bg-accent sm:px-6">
                {body}
              </TrackedLink>
            ) : (
              <div className="flex min-h-[60px] items-center gap-4 rounded-2xl bg-card px-5 py-4 sm:px-6">{body}</div>
            )}
          </li>
        );
      })}
      {remaining > 0 && (
        <li className="flex min-h-[60px] items-center gap-4 rounded-2xl border border-dashed border-line-strong px-5 py-4 text-muted sm:px-6">
          <span className="w-16 shrink-0 font-mono text-xs uppercase tracking-[0.1em]">Next</span>
          <span className="text-base">Days {latestChallengeDay.day + 1}–{CHALLENGE_TOTAL} are still to come.</span>
        </li>
      )}
    </ol>
  );
}
