"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

const stats = [
  { num: 8,  suffix: "+", label: "Years Exp." },
  { num: 60, prefix: "$", suffix: "K+", label: "Upwork Earned" },
  { num: 50, suffix: "+", label: "Projects" },
  { num: 100, suffix: "%", label: "Job Success" },
];

export default function Hero() {
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Animate numbers
    const animateCount = (el: HTMLSpanElement, target: number, prefix = "", suffix = "") => {
      let cur = 0;
      const step = target / 50;
      const iv = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = prefix + Math.floor(cur).toLocaleString() + suffix;
        if (cur >= target) clearInterval(iv);
      }, 25);
    };
    const delay = setTimeout(() => {
      stats.forEach(({ num, prefix = "", suffix }, i) => {
        const el = statRefs.current[i];
        if (el) animateCount(el, num, prefix, suffix);
      });
    }, 800);
    return () => clearTimeout(delay);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-16 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 70% 50%, rgba(42,100,150,0.18) 0%, transparent 70%),
                       radial-gradient(ellipse 50% 40% at 10% 80%, rgba(201,168,76,0.08) 0%, transparent 60%),
                       linear-gradient(160deg, #0D1B2A 0%, #0a1520 100%)`
        }}
      />

      {/* Decorative lines */}
      <div className="absolute right-0 top-0 bottom-0 w-[45%] z-0 opacity-[0.12]">
        <svg viewBox="0 0 500 800" preserveAspectRatio="xMidYMid slice" fill="none" className="w-full h-full">
          <line x1="100" y1="0" x2="400" y2="800" stroke="#C9A84C" strokeWidth="0.5"/>
          <line x1="200" y1="0" x2="500" y2="800" stroke="#C9A84C" strokeWidth="0.5"/>
          <line x1="0" y1="200" x2="500" y2="400" stroke="#2A6496" strokeWidth="0.5"/>
          <line x1="0" y1="400" x2="500" y2="600" stroke="#2A6496" strokeWidth="0.5"/>
          <circle cx="350" cy="300" r="120" stroke="#C9A84C" strokeWidth="0.5"/>
          <circle cx="350" cy="300" r="200" stroke="#C9A84C" strokeWidth="0.3"/>
          <circle cx="350" cy="300" r="280" stroke="#2A6496" strokeWidth="0.3"/>
          <rect x="250" y="150" width="180" height="180" stroke="#C9A84C" strokeWidth="0.4" transform="rotate(15 340 240)"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-gold mb-7
                        opacity-0 animate-fade-up-d1"
             style={{ animationFillMode: "forwards" }}>
          <span className="block w-10 h-px bg-gold" />
          Senior Software Engineer
        </div>

        <h1 className="font-display font-black leading-[0.95] text-off-white mb-0
                       opacity-0 animate-fade-up-d2"
            style={{ fontSize: "clamp(3.8rem, 8vw, 7.5rem)", animationFillMode: "forwards" }}>
          Aamir<br/>
          <span className="text-gold">Bashir</span>
        </h1>

        <p className="font-body font-light mt-5 text-light-blue
                      opacity-0 animate-fade-up-d3"
           style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)", lineHeight: 1.6, animationFillMode: "forwards" }}>
          <strong className="text-gold2 font-medium">8+ Years</strong> building mobile &amp; full-stack applications ·
          Android (Kotlin) · React · Node.js<br/>
          India · Open to Remote (US / EU)
        </p>

        {/* Stats */}
        <div className="flex gap-12 mt-10 opacity-0 animate-fade-up-d4"
             style={{ animationFillMode: "forwards" }}>
          {stats.map(({ label, prefix = "", suffix }, i) => (
            <div key={label} className="flex flex-col gap-1">
              <span
                ref={el => { statRefs.current[i] = el; }}
                className="font-display text-[2.4rem] font-bold text-gold leading-none"
              >
                {prefix}0{suffix}
              </span>
              <span className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-mid-gray">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-5 mt-10 flex-wrap opacity-0 animate-fade-up-d5"
             style={{ animationFillMode: "forwards" }}>
          <Link href="#contact"
            className="btn-clip px-9 py-[0.85rem] bg-gold text-navy font-mono text-[0.7rem] tracking-[0.12em] uppercase font-semibold
                       transition-all duration-200 hover:bg-gold2 hover:-translate-y-0.5">
            Get In Touch
          </Link>
          <Link href="#experience"
            className="px-9 py-[0.85rem] bg-transparent text-light-blue font-mono text-[0.7rem] tracking-[0.12em] uppercase
                       border border-[rgba(201,168,76,0.4)] transition-all duration-200 hover:border-gold hover:text-gold hover:-translate-y-0.5">
            View Experience
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                      font-mono text-[0.6rem] tracking-[0.14em] uppercase text-mid-gray
                      opacity-0 animate-fade-in"
           style={{ animationFillMode: "forwards" }}>
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent animate-scroll-pulse" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
