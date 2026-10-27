import Reveal from "@/components/RevealOnScroll";
import LearnTopicCards from "@/components/LearnTopicCards";
import TrackedLink from "@/components/TrackedLink";

export default function Learn() {
  return (
    <section id="learn" className="section bg-bg">
      <div className="container-x">
        <Reveal className="max-w-prose">
          <p className="eyebrow">What You&apos;ll Learn</p>
          <h2 className="h2 mt-4 text-ink">Learn the Practical Side of Freelancing</h2>
          <p className="lead mt-5 text-muted">
            The commercial skills that sit next to your technical ones — taken from my own work on Upwork,
            not theory.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <LearnTopicCards location="home" />
        </Reveal>

        <TrackedLink href="/learn" event="learn_resource_click" params={{ topic: "all", location: "home" }}
                     className="btn-ghost mt-10">
          Explore the learning resources
        </TrackedLink>
      </div>
    </section>
  );
}
