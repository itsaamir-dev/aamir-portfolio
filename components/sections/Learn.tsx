import Reveal from "@/components/RevealOnScroll";
import LearnTopicCards from "@/components/LearnTopicCards";
import TrackedLink from "@/components/TrackedLink";
import BtnArrow from "@/components/BtnArrow";

export default function Learn() {
  return (
    <section id="learn" className="section">
      <div className="container-x">
        <Reveal className="mx-auto max-w-prose text-center">
          <p className="eyebrow">What You&apos;ll Learn</p>
          <h2 className="h2 mt-4">Learn the Practical Side of Freelancing</h2>
          <p className="lead mx-auto mt-5 max-w-xl text-muted">
            The commercial skills that sit next to your technical ones — taken from my own work on Upwork,
            not theory.
          </p>
          <TrackedLink href="/learn" event="learn_resource_click" params={{ topic: "all", location: "home" }}
                       className="btn-dark mt-8">
            Explore the learning resources
            <BtnArrow tone="lime" />
          </TrackedLink>
        </Reveal>

        <Reveal delay={100} className="mt-12 lg:mt-16">
          <LearnTopicCards location="home" />
        </Reveal>
      </div>
    </section>
  );
}
