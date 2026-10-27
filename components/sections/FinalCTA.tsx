import Reveal from "@/components/RevealOnScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import { PROMISE } from "@/lib/site";

export default function FinalCTA({ location = "final_cta" }: { location?: string }) {
  return (
    <section id="join" className="py-2">
      <div className="panel sky on-dark overflow-hidden text-white">
        <Reveal className="container-x max-w-prose py-20 text-center sm:py-28 lg:py-32">
          <h2 className="h2">Start Building Your Freelancing Career</h2>
          <p className="lead mx-auto mt-5 max-w-xl text-white/90">
            Learn from the journey, apply the lessons, and keep improving your approach to finding international clients.
          </p>
          <div className="mt-8 flex justify-center">
            <WhatsAppButton primary location={location} />
          </div>
          <p className="mt-5 text-[0.95rem] text-white/85">{PROMISE}</p>
        </Reveal>
      </div>
    </section>
  );
}
