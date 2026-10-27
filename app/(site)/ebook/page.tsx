import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import TrackView from "@/components/TrackView";
import TrackedLink from "@/components/TrackedLink";
import WhatsAppButton from "@/components/WhatsAppButton";
import FAQ from "@/components/sections/FAQ";
import EbookCover from "@/components/ebook/EbookCover";
import WaitlistForm from "@/components/ebook/WaitlistForm";
import { ebook, ebookFaqs, launchPrice, formatPrice } from "@/lib/ebook";
import { EARNINGS } from "@/lib/site";
import { SITE_URL, pageMetadata, breadcrumb, jsonLd } from "@/lib/seo";

const PATH  = "/ebook";
const TITLE = `${ebook.title}: Freelancing Guide for Developers (Waiting List)`;
const DESC  =
  `Join the free waiting list for ${ebook.title} — a practical freelancing guide for developers on finding international clients, writing better Upwork proposals and earning in USD. Planned ${ebook.discountPercent}% launch discount.`;

export const metadata: Metadata = pageMetadata(PATH, TITLE, DESC);

const covers = [
  { title: "Positioning your skills",       text: "Presenting relevant experience so the right clients understand what you offer." },
  { title: "Finding the right opportunities", text: "Spotting projects that fit, and approaching clients beyond your local market." },
  { title: "Writing stronger proposals",     text: "Addressing the client’s actual problem and explaining your value clearly." },
  { title: "Communicating with clients",     text: "Building trust before and during a project." },
  { title: "A sustainable career",           text: "Pricing, client relationships and growing over time — without promised numbers." },
];

const afterSteps = [
  { title: "You’re added to the list", text: "Your details are saved and you’ll see a confirmation straight away." },
  { title: "Launch updates",           text: "When the price, launch date and offer terms are confirmed, the list hears first." },
  { title: "Early-access offer",       text: `Once the terms are confirmed, the list gets early access to the planned ${ebook.discountPercent}% launch discount.` },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":     "WebPage",
      "@id":       `${SITE_URL}${PATH}#webpage`,
      url:         `${SITE_URL}${PATH}`,
      name:        TITLE,
      description: DESC,
      isPartOf:    { "@id": `${SITE_URL}/#website` },
      about:       { "@type": "Book", name: `${ebook.title}: ${ebook.subtitle}`, author: { "@id": `${SITE_URL}/#person` } },
    },
    breadcrumb(PATH, "E-book"),
    {
      "@type": "FAQPage",
      mainEntity: ebookFaqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
};

export default function EbookPage() {
  const price = launchPrice();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <main>
        {/* Hero + form */}
        <section className="border-b border-line bg-bg pb-16 pt-28 sm:pt-36">
          <TrackView event="ebook_section_view" params={{ location: "ebook_page" }}
                     className="container-x grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <Link href="/" className="hover:text-ink">Home</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page" className="text-accent-light">E-book</span>
              </nav>
              <p className="eyebrow mt-8">Coming Soon · Waiting List Open</p>
              <h1 className="mt-4 text-[2.1rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                {ebook.title} Is Coming.{" "}
                <span className="text-highlight">Get {ebook.discountPercent}% OFF at Launch.</span>
              </h1>
              <p className="mt-4 text-lg font-semibold text-ink">{ebook.subtitle}</p>
              <p className="lead mt-4 text-muted">
                I&apos;m putting together the lessons I&apos;ve learned building an {EARNINGS} Upwork career. Join the
                waiting list to get launch updates and access to the planned early-bird offer.
              </p>
              <ul className="mt-7 space-y-3">
                {ebook.highlights.map(h => (
                  <li key={h} className="flex gap-3 text-base text-ink">
                    <Icon name="check" size={20} className="mt-0.5 shrink-0 text-accent-light" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-10 hidden lg:block"><EbookCover className="mx-0" /></div>
            </div>

            <div id="waitlist" className="scroll-mt-24 lg:pt-16">
              <h2 className="text-2xl font-bold text-ink">Join the waiting list</h2>
              <p className="mt-2 mb-6 text-base text-muted">Free to join. No payment required.</p>
              <WaitlistForm source="ebook_page" />
              <p className="mt-4 text-sm text-muted">
                {ebook.offerIsPlanned
                  ? `The ${ebook.discountPercent}% discount is a planned launch offer. The final price, launch date and terms will be confirmed before launch.`
                  : null}
                {price != null && ` Planned launch price: ${formatPrice(price)} (${ebook.discountPercent}% off ${formatPrice(ebook.regularPrice!)}).`}
              </p>
            </div>
          </TrackView>
        </section>

        {/* What it covers */}
        <section aria-labelledby="covers" className="section bg-paper text-ink-dark">
          <div className="container-x">
            <p className="eyebrow-light">What It Covers</p>
            <h2 id="covers" className="h2 mt-4 max-w-prose">Practical skills for getting international clients</h2>
            <p className="lead mt-5 max-w-prose text-muted-dark">{ebook.description}</p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {covers.map(c => (
                <li key={c.title} className="rounded-2xl border border-line-light bg-white p-6">
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-dark">{c.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who it's for + what happens next */}
        <section aria-labelledby="for" className="section bg-bg">
          <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow">Who It&apos;s For</p>
              <h2 id="for" className="h2 mt-4 text-ink">Written for skilled people starting to freelance</h2>
              <ul className="mt-8 space-y-4">
                {ebook.audience.map(a => (
                  <li key={a} className="flex gap-3 text-base leading-relaxed text-muted">
                    <Icon name="check" size={20} className="mt-0.5 shrink-0 text-accent-light" />
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted">It won&apos;t guarantee clients or income — it shares what has worked in my own freelancing.</p>
            </div>
            <div>
              <p className="eyebrow">After You Sign Up</p>
              <h2 className="h2 mt-4 text-ink">What happens next</h2>
              <ol className="mt-8 space-y-4">
                {afterSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="text-2xl font-bold leading-none text-highlight">{i + 1}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
                      <p className="mt-1 text-base leading-relaxed text-muted">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <TrackedLink href="#waitlist" event="ebook_waitlist_cta_click" params={{ location: "ebook_steps" }}
                           className="btn-primary mt-8">
                Join the waiting list
              </TrackedLink>
            </div>
          </div>
        </section>

        {/* Learn meanwhile */}
        <section aria-labelledby="meanwhile" className="section border-t border-line bg-bg">
          <div className="container-x max-w-prose text-center">
            <h2 id="meanwhile" className="h2 text-ink">Learn in the meantime</h2>
            <p className="lead mx-auto mt-5 max-w-xl text-muted">
              The free WhatsApp community and the{" "}
              <TrackedLink href="/learn" event="learn_resource_click" params={{ topic: "all", location: "ebook" }}
                           className="font-semibold text-accent-light underline underline-offset-4">learning resources</TrackedLink>{" "}
              are open now — no purchase needed.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsAppButton location="ebook_meanwhile" />
            </div>
          </div>
        </section>

        <FAQ items={ebookFaqs} title="E-book Questions" />
      </main>

      <Footer />
    </>
  );
}
