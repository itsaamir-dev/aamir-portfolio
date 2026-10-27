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
        <section aria-labelledby="expect" className="section bg-bg">
          <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow">What to Expect</p>
              <h2 id="expect" className="h2 mt-4 text-ink">What members get</h2>
              <ul className="mt-8 space-y-4">
                {communityBenefits.map(b => (
                  <li key={b} className="flex gap-3 text-lg text-ink">
                    <Icon name="check" size={22} className="mt-0.5 shrink-0 text-accent-light" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card self-start">
              <h3 className="text-xl font-semibold text-ink">What it isn&apos;t</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                It&apos;s a place to learn, not a shortcut. Joining doesn&apos;t guarantee clients, earnings or
                employment — the lessons are only useful if you apply them and keep improving.
              </p>
            </div>
          </div>
        </section>

        {/* How to join */}
        <section aria-labelledby="how" className="section border-t border-line bg-bg">
          <div className="container-x">
            <p className="eyebrow">How to Join</p>
            <h2 id="how" className="h2 mt-4 text-ink">Three steps, about a minute</h2>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="card">
                  <span className="text-[2rem] font-bold leading-none text-highlight">{i + 1}</span>
                  <h3 className="mt-4 text-xl font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted">{s.text}</p>
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
