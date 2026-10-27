import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Icon from "@/components/Icon";
import WhatsAppButton from "@/components/WhatsAppButton";
import FAQ from "@/components/sections/FAQ";
import WhoShouldJoin from "@/components/sections/WhoShouldJoin";
import { communityBenefits, faqs, PROMISE } from "@/lib/site";
import { SITE_URL, pageMetadata, breadcrumb, jsonLd } from "@/lib/seo";

const PATH  = "/community";
const TITLE = "Free Freelancing Community on WhatsApp";
const DESC  =
  "Join the free Build With Aamir WhatsApp Community to learn freelancing, improve your Upwork proposals, discuss finding international clients and follow the 30-day journey.";

export const metadata: Metadata = pageMetadata(PATH, TITLE, DESC);

const steps = [
  { title: "Tap the button",      text: "Any “Join the free WhatsApp community” button on this site opens the invite." },
  { title: "Join in WhatsApp",    text: "WhatsApp shows the Build With Aamir community. Tap join — there’s nothing to pay." },
  { title: "Learn and ask",       text: "Follow the lessons and 30-day updates, and bring your client acquisition questions." },
];

const communityFaqs = faqs.filter(f => !f.q.startsWith("Do I need"));

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
    },
    breadcrumb(PATH, "Community"),
  ],
};

export default function CommunityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <PageHeader
        crumb="Community"
        eyebrow="Free WhatsApp Community"
        title="Build Your Freelancing Career With Us"
        actions={<WhatsAppButton primary location="community_header" />}
      >
        <p>
          Join the free Build With Aamir WhatsApp Community to learn freelancing, discuss client acquisition
          challenges, and follow practical lessons from my journey.
        </p>
        <p className="text-base">{PROMISE} Free to join, and you can leave any time.</p>
      </PageHeader>

      <main>
        {/* What to expect */}
        <section aria-labelledby="expect" className="section">
          <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="eyebrow">What to Expect</p>
              <h2 id="expect" className="h2 mt-4 text-ink">What members get</h2>
              <ul className="tray mt-8 space-y-1">
                {communityBenefits.map(b => (
                  <li key={b} className="flex gap-3 rounded-2xl bg-white p-4 text-lg tracking-[-0.02em] text-ink sm:p-5">
                    <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
                      <Icon name="check" size={14} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="on-dark self-end rounded-panel bg-night p-7 text-white sm:p-9">
              <h3 className="text-[1.5rem] font-medium tracking-[-0.04em]">What it isn&apos;t</h3>
              <p className="mt-3 text-base leading-relaxed text-night-muted">
                It&apos;s a place to learn, not a shortcut. Joining doesn&apos;t guarantee clients, earnings or
                employment — the lessons are only useful if you apply them and keep improving.
              </p>
            </div>
          </div>
        </section>

        {/* How to join */}
        <section aria-labelledby="how" className="pb-16 sm:pb-20 lg:pb-28">
          <div className="container-x">
            <div className="mx-auto max-w-prose text-center">
              <p className="eyebrow">How to Join</p>
              <h2 id="how" className="h2 mt-4 text-ink">Three steps, about a minute</h2>
            </div>
            <ol className="tray mt-10 grid gap-2 md:grid-cols-3 lg:mt-14">
              {steps.map((s, i) => (
                <li key={s.title} className={`flex min-h-[230px] flex-col rounded-card p-6 sm:p-7 ${i === 2 ? "bg-accent" : "bg-white"}`}>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm
                                    ${i === 2 ? "bg-ink text-accent" : "bg-surface text-ink"}`}>{i + 1}</span>
                  <h3 className="mt-auto pt-8 text-[1.375rem] font-medium tracking-[-0.04em] text-ink">{s.title}</h3>
                  <p className={`mt-2 text-base leading-relaxed ${i === 2 ? "text-ink/75" : "text-muted"}`}>{s.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex justify-center">
              <WhatsAppButton primary location="community_steps" />
            </div>
          </div>
        </section>

        <WhoShouldJoin />
        <FAQ items={communityFaqs} title="Community Questions" />
      </main>

      <Footer />
    </>
  );
}
