import Reveal from "@/components/RevealOnScroll";
import Icon from "@/components/Icon";
import { audienceFor, audienceNotFor } from "@/lib/site";

export default function WhoShouldJoin() {
  return (
    <section id="who" className="section bg-bg">
      <div className="container-x">
        <Reveal className="max-w-prose">
          <p className="eyebrow">Who It&apos;s For</p>
          <h2 className="h2 mt-4 text-ink">Is Build With Aamir for You?</h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="card">
              <h3 className="text-xl font-semibold text-ink">It&apos;s for you if you&apos;re…</h3>
              <ul className="stagger mt-5 space-y-4">
                {audienceFor.map(t => (
                  <li key={t} className="flex gap-3 text-base leading-relaxed text-muted">
                    <Icon name="check" size={20} className="mt-0.5 shrink-0 text-accent-light" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card bg-transparent">
              <h3 className="text-xl font-semibold text-ink">It&apos;s not for…</h3>
              <ul className="stagger mt-5 space-y-4">
                {audienceNotFor.map(t => (
                  <li key={t} className="flex gap-3 text-base leading-relaxed text-muted">
                    <Icon name="x" size={20} className="mt-0.5 shrink-0 text-muted" />
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
