import Reveal from "@/components/RevealOnScroll";
import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 bg-[#080f18]">
      <div className="max-w-[1100px] mx-auto px-16 py-24">
        <Reveal><p className="font-mono text-[0.67rem] tracking-[0.2em] uppercase text-gold mb-3">Technical Toolkit</p></Reveal>
        <Reveal delay={80}><h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-off-white leading-[1.1] mb-12">Core <span className="text-gold">Competencies</span></h2></Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((s, i) => (
            <Reveal key={s.category} delay={(i % 3) * 100}>
              <div className="group relative overflow-hidden border border-[rgba(201,168,76,0.1)] p-7
                              transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.35)]"
                   style={{ background: "linear-gradient(135deg, rgba(27,45,66,0.6), rgba(13,27,42,0.8))" }}>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-gold2
                                scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="text-2xl mb-3">{s.icon}</div>
                <p className="font-mono text-[0.63rem] tracking-[0.15em] uppercase text-gold mb-3">{s.category}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {s.tags.map(t => (
                    <span key={t}
                      className="px-3 py-1 border border-[rgba(201,168,76,0.12)] bg-[rgba(201,168,76,0.08)]
                                 font-mono text-[0.6rem] tracking-[0.06em] text-light-blue
                                 group-hover:bg-[rgba(201,168,76,0.14)] transition-colors duration-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
