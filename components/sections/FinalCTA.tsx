import Reveal from "@/components/RevealOnScroll";
import WhatsAppButton from "@/components/WhatsAppButton";
import { PROMISE } from "@/lib/site";

export default function FinalCTA() {
  return (
    <section id="join" className="section bg-bg">
      <Reveal className="container-x max-w-prose text-center">
        <h2 className="h2 text-ink">Start building your freelancing career.</h2>
        <p className="lead mx-auto mt-5 max-w-xl text-muted">
          Join the free community and learn from the journey as it happens.
        </p>
        <div className="mt-8 flex justify-center">
          <WhatsAppButton primary />
        </div>
        <p className="mt-5 text-[0.95rem] text-muted">{PROMISE}</p>
      </Reveal>
    </section>
  );
}
