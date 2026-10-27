import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrackedLink from "@/components/TrackedLink";
import BtnArrow from "@/components/BtnArrow";
import Typewriter from "@/components/Typewriter";
import { EARNINGS, TRUST_LINE } from "@/lib/site";

// Facts from the story, shown as glass chips beside the portrait.
const chips = [
  { k: "8+ years", v: "as a software engineer", pos: "left-0 top-[34%] sm:-left-24 xl:-left-10" },
  { k: "Sept 2024", v: "started on Upwork seriously", pos: "right-0 top-[58%] sm:-right-24 xl:-right-6" },
];

export default function Hero() {
  return (
    <section id="hero" className="pt-[72px] lg:pt-[80px]">
      <div data-arrow-zone className="panel sky on-dark relative overflow-hidden text-white">
        <div className="container-x grid items-end gap-6 pt-10 sm:pt-14 xl:min-h-[540px] xl:grid-cols-[1.15fr_0.85fr] xl:gap-8 xl:pt-0">

          {/* Content */}
          <div className="hero-stagger self-center xl:py-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5
                          font-mono text-xs uppercase tracking-[0.12em] backdrop-blur-md">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Build With Aamir
            </p>

            <h1 className="mt-5 max-w-[16ch] font-display text-[2rem] font-medium leading-[1.06] tracking-[-0.035em]
                           sm:text-[2.6rem] lg:text-[2.9rem] xl:text-[3.25rem]">
              I Built My <Typewriter word="Freelance" /> Career.{" "}
              <span className="text-white/70">Now I Help You Build Yours.</span>
            </h1>

            <p className="lead mt-5 max-w-[34rem] text-white/90">
              Software engineer who earned{" "}
              <strong className="mark font-semibold">{EARNINGS} on Upwork</strong> in ~1.5 years. I share
              what works: landing international clients, better proposals and earning in USD.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppButton primary location="hero" />
              <TrackedLink href="/story" event="story_click" params={{ location: "hero" }} className="btn-glass">
                Explore my story
                <BtnArrow tone="lime" />
              </TrackedLink>
            </div>

            <p className="mt-5 max-w-[34rem] text-[0.95rem] text-white/80">{TRUST_LINE}</p>
          </div>

          {/* Portrait — stands on the panel's bottom edge */}
          <div className="relative mx-auto w-full max-w-[15rem] sm:max-w-[20rem] xl:max-w-[25rem] xl:self-end">
            <div aria-hidden="true"
                 className="absolute inset-x-[8%] bottom-0 top-[18%] rounded-full bg-white/25 blur-3xl" />
            <Image
              src="/hero-portrait.png"
              alt="Portrait of Aamir Bashir, software engineer and founder of Build With Aamir"
              width={1099}
              height={1348}
              priority
              sizes="(min-width: 1280px) 25rem, (min-width: 640px) 20rem, 15rem"
              className="img-reveal relative h-auto w-full"
            />
            {chips.map(c => (
              <div key={c.k}
                   className={`scheme-light absolute hidden rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-ink
                               shadow-[0_12px_40px_rgba(19,40,90,0.25)] backdrop-blur-md sm:block motion-safe:animate-float ${c.pos}`}>
                <p className="text-xl font-medium leading-none tracking-[-0.04em]">{c.k}</p>
                <p className="mt-1 text-xs text-muted">{c.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
