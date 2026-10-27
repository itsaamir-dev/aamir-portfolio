import Reveal from "@/components/RevealOnScroll";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import TrackView from "@/components/TrackView";
import BtnArrow from "@/components/BtnArrow";
import EbookCover from "@/components/ebook/EbookCover";
import { ebook } from "@/lib/ebook";
import { EARNINGS } from "@/lib/site";

/** Homepage e-book offer. The form itself lives on /ebook. */
export default function EbookOffer() {
  return (
    <section id="ebook" aria-labelledby="ebook-heading" className="py-8 sm:py-12">
      <TrackView event="ebook_section_view" params={{ location: "home" }} className="container-x">
        <Reveal className="tray grid gap-2 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="sky flex items-center justify-center rounded-card px-6 py-12 sm:py-16">
            <EbookCover className="max-w-[16rem] lg:max-w-[18rem]" />
          </div>

          <div className="tray-card flex flex-col justify-center sm:!p-10 lg:!p-14">
            <p className="eyebrow">Coming Soon · Early Access</p>
            <h2 id="ebook-heading" className="h2 mt-4 !leading-[1.25] !text-[2rem] sm:!text-[2.5rem]">
              {ebook.title} Is Coming.{" "}
              <span className="mark">Get {ebook.discountPercent}% OFF at Launch.</span>
            </h2>
            <p className="lead mt-5 text-muted">
              I&apos;m putting together the lessons I&apos;ve learned building an {EARNINGS} Upwork career. Join the
              waiting list to get launch updates and access to the planned early-bird offer.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {ebook.highlights.map(h => (
                <li key={h} className="flex gap-3 text-base text-ink">
                  <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-accent">
                    <Icon name="check" size={12} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <TrackedLink href="/ebook#waitlist" event="ebook_waitlist_cta_click" params={{ location: "home" }}
                           className="btn-primary">
                Join the waiting list
                <BtnArrow />
              </TrackedLink>
            </div>
            <p className="mt-4 text-sm text-muted">
              Join the list for launch updates and early-access details. No payment required to join.
            </p>
          </div>
        </Reveal>
      </TrackView>
    </section>
  );
}
