import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Timeline from "@/components/Timeline";
import Proof from "@/components/sections/Proof";
import FinalCTA from "@/components/sections/FinalCTA";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrackedLink from "@/components/TrackedLink";
import { EARNINGS } from "@/lib/site";
import { SITE_URL, personSchema, pageMetadata, breadcrumb, jsonLd } from "@/lib/seo";

const PATH  = "/story";
const TITLE = "My Story: From Software Engineer to Upwork Freelancer";
const DESC  =
  `How Aamir Bashir went from 8+ years of software engineering to ${EARNINGS} on Upwork in about 1.5 years — the real timeline, approximate numbers and lessons, without the hype.`;

export const metadata: Metadata = pageMetadata(PATH, TITLE, DESC);

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":     "ProfilePage",
      "@id":       `${SITE_URL}${PATH}#webpage`,
      url:         `${SITE_URL}${PATH}`,
      name:        TITLE,
      description: DESC,
      mainEntity:  personSchema,
      isPartOf:    { "@id": `${SITE_URL}/#website` },
    },
    breadcrumb(PATH, "My Story"),
  ],
};

// Lessons the founder has shared in the 30-day journey (Days 5, 6, 7 and 9).
const lessons = [
  {
    title: "Relevance beats volume",
    text: "Applying to fewer, genuinely relevant projects does more than sending generic proposals to everything.",
  },
  {
    title: "Start with the client’s problem",
    text: "Clients care about their problem being solved. A proposal that shows I understood it says more than a list of skills.",
  },
  {
    title: "Explain your value clearly",
    text: "Being good at the work isn’t enough on its own. A proposal needs to say, specifically, what the client gets.",
  },
  {
    title: "Trust is built through communication",
    text: "Clear communication builds the trust a client needs before hiring you, and while you work together.",
  },
];

export default function StoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <PageHeader
        crumb="My Story"
        eyebrow="My Story"
        title="From Developer to Freelancer: The Real Journey"
        actions={<WhatsAppButton primary location="story_header" />}
      >
        <p>
          I&apos;m Aamir Bashir, a software engineer with 8+ years of experience. In September 2024 I started taking
          Upwork seriously. About 1.5 years later I&apos;ve earned {EARNINGS} there.
        </p>
        <p>This is the honest version of how that happened, and what I&apos;m doing with it now.</p>
      </PageHeader>

      <main>
        {/* Narrative + timeline */}
        <section aria-labelledby="journey" className="section bg-paper text-ink-dark">
          <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="max-w-prose space-y-5 text-[1.0625rem] leading-relaxed text-muted-dark">
              <h2 id="journey" className="h2 text-ink-dark">The timeline</h2>
              <p>
                Before freelancing, I had already spent years building Android, web and backend software. The
                engineering side wasn&apos;t new. Freelancing was.
              </p>
              <p>
                When I started taking Upwork seriously in September 2024, my first project was a MERN stack website
                for a Jiu Jitsu platform. The first payment was approximately $3,000 — enough to show me this could
                work.
              </p>
              <p>
                January 2025 was a major breakthrough. In my first year I averaged approximately $1K+ a month; in the
                second, approximately $4K+ a month. Today the total is {EARNINGS} across roughly 18 completed jobs,
                with around 70% of clients in the US.
              </p>
              <p>
                None of this was effortless, and it isn&apos;t typical or guaranteed. I also started with years of
                technical experience that many people starting out don&apos;t have.
              </p>
            </div>
            <Timeline />
          </div>
        </section>

        <Proof />

        {/* Lessons */}
        <section aria-labelledby="lessons" className="section bg-bg">
          <div className="container-x">
            <p className="eyebrow">What I Learned</p>
            <h2 id="lessons" className="h2 mt-4 max-w-prose text-ink">The lessons I keep coming back to</h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {lessons.map(l => (
                <li key={l.title} className="card">
                  <h3 className="text-xl font-semibold text-ink">{l.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted">{l.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-prose text-base text-muted">
              I&apos;m sharing these one day at a time in the{" "}
              <TrackedLink href="/challenge" event="challenge_click" params={{ target: "journey", location: "story" }}
                           className="font-semibold text-accent-light underline underline-offset-4">
                30-day journey
              </TrackedLink>{" "}
              and in more depth in the{" "}
              <TrackedLink href="/learn" event="learn_resource_click" params={{ topic: "all", location: "story" }}
                           className="font-semibold text-accent-light underline underline-offset-4">
                learning resources
              </TrackedLink>.
            </p>
          </div>
        </section>

        {/* Why now */}
        <section aria-labelledby="now" className="section border-t border-line bg-bg">
          <div className="container-x max-w-prose">
            <h2 id="now" className="h2 text-ink">Why I&apos;m documenting it now</h2>
            <div className="lead mt-5 space-y-5 text-muted">
              <p>
                Many skilled developers, designers and other professionals could work with international clients but
                don&apos;t know where to start, or send proposals that get no replies.
              </p>
              <p>
                So I&apos;m documenting what I&apos;ve learned — the practical side of profiles, proposals, client
                communication and pricing — and sharing it for free in the Build With Aamir community.
              </p>
            </div>
          </div>
        </section>

        <FinalCTA location="story_final" />
      </main>

      <Footer />
    </>
  );
}
