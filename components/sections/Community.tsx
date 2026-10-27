import Reveal from "@/components/RevealOnScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import Icon from "@/components/Icon";
import { communityBenefits, PROMISE } from "@/lib/site";

export default function Community() {
  return (
    <section id="community" className="py-8 sm:py-12">
      <Reveal>
        <div className="panel on-dark relative overflow-hidden bg-night px-5 py-16 text-white sm:px-12 sm:py-20 lg:py-24">
          {/* Concentric rings, echoing a group forming around one point */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            {[260, 460, 660, 860].map(d => (
              <span key={d} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]"
                    style={{ width: d, height: d }} />
            ))}
          </div>
          <div className="relative mx-auto max-w-prose text-center">
            <p className="eyebrow-light">Free Community</p>
            <h2 className="h2 mt-4">Build Your Freelancing Career With Us</h2>
            <p className="lead mx-auto mt-5 max-w-xl text-white/80">
              Join the free Build With Aamir WhatsApp Community to learn freelancing, discuss client acquisition
              challenges, and follow practical lessons from my journey.
            </p>
            <ul className="mx-auto mt-10 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
              {communityBenefits.map(b => (
                <li key={b} className="flex gap-3 rounded-2xl bg-night-2 p-4 text-base text-white">
                  <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
                    <Icon name="check" size={12} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex justify-center">
              <WhatsAppButton location="community" />
            </div>
            <p className="mt-4 text-sm text-night-muted">Free to join. Leave any time. No guarantees of clients or income.</p>
            <p className="sr-only">{PROMISE}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
