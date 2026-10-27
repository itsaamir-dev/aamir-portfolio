import Reveal from "@/components/RevealOnScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import { PROMISE } from "@/lib/site";

export default function FinalCTA({ location = "final_cta" }: { location?: string }) {
  return (
    <section id="join" className="section bg-bg">
      <Reveal className="container-x max-w-prose text-center">
        <h2 className="h2 text-ink">Start Building Your Freelancing Career</h2>
        <p className="lead mx-auto mt-5 max-w-xl text-muted">
          Learn from the journey, apply the lessons, and keep improving your approach to finding international clients.
        </p>
        <div className="mt-8 flex justify-center">
          <WhatsAppButton primary location={location} />
        </div>
        <p className="mt-5 text-[0.95rem] text-muted">{PROMISE}</p>
      </Reveal>
    </section>
  );
}
