import Reveal from "@/components/RevealOnScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import { challengeDays } from "@/lib/site";

const TOTAL_DAYS = 30;

export default function Challenge() {
  const published = challengeDays.length;

  return (
    <section id="challenge" className="section bg-paper text-ink-dark">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">

        <Reveal>
          <p className="eyebrow-light">30-Day Challenge</p>
          <h2 className="h2 mt-4">Follow the journey, one day at a time.</h2>
          <p className="lead mt-5 text-muted-dark">
            I&apos;m documenting 30 days of building my freelancing brand in public. New days show up here as
            they&apos;re published.
          </p>

          <div className="mt-8">
            <div className="flex items-baseline justify-between text-sm font-medium text-muted-dark">
              <span>Progress</span>
              <span><strong className="text-ink-dark">{published}</strong> of {TOTAL_DAYS} days</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-line-light"
                 role="progressbar" aria-valuemin={0} aria-valuemax={TOTAL_DAYS} aria-valuenow={published}
                 aria-label="Challenge days published">
              <div className="progress-fill h-full rounded-full bg-accent" style={{ width: `${(published / TOTAL_DAYS) * 100}%` }} />
            </div>
          </div>

          <WhatsAppButton label="Follow the journey" className="mt-8" />
        </Reveal>

        <Reveal delay={100}>
          <ol className="divide-y divide-line-light rounded-2xl border border-line-light bg-white">
            {challengeDays.map(({ day, title, href }) => {
              const body = (
                <>
                  <span className="w-20 shrink-0 text-sm font-bold uppercase tracking-[0.1em] text-accent-dark">
                    Day {String(day).padStart(2, "0")}
                  </span>
                  <span className="text-lg font-semibold">{title}</span>
                </>
              );
              return (
                <li key={day}>
                  {href ? (
                    <a href={href} className="flex min-h-[64px] items-center gap-4 px-6 py-5 transition-colors duration-200 hover:bg-paper">{body}</a>
                  ) : (
                    <div className="flex min-h-[64px] items-center gap-4 px-6 py-5">{body}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
