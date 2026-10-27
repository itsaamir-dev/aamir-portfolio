import Reveal from "@/components/RevealOnScroll";
import Timeline from "@/components/Timeline";
import TrackedLink from "@/components/TrackedLink";

export default function Story() {
  return (
    <section id="story" className="section bg-paper text-ink-dark">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">

        <Reveal>
          <p className="eyebrow-light">My Story</p>
          <h2 className="h2 mt-4">From Developer to Freelancer: The Real Journey</h2>
          <div className="lead mt-6 space-y-5 text-muted-dark">
            <p>
              I already had 8+ years of software engineering experience. What I didn&apos;t have was a
              freelancing career — until <strong className="font-semibold text-ink-dark">September 2024</strong>,
              when I started taking Upwork seriously.
            </p>
            <p>
              Technical skills got me through the door. Learning how clients choose who to hire, and how to
              communicate my value, took longer. It wasn&apos;t effortless, and these results aren&apos;t typical
              or guaranteed.
            </p>
          </div>
          <TrackedLink href="/story" event="story_click" params={{ location: "home_story" }}
                       className="btn mt-8 border border-ink-dark text-ink-dark hover:bg-ink-dark hover:text-white">
            Read my story
          </TrackedLink>
        </Reveal>

        <Timeline />
      </div>
    </section>
  );
}
