"use client";
import { useState } from "react";
import Reveal from "@/components/RevealOnScroll";
import { projects, ProjectCat } from "@/lib/data";

const filters: { label: string; value: ProjectCat }[] = [
  { label: "All Projects", value: "all" },
  { label: "Mobile",       value: "mobile" },
  { label: "Web / Full-Stack", value: "web" },
  { label: "AI / Smart",  value: "ai" },
  { label: "Enterprise",  value: "enterprise" },
];

const badgeStyles: Record<string, string> = {
  gold:  "bg-[rgba(201,168,76,0.1)]  text-gold2  border-[rgba(201,168,76,0.25)]",
  blue:  "bg-[rgba(100,160,220,0.15)] text-[#7ab3d0] border-[rgba(100,160,220,0.3)]",
  green: "bg-[rgba(80,180,120,0.12)]  text-[#72c497] border-[rgba(80,180,120,0.25)]",
};

const stackStyle = "px-2.5 py-0.5 bg-[rgba(42,100,150,0.2)] border border-[rgba(42,100,150,0.35)] font-mono text-[0.58rem] tracking-[0.06em] text-[#7ab3d0]";

export default function Projects() {
  const [active, setActive] = useState<ProjectCat>("all");

  const visible = projects.filter(p =>
    active === "all" || p.cats.includes(active)
  );

  return (
    <section id="projects" className="relative z-10 bg-[#080f18]">
      <div className="max-w-[1100px] mx-auto px-16 py-24">
        <Reveal><p className="font-mono text-[0.67rem] tracking-[0.2em] uppercase text-gold mb-3">What I&apos;ve Built</p></Reveal>
        <Reveal delay={80}><h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-off-white leading-[1.1] mb-8">Selected <span className="text-gold">Projects</span></h2></Reveal>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`px-5 py-2 font-mono text-[0.63rem] tracking-[0.1em] uppercase border transition-all duration-200
                ${active === f.value
                  ? "bg-[rgba(201,168,76,0.12)] text-gold border-gold"
                  : "bg-transparent text-mid-gray border-[rgba(201,168,76,0.18)] hover:text-gold2 hover:border-[rgba(201,168,76,0.4)]"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {visible.map((p, i) => (
            <Reveal key={p.num} delay={(i % 3) * 100}>
              <div className="group relative overflow-hidden border border-[rgba(201,168,76,0.1)] p-8 flex flex-col
                              transition-all duration-350 hover:-translate-y-1.5
                              hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(201,168,76,0.25)]"
                   style={{ background: "linear-gradient(145deg, rgba(27,45,66,0.7), rgba(8,15,24,0.9))" }}>
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold to-gold2
                                scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

                {/* Big ghost number */}
                <span className="absolute top-3 right-5 font-display font-black text-[3.5rem] leading-none
                                 text-[rgba(201,168,76,0.06)] pointer-events-none select-none">
                  {p.num}
                </span>

                {/* Badge */}
                <span className={`self-start px-3 py-1 font-mono text-[0.57rem] tracking-[0.1em] uppercase border mb-4 ${badgeStyles[p.badgeColor]}`}>
                  {p.badge}
                </span>

                <h3 className="font-display text-[1.22rem] font-bold text-off-white leading-snug mb-3">{p.title}</h3>
                <p className="text-[0.87rem] text-[#8a9bb0] leading-[1.8] flex-1 mb-5 font-light">{p.desc}</p>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {p.stack.map(t => <span key={t} className={stackStyle}>{t}</span>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
