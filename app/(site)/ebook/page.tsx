import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import TrackView from "@/components/TrackView";
import TrackedLink from "@/components/TrackedLink";
import WhatsAppButton from "@/components/WhatsAppButton";
import BtnArrow from "@/components/BtnArrow";
import { Breadcrumb } from "@/components/PageHeader";
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
        <section className="pt-[72px] lg:pt-[80px]">
          <TrackView event="ebook_section_view" params={{ location: "ebook_page" }}
                     className="mx-2 grid gap-2 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-panel bg-surface px-5 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
              <div className="hero-stagger">
                <Breadcrumb items={[{ label: "E-book" }]} />
                <p className="eyebrow mt-8">Coming Soon · Waiting List Open</p>
                <h1 className="mt-4 text-[2.25rem] font-medium leading-[1.2] [text-wrap:balance] tracking-[-0.05em] text-ink sm:text-[3rem] xl:text-[3.5rem]">
                  {ebook.title} Is Coming.{" "}
                  <span className="mark">Get {ebook.discountPercent}% OFF at Launch.</span>
                </h1>
                <p className="mt-5 text-lg font-medium tracking-[-0.02em] text-ink">{ebook.subtitle}</p>
                <p className="lead mt-4 text-muted">
                  I&apos;m putting together the lessons I&apos;ve learned building an {EARNINGS} Upwork career. Join the
                  waiting list to get launch updates and access to the planned early-bird offer.
                </p>
                <ul className="mt-7 space-y-3">
                  {ebook.highlights.map(h => (
                    <li key={h} className="flex gap-3 text-base text-ink">
                      <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-on-ink">
                        <Icon name="check" size={12} />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div id="waitlist" className="sky scroll-mt-24 flex flex-col justify-center gap-8 rounded-panel px-3 py-10 sm:px-8 sm:py-14 lg:px-10">
              <div className="hidden lg:block"><EbookCover className="max-w-[13rem]" /></div>
              <div className="rounded-[1.75rem] bg-white/60 p-2 backdrop-blur-md dark:bg-black/45">
                <div className="rounded-t-card bg-card px-5 pt-6 sm:px-7 sm:pt-8">
                  <h2 className="text-[1.75rem] font-medium tracking-[-0.045em] text-ink">Join the waiting list</h2>
                  <p className="mt-1 text-base text-muted">Free to join. No payment required.</p>
                </div>
                <WaitlistForm source="ebook_page" className="rounded-t-none !pt-5" />
                <p className="px-4 pb-3 pt-4 text-sm text-ink/80">
                  {ebook.offerIsPlanned
                    ? `The ${ebook.discountPercent}% discount is a planned launch offer. The final price, launch date and terms will be confirmed before launch.`
                    : null}
                  {price != null && ` Planned launch price: ${formatPrice(price)} (${ebook.discountPercent}% off ${formatPrice(ebook.regularPrice!)}).`}
                </p>
              </div>
            </div>
          </TrackView>
        </section>

        {/* What it covers */}
        <section aria-labelledby="covers" className="section">
          <div className="container-x">
            <div className="mx-auto max-w-prose text-center">
              <p className="eyebrow">What It Covers</p>
              <h2 id="covers" className="h2 mt-4">Practical skills for getting international clients</h2>
              <p className="lead mx-auto mt-5 max-w-xl text-muted">{ebook.description}</p>
            </div>
            <ul className="tray mt-10 grid gap-2 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
              {covers.map((c, i) => (
                <li key={c.title} className={`flex min-h-[190px] flex-col justify-end rounded-card p-6 sm:p-7
                                             ${i === covers.length - 1 ? "bg-night text-white sm:col-span-2 lg:col-span-1" : "bg-card"}`}>
                  <h3 className="text-[1.3rem] font-medium tracking-[-0.04em]">{c.title}</h3>
                  <p className={`mt-2 text-base leading-relaxed ${i === covers.length - 1 ? "text-night-muted" : "text-muted"}`}>{c.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who it's for + what happens next */}
        <section aria-labelledby="for" className="pb-16 sm:pb-20 lg:pb-28">
          <div className="container-x grid gap-2 lg:grid-cols-2">
            <div className="rounded-panel bg-surface p-6 sm:p-10">
              <p className="eyebrow">Who It&apos;s For</p>
              <h2 id="for" className="mt-4 text-[1.85rem] font-medium leading-tight tracking-[-0.045em] text-ink sm:text-[2.25rem]">Written for skilled people starting to freelance</h2>
              <ul className="mt-8 space-y-3">
                {ebook.audience.map(a => (
                  <li key={a} className="flex gap-3 text-base leading-relaxed text-ink">
                    <span aria-hidden="true" className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
                      <Icon name="check" size={12} />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted">It won&apos;t guarantee clients or income — it shares what has worked in my own freelancing.</p>
            </div>
            <div className="rounded-panel bg-surface p-6 sm:p-10">
              <p className="eyebrow">After You Sign Up</p>
              <h2 className="mt-4 text-[1.85rem] font-medium leading-tight tracking-[-0.045em] text-ink sm:text-[2.25rem]">What happens next</h2>
              <ol className="mt-8 space-y-2">
                {afterSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-4 rounded-2xl bg-card p-4 sm:p-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-sm text-on-ink">{i + 1}</span>
                    <div>
                      <h3 className="text-lg font-medium tracking-[-0.03em] text-ink">{s.title}</h3>
                      <p className="mt-1 text-base leading-relaxed text-muted">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <TrackedLink href="#waitlist" event="ebook_waitlist_cta_click" params={{ location: "ebook_steps" }}
                           className="btn-primary mt-8">
                Join the waiting list
                <BtnArrow />
              </TrackedLink>
            </div>
          </div>
        </section>

        {/* Learn meanwhile */}
        <section aria-labelledby="meanwhile" className="py-2">
          <div className="panel on-dark bg-night px-5 py-16 text-center text-white sm:py-20">
            <div className="mx-auto max-w-prose">
              <h2 id="meanwhile" className="h2">Learn in the meantime</h2>
              <p className="lead mx-auto mt-5 max-w-xl text-night-muted">
                The free WhatsApp community and the{" "}
                <TrackedLink href="/learn" event="learn_resource_click" params={{ topic: "all", location: "ebook" }}
                             className="font-semibold text-white underline decoration-accent decoration-2 underline-offset-4">learning resources</TrackedLink>{" "}
                are open now — no purchase needed.
              </p>
              <div className="mt-8 flex justify-center">
                <WhatsAppButton location="ebook_meanwhile" />
              </div>
            </div>
          </div>
        </section>

        <FAQ items={ebookFaqs} title="E-book Questions" />
      </main>

      <Footer />
    </>
  );
}
