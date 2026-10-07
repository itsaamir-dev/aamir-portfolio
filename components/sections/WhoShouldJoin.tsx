import Reveal from "@/components/RevealOnScroll";
import Icon from "@/components/Icon";

const forYou = [
  "You’re a developer, designer or other skilled professional who wants international clients.",
  "You’re new to Upwork, or you’re on it but your proposals aren’t getting replies.",
  "You want honest, practical advice from someone doing the work right now.",
];

const notForYou = [
  "You’re looking for a get-rich-quick scheme.",
  "You want guaranteed income without putting in consistent work.",
];

export default function WhoShouldJoin() {
  return (
    <section id="who" className="section bg-bg">
      <div className="container-x">
        <Reveal className="max-w-prose">
          <p className="eyebrow">Who It&apos;s For</p>
          <h2 className="h2 mt-4 text-ink">Is this community for you?</h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="card">
              <h3 className="text-xl font-semibold text-ink">It&apos;s for you if…</h3>
              <ul className="stagger mt-5 space-y-4">
                {forYou.map(t => (
                  <li key={t} className="flex gap-3 text-base leading-relaxed text-muted">
                    <Icon name="check" size={20} className="mt-0.5 shrink-0 text-wa" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card bg-transparent">
              <h3 className="text-xl font-semibold text-ink">It&apos;s not for you if…</h3>
              <ul className="stagger mt-5 space-y-4">
                {notForYou.map(t => (
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
