import Reveal from "@/components/RevealOnScroll";
import { storyTimeline } from "@/lib/site";

/** The founder journey timeline, for light (paper) backgrounds. */
export default function Timeline() {
  return (
    <Reveal>
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
                            ${last ? "bg-accent-dark" : "bg-[#C4C9C2]"}`}
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
                className="tl-dot absolute -left-[calc(2rem+5px)] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-paper" />
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-dark">Today</p>
          <p className="mt-1 text-lg font-medium">Documenting the journey and teaching practical lessons</p>
        </li>
      </ol>
    </Reveal>
  );
}
