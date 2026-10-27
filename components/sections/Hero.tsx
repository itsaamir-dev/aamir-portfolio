import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrackedLink from "@/components/TrackedLink";
import { EARNINGS, TRUST_LINE } from "@/lib/site";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-bg pt-16">
      <div className="container-x grid items-end gap-8 pt-10 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:pt-20">

        {/* Content */}
        <div className="hero-stagger lg:pb-20">
          <p className="eyebrow">Build With Aamir</p>

          <h1 className="mt-5 text-[2.15rem] font-bold leading-[1.08] tracking-tight text-ink
                         sm:text-5xl lg:text-[3.4rem] xl:text-[3.75rem]">
            I Built My Freelancing Career.{" "}
            <span className="text-muted">Now I&apos;m Showing Others How to Build Theirs.</span>
          </h1>

          <p className="lead mt-6 max-w-[38rem] text-muted">
            I&apos;m Aamir, a software engineer and Upwork freelancer. I&apos;ve earned{" "}
            <strong className="font-semibold text-highlight">{EARNINGS} on Upwork</strong> in approximately 1.5 years,
            and I&apos;m documenting the practical lessons I&apos;ve learned about finding international clients,
            writing better proposals, communicating with clients and earning in USD.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppButton primary location="hero" />
            <TrackedLink href="/story" event="story_click" params={{ location: "hero" }} className="btn-ghost">
              Explore my story
            </TrackedLink>
          </div>

          <p className="mt-5 text-[0.95rem] text-muted">{TRUST_LINE}</p>
        </div>

        {/* Portrait — kept compact on phones so the hero doesn't run long */}
        <div className="relative mx-auto w-full max-w-[15rem] sm:max-w-[24rem] lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-x-[10%] bottom-0 top-[20%] rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(57,245,106,0.16), transparent 70%)" }}
          />
          <Image
            src="/hero-portrait.png"
            alt="Portrait of Aamir Bashir, software engineer and founder of Build With Aamir"
            width={1099}
            height={1348}
            priority
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 24rem, 15rem"
            className="img-reveal relative h-auto w-full"
            style={{ maskImage: "linear-gradient(to top, transparent 0%, black 14%)",
                     WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 14%)" }}
          />
        </div>
      </div>
    </section>
  );
}
