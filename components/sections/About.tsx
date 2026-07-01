import Reveal from "@/components/RevealOnScroll";

const badges = ["Android Expert", "Full-Stack", "API Design", "Team Lead", "Top Rated Plus", "Remote-Ready"];

const metrics = [
  { label: "Total Earnings",    val: "$70K+" },
  { label: "Job Success Score", val: "100%" },
  { label: "Projects Delivered",val: "50+" },
  { label: "Years Experience",  val: "8+" },
];

export default function About() {
  return (
    <section id="about" className="relative z-10"
      style={{ background: "linear-gradient(180deg, #0D1B2A 0%, #0a1824 100%)" }}>
      <div className="max-w-[1100px] mx-auto px-16 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Text */}
          <div>
            <Reveal>
              <p className="font-mono text-[0.67rem] tracking-[0.2em] uppercase text-gold mb-3
                             flex items-center gap-3 after:content-[''] after:block after:w-14 after:h-px after:bg-gold after:opacity-50">
                Who I Am
              </p>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-off-white leading-[1.1] mb-8">
                Crafting <span className="text-gold">digital products</span> that scale
              </h2>
              <div className="space-y-5 text-[#c8d8e8] text-[1.02rem] leading-[1.85] font-light">
                <p>I&apos;m a Senior Software Engineer based in India with <strong className="text-gold2 font-medium">8+ years of experience</strong> architecting and delivering high-performance mobile and full-stack applications.</p>
                <p>My work spans Android development, REST API design, and modern web platforms across <strong className="text-gold2 font-medium">logistics, ride-hailing, food-tech, and CRM</strong> verticals — consistently focused on performance, reliability, and exceptional user experience.</p>
                <p>As a <strong className="text-gold2 font-medium">Top Rated Plus freelancer on Upwork</strong>, I&apos;ve delivered 50+ projects for global clients across the US, UK, UAE, and Australia, maintaining a perfect 100% Job Success Score.</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-7">
                {badges.map(b => (
                  <span key={b}
                    className="px-4 py-1.5 border border-[rgba(201,168,76,0.3)] font-mono text-[0.63rem] tracking-[0.1em] uppercase text-gold2
                               transition-all duration-200 hover:bg-[rgba(201,168,76,0.1)] hover:border-gold">
                    {b}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Card */}
          <Reveal delay={200}>
            <div className="relative overflow-hidden border border-[rgba(201,168,76,0.15)] p-10"
                 style={{ background: "linear-gradient(135deg, rgba(27,45,66,0.8), rgba(13,27,42,0.9))" }}>
              <div className="absolute top-0 left-0 right-0 h-0.5"
                   style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />

              {/* Upwork badge */}
              <div className="flex items-center gap-4 mb-7 pb-6 border-b border-[rgba(201,168,76,0.15)]">
                <div className="w-12 h-12 bg-gold flex items-center justify-center font-display font-black text-xl text-navy">U</div>
                <div>
                  <strong className="block text-gold2 text-[0.95rem] mb-0.5">Top Rated Plus Developer</strong>
                  <span className="font-mono text-[0.63rem] tracking-[0.1em] uppercase text-mid-gray">Upwork · Since 2017</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                {metrics.map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center py-3 border-b border-[rgba(255,255,255,0.05)] last:border-none">
                    <span className="text-[0.85rem] text-mid-gray">{label}</span>
                    <span className="font-display text-[1.4rem] text-gold font-bold">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-3">
                  <span className="text-[0.85rem] text-mid-gray">Education</span>
                  <div className="text-right">
                    <span className="font-display text-[1rem] text-gold font-bold block">BCA</span>
                    <span className="text-mid-gray text-[0.72rem]">YBN University</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
