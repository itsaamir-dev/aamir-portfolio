import Reveal from "@/components/RevealOnScroll";
import Icon from "@/components/Icon";
import { audienceFor, audienceNotFor } from "@/lib/site";

export default function WhoShouldJoin() {
  return (
    <section id="who" className="section">
      <div className="container-x">
        <Reveal className="mx-auto max-w-prose text-center">
          <p className="eyebrow">Who It&apos;s For</p>
          <h2 className="h2 mt-4">Is Build With Aamir for You?</h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="tray mt-10 grid gap-2 lg:mt-14 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-card bg-accent p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-accent">
                  <Icon name="check" size={18} />
                </span>
                <h3 className="text-[1.375rem] font-medium tracking-[-0.04em] text-ink">It&apos;s for you if you&apos;re…</h3>
              </div>
              <ul className="stagger mt-6 space-y-3">
                {audienceFor.map(t => (
                  <li key={t} className="flex gap-3 text-base leading-relaxed text-ink">
                    <Icon name="check" size={20} className="mt-0.5 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="tray-card sm:!p-8">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink">
                  <Icon name="x" size={18} />
                </span>
                <h3 className="text-[1.375rem] font-medium tracking-[-0.04em] text-ink">It&apos;s not for…</h3>
              </div>
              <ul className="stagger mt-6 space-y-3">
                {audienceNotFor.map(t => (
                  <li key={t} className="flex gap-3 text-base leading-relaxed text-muted">
                    <Icon name="x" size={20} className="mt-0.5 shrink-0 text-[#9A9A9A]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
