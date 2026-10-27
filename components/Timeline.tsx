import Reveal from "@/components/RevealOnScroll";
import { storyTimeline } from "@/lib/site";

/** The founder journey timeline, set in a tray card. */
export default function Timeline() {
  return (
    <Reveal className="tray">
      <ol className="tray-card relative !pl-12">
        <span aria-hidden="true" className="tl-line absolute bottom-10 left-[1.875rem] top-10 w-px bg-line" />
        {storyTimeline.map(({ when, what }, i) => {
          const last = i === storyTimeline.length - 1;
          return (
            <li key={when} className={`relative pb-7 ${last ? "-mx-3 rounded-2xl bg-accent px-3 pt-3 pb-4 mb-6" : ""}`}>
              <span
                aria-hidden="true"
                style={{ animationDelay: `${150 + i * 70}ms` }}
                className={`tl-dot absolute top-1.5 h-2.5 w-2.5 rounded-full ring-4
                            ${last ? "-left-[0.6875rem] top-[1.1rem] bg-ink ring-white" : "-left-[1.4375rem] bg-[#BDBDBD] ring-white"}`}
              />
              <p className={`font-mono text-xs uppercase tracking-[0.1em] ${last ? "text-ink" : "text-muted"}`}>
                {when}
              </p>
              <p className={`mt-1.5 tracking-[-0.03em] ${last ? "text-2xl font-medium" : "text-lg font-medium"}`}>{what}</p>
            </li>
          );
        })}
        <li className="relative">
          <span aria-hidden="true"
                style={{ animationDelay: `${150 + storyTimeline.length * 70}ms` }}
                className="tl-dot absolute -left-[1.4375rem] top-1.5 h-2.5 w-2.5 rounded-full bg-ink ring-4 ring-white" />
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Today</p>
          <p className="mt-1.5 text-lg font-medium tracking-[-0.03em]">Documenting the journey and teaching practical lessons</p>
        </li>
      </ol>
    </Reveal>
  );
}
