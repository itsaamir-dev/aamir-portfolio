import Reveal from "@/components/RevealOnScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import { PROMISE } from "@/lib/site";

export default function Community() {
  return (
    <section id="community" className="section bg-bg pt-0 sm:pt-0 lg:pt-0">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-12 text-center sm:px-12 sm:py-16 lg:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(124,92,255,0.18), transparent 70%)" }}
            />
            <div className="relative mx-auto max-w-prose">
              <p className="eyebrow">Free Community</p>
              <h2 className="h2 mt-4 text-ink">Build With Aamir Community</h2>
              <p className="mt-4 text-xl font-semibold text-ink sm:text-2xl">{PROMISE}</p>
              <p className="lead mx-auto mt-5 max-w-xl text-muted">
                A free WhatsApp community where I share lessons from real client work, updates from the
                30-day challenge and new articles as they&apos;re published.
              </p>
              <div className="mt-8 flex justify-center">
                <WhatsAppButton />
              </div>
              <p className="mt-4 text-sm text-muted">Free to join. Leave any time.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
