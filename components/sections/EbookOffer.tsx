import Reveal from "@/components/RevealOnScroll";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import TrackView from "@/components/TrackView";
import EbookCover from "@/components/ebook/EbookCover";
import { ebook } from "@/lib/ebook";
import { EARNINGS } from "@/lib/site";

/** Homepage e-book offer. The form itself lives on /ebook. */
export default function EbookOffer() {
  return (
    <section id="ebook" aria-labelledby="ebook-heading" className="section border-t border-line bg-bg">
      <TrackView event="ebook_section_view" params={{ location: "home" }} className="container-x">
        <Reveal className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <EbookCover className="lg:max-w-[20rem]" />

          <div>
            <p className="eyebrow">Coming Soon · Early Access</p>
            <h2 id="ebook-heading" className="h2 mt-4 text-ink">
              {ebook.title} Is Coming.{" "}
              <span className="text-highlight">Get {ebook.discountPercent}% OFF at Launch.</span>
            </h2>
            <p className="lead mt-5 text-muted">
              I&apos;m putting together the lessons I&apos;ve learned building an {EARNINGS} Upwork career. Join the
              waiting list to get launch updates and access to the planned early-bird offer.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {ebook.highlights.map(h => (
                <li key={h} className="flex gap-3 text-base text-ink">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-accent-light" />
                  {h}
                </li>
              ))}
            </ul>
            <TrackedLink href="/ebook#waitlist" event="ebook_waitlist_cta_click" params={{ location: "home" }}
                         className="btn-primary mt-8">
              Join the waiting list
            </TrackedLink>
            <p className="mt-4 text-sm text-muted">
              Join the list for launch updates and early-access details. No payment required to join.
            </p>
          </div>
        </Reveal>
      </TrackView>
    </section>
  );
}
