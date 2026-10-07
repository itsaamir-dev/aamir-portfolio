import Reveal from "@/components/RevealOnScroll";
import { storyTimeline } from "@/lib/site";

export default function Story() {
  return (
    <section id="story" className="section bg-paper text-ink-dark">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">

        <Reveal>
          <p className="eyebrow-light">My Story</p>
          <h2 className="h2 mt-4">From developer to freelancer: the real timeline.</h2>
          <div className="lead mt-6 space-y-5 text-muted-dark">
            <p>
              I&apos;ve been a software engineer for 8+ years, building Android, React and Node.js apps.
              Freelancing was something on the side until <strong className="font-semibold text-ink-dark">September 2024</strong>,
              when I started taking Upwork seriously.
            </p>
            <p>
              The first client was the hardest part. After that, it was learning how clients actually choose
              who to hire, and getting better at it one proposal at a time.
            </p>
            <p>
              The numbers here are approximate, and they&apos;re mine. They&apos;re not a promise of what
              you&apos;ll earn. I&apos;m now documenting the journey and teaching what I learned in a free community.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ol className="relative pl-8">
            <span aria-hidden="true" className="tl-line absolute bottom-0 left-0 top-0 w-0.5 bg-line-light" />
            {storyTimeline.map(({ when, what }, i) => {
              const last = i === storyTimeline.length - 1;
              return (
                <li key={when} className="relative pb-8">
                  <span
                    aria-hidden="true"
                    style={{ animationDelay: `${150 + i * 70}ms` }}
                    className={`tl-dot absolute -left-[calc(2rem+5px)] top-1.5 h-3 w-3 rounded-full ring-4 ring-paper
                                ${last ? "bg-accent" : "bg-[#C4C9D1]"}`}
                  />
                  <p className={`text-sm font-semibold uppercase tracking-[0.1em] ${last ? "text-accent-dark" : "text-muted-dark"}`}>
                    {when}
                  </p>
                  <p className={`mt-1 ${last ? "text-2xl font-bold" : "text-lg font-medium"}`}>{what}</p>
                </li>
              );
            })}
            <li className="relative">
              <span aria-hidden="true"
                    style={{ animationDelay: `${150 + storyTimeline.length * 70}ms` }}
                    className="tl-dot absolute -left-[calc(2rem+5px)] top-1.5 h-3 w-3 rounded-full bg-wa ring-4 ring-paper" />
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-dark">Now</p>
              <p className="mt-1 text-lg font-medium">
                Documenting the journey and teaching others in a{" "}
                <a href="#community" className="font-semibold text-accent-dark underline underline-offset-4">free community</a>
              </p>
            </li>
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
