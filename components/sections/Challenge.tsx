import Reveal from "@/components/RevealOnScroll";
import TrackedLink from "@/components/TrackedLink";
import BtnArrow from "@/components/BtnArrow";
import { ChallengeProgress, LatestDay } from "@/components/ChallengeList";

export default function Challenge() {
  return (
    <section id="challenge" className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">

        <Reveal>
          <p className="eyebrow">30-Day Challenge</p>
          <h2 className="h2 mt-4">30 Days of Building in Public</h2>
          <p className="lead mt-5 text-muted">
            I&apos;m documenting the lessons, experiments and practical insights behind building my freelancing
            education brand.
          </p>
          <div className="mt-8"><ChallengeProgress /></div>
          <TrackedLink href="/challenge" event="challenge_click" params={{ target: "journey", location: "home" }}
                       className="btn-dark mt-8">
            Follow the 30-day journey
            <BtnArrow tone="lime" />
          </TrackedLink>
        </Reveal>

        <Reveal delay={100}>
          <LatestDay />
        </Reveal>
      </div>
    </section>
  );
}
