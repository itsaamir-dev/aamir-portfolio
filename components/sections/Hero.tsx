import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";
import { PROMISE } from "@/lib/site";

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-bg pt-16">
      <div className="container-x grid items-end gap-10 pt-12 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:pt-20">

        {/* Content */}
        <div className="hero-stagger pb-4 lg:pb-24">
          <p className="eyebrow">Build With Aamir</p>

          <h1 className="mt-5 text-[2.25rem] font-extrabold leading-[1.08] tracking-tight text-ink
                         sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem]">
            I Built My Freelancing Career.{" "}
            <span className="text-muted">Now I&apos;m Showing Others How To Build Theirs.</span>
          </h1>

          <p className="lead mt-6 max-w-[38rem] text-muted">
            I&apos;m Aamir, a software engineer with 8+ years of experience. I earned{" "}
            <strong className="font-semibold text-ink">$70K+ on Upwork in about 1.5 years</strong>, and I&apos;m
            sharing what actually worked: finding international clients, writing proposals and getting paid in USD.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppButton primary location="hero" />
            <a href="#story" className="btn-ghost">Read my story</a>
          </div>

          <p className="mt-5 text-[0.95rem] text-muted">{PROMISE}</p>
        </div>

        {/* Portrait */}
        <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-x-[10%] bottom-0 top-[20%] rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(124,92,255,0.45), transparent 70%)" }}
          />
          <Image
            src="/hero-portrait.png"
            alt="Aamir Bashir, software engineer and Upwork freelancer"
            width={1099}
            height={1348}
            priority
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 26rem, 22rem"
            className="img-reveal relative h-auto w-full"
            style={{ maskImage: "linear-gradient(to top, transparent 0%, black 14%)",
                     WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 14%)" }}
          />
        </div>
      </div>
    </section>
  );
}
