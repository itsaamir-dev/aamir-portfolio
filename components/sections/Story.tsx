import Reveal from "@/components/RevealOnScroll";
import Timeline from "@/components/Timeline";
import TrackedLink from "@/components/TrackedLink";
import BtnArrow from "@/components/BtnArrow";

export default function Story() {
  return (
    <section id="story" className="section">
      <div className="container-x grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">

        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">My Story</p>
          <h2 className="h2 mt-4">From Developer to Freelancer: The Real Journey</h2>
          <div className="lead mt-6 space-y-5 text-muted">
            <p>
              I already had 8+ years of software engineering experience. What I didn&apos;t have was a
              freelancing career — until <strong className="font-semibold text-ink">September 2024</strong>,
              when I started taking Upwork seriously.
            </p>
            <p>
              Technical skills got me through the door. Learning how clients choose who to hire, and how to
              communicate my value, took longer. It wasn&apos;t effortless, and these results aren&apos;t typical
              or guaranteed.
            </p>
          </div>
          <TrackedLink href="/story" event="story_click" params={{ location: "home_story" }} className="btn-dark mt-8">
            Read my story
            <BtnArrow tone="lime" />
          </TrackedLink>
        </Reveal>

        <Timeline />
      </div>
    </section>
  );
}
