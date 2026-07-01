import Reveal from "@/components/RevealOnScroll";
import Link from "next/link";

const stats = [
  { num: "$70K+", label: "Total Earned" },
  { num: "100%",  label: "Job Success" },
  { num: "50+",   label: "Projects" },
  { num: "⭐ Top", label: "Rated Plus" },
];

export default function Freelance() {
  return (
    <section id="freelance" className="relative z-10 overflow-hidden"
      style={{ background: "linear-gradient(135deg, rgba(13,27,42,0.98), rgba(8,15,24,0.98))" }}>
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.06), transparent)" }} />

      <div className="max-w-[1100px] mx-auto px-16 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <Reveal>
            <p className="font-mono text-[0.67rem] tracking-[0.2em] uppercase text-gold mb-4">Upwork</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-off-white leading-[1.1] mb-5">
              Top Rated <span className="text-gold">Plus</span><br/>Freelancer
            </h2>
            <p className="text-[0.95rem] text-mid-gray leading-[1.85] mb-8 font-light">
              Consistently delivering exceptional results to global clients. From MVP prototyping to enterprise-grade
              deployments — trusted by businesses across the US, UK, UAE, and Australia with a perfect track record.
            </p>
            <Link href="#contact"
              className="btn-clip inline-block px-9 py-[0.85rem] bg-gold text-navy font-mono text-[0.7rem]
                         tracking-[0.12em] uppercase font-semibold transition-all duration-200 hover:bg-gold2 hover:-translate-y-0.5">
              Hire Me
            </Link>
          </Reveal>

          {/* Stats grid */}
          <Reveal delay={200}>
            <div className="grid grid-cols-2 gap-5">
              {stats.map(({ num, label }) => (
                <div key={label}
                  className="group relative overflow-hidden border border-[rgba(201,168,76,0.15)] p-6 text-center
                             bg-[rgba(27,45,66,0.5)] transition-all duration-300 hover:border-[rgba(201,168,76,0.4)]">
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  <span className="block font-display text-[2.2rem] font-black text-gold leading-none mb-1">{num}</span>
                  <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-mid-gray">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
