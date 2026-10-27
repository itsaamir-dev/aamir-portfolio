import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import FinalCTA from "@/components/sections/FinalCTA";
import { ChallengeProgress, LatestDay, ChallengeDayList } from "@/components/ChallengeList";
import { latestChallengeDay, CHALLENGE_TOTAL } from "@/lib/site";
import { SITE_URL, pageMetadata, breadcrumb, jsonLd } from "@/lib/seo";

const PATH  = "/challenge";
const TITLE = "30 Days of Building in Public: Freelancing Lessons";
const DESC  =
  `Follow Aamir’s 30-day journey building a freelancing education brand in public. Latest: Day ${latestChallengeDay.day} — ${latestChallengeDay.title}`;

export const metadata: Metadata = pageMetadata(PATH, TITLE, DESC);

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":     "CollectionPage",
      "@id":       `${SITE_URL}${PATH}#webpage`,
      url:         `${SITE_URL}${PATH}`,
      name:        TITLE,
      description: DESC,
      isPartOf:    { "@id": `${SITE_URL}/#website` },
    },
    breadcrumb(PATH, "30-Day Challenge"),
  ],
};

export default function ChallengePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <PageHeader crumb="30-Day Challenge" eyebrow="30-Day Challenge" title="30 Days of Building in Public">
        <p>
          I&apos;m documenting the lessons, experiments and practical insights behind building my freelancing
          education brand — one day at a time, {CHALLENGE_TOTAL} days in total.
        </p>
      </PageHeader>

      <main>
      <section aria-label="Journey" className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="sr-only">Latest day</h2>
            <LatestDay />
          </div>
          <div>
            <ChallengeProgress />
            <h2 className="mt-10 text-[1.75rem] font-medium tracking-[-0.045em]">The journey so far</h2>
            <p className="mt-2 text-base text-muted">
              New days are shared in the free community as they go out.
            </p>
            <div className="mt-6">
              <ChallengeDayList />
            </div>
          </div>
        </div>
      </section>

      <FinalCTA location="challenge_final" />
      </main>
      <Footer />
    </>
  );
}
