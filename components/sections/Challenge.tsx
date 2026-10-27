import Reveal from "@/components/RevealOnScroll";
import TrackedLink from "@/components/TrackedLink";
import { ChallengeProgress, LatestDay } from "@/components/ChallengeList";

export default function Challenge() {
  return (
    <section id="challenge" className="section bg-paper text-ink-dark">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">

        <Reveal>
          <p className="eyebrow-light">30-Day Challenge</p>
          <h2 className="h2 mt-4">30 Days of Building in Public</h2>
          <p className="lead mt-5 text-muted-dark">
            I&apos;m documenting the lessons, experiments and practical insights behind building my freelancing
            education brand.
          </p>
          <div className="mt-8"><ChallengeProgress /></div>
          <TrackedLink href="/challenge" event="challenge_click" params={{ target: "journey", location: "home" }}
                       className="btn mt-8 border border-ink-dark text-ink-dark hover:bg-ink-dark hover:text-white">
            Follow the 30-day journey
          </TrackedLink>
        </Reveal>

        <Reveal delay={100}>
          <LatestDay />
        </Reveal>
      </div>
    </section>
  );
}
