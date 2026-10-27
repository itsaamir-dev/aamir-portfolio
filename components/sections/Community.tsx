import Reveal from "@/components/RevealOnScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import Icon from "@/components/Icon";
import { communityBenefits, PROMISE } from "@/lib/site";

export default function Community() {
  return (
    <section id="community" className="section bg-bg pt-0 sm:pt-0 lg:pt-0">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(57,245,106,0.10), transparent 70%)" }}
            />
            <div className="relative mx-auto max-w-prose text-center">
              <p className="eyebrow">Free Community</p>
              <h2 className="h2 mt-4 text-ink">Build Your Freelancing Career With Us</h2>
              <p className="lead mx-auto mt-5 max-w-xl text-muted">
                Join the free Build With Aamir WhatsApp Community to learn freelancing, discuss client acquisition
                challenges, and follow practical lessons from my journey.
              </p>
              <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2">
                {communityBenefits.map(b => (
                  <li key={b} className="flex gap-3 text-base text-ink">
                    <Icon name="check" size={20} className="mt-0.5 shrink-0 text-accent-light" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex justify-center">
                <WhatsAppButton location="community" />
              </div>
              <p className="mt-4 text-sm text-muted">Free to join. Leave any time. No guarantees of clients or income.</p>
              <p className="sr-only">{PROMISE}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
