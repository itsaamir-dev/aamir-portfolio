import Reveal from "@/components/RevealOnScroll";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="relative z-10"
      style={{ background: "linear-gradient(180deg, #080f18 0%, #0D1B2A 100%)" }}>
      <div className="max-w-[1100px] mx-auto px-16 py-24">
        <Reveal><p className="font-mono text-[0.67rem] tracking-[0.2em] uppercase text-gold mb-3">Career Path</p></Reveal>
        <Reveal delay={80}><h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-off-white leading-[1.1] mb-12">Professional <span className="text-gold">Experience</span></h2></Reveal>

        {/* Timeline */}
        <div className="relative border-l border-l-gold/40 pl-0">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 150}>
              <div className="relative pl-12 mb-14 last:mb-0">
                {/* Dot */}
                <span className="absolute -left-[5px] top-1.5 w-[11px] h-[11px] rounded-full bg-gold border-2 border-navy
                                 shadow-[0_0_0_3px_rgba(201,168,76,0.2)]" />

                <p className="font-mono text-[0.63rem] tracking-[0.1em] uppercase text-gold mb-1">{job.period} · {job.location}</p>
                <h3 className="font-display text-[1.35rem] font-bold text-off-white mb-0.5">{job.role}</h3>
                <p className="text-[0.9rem] text-gold2 font-medium mb-4">{job.company}</p>
                <ul className="space-y-2">
                  {job.bullets.map((b, bi) => (
                    <li key={bi} className="relative pl-5 text-[0.9rem] text-[#a8bdd0] leading-[1.75]
                                            before:content-['▸'] before:absolute before:left-0 before:top-[2px] before:text-gold before:text-[0.68rem]">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
