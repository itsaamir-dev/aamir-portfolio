import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import JobCard from "@/components/jobs/JobCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import Icon from "@/components/Icon";
import { getOpenJobs } from "@/lib/jobs-data";
import { SITE_URL, pageMetadata, breadcrumb, jsonLd } from "@/lib/seo";

const PATH  = "/jobs";
const TITLE = "Remote Jobs & Referrals for Developers";
const DESC  =
  "Remote roles from clients and teams in Aamir Bashir’s network. Apply with your résumé and a short proposal — fitting profiles are referred directly to the hiring team.";

export const metadata: Metadata = pageMetadata(PATH, TITLE, DESC);
// Re-rendered at most every 5 minutes; admin changes revalidate it immediately.
export const revalidate = 300;

const steps = [
  { title: "Pick a role",          text: "Read the full details — scope, requirements, timeline and pay — before you apply." },
  { title: "Send your application", text: "Add your details, upload your résumé and write a short proposal for the role." },
  { title: "Pay the referral fee",  text: "Your application is submitted once the fee is paid. Fitting profiles are referred to the hiring team." },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "CollectionPage", "@id": `${SITE_URL}${PATH}#webpage`, url: `${SITE_URL}${PATH}`, name: TITLE, description: DESC,
      isPartOf: { "@id": `${SITE_URL}/#website` } },
    breadcrumb(PATH, "Jobs"),
  ],
};

export default async function JobsPage() {
  const jobs = await getOpenJobs();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <PageHeader crumb="Jobs" eyebrow="Referral jobs" title="Remote roles I can refer you to">
        <p>
          Roles from clients and teams in my network. Apply with your résumé and a short proposal — if your profile fits,
          I refer you directly to the hiring team.
        </p>
      </PageHeader>

      <main>
        {/* How it works */}
        <section aria-labelledby="how" className="pt-16 sm:pt-20">
          <div className="container-x">
            <h2 id="how" className="sr-only">How applying works</h2>
            <ol className="tray grid gap-2 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className={`flex flex-col rounded-card p-6 sm:p-7 ${i === 2 ? "bg-accent" : "bg-card"}`}>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm ${i === 2 ? "bg-ink text-on-ink" : "bg-surface text-ink"}`}>
                    {i + 1}
                  </span>
                  <h3 className="mt-6 text-[1.25rem] font-medium tracking-[-0.03em] text-ink">{s.title}</h3>
                  <p className={`mt-1.5 text-base leading-relaxed ${i === 2 ? "text-ink/75" : "text-muted"}`}>{s.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-muted">
              The referral fee is shown on every job before you apply. It covers reviewing and referring your application — it doesn’t
              guarantee an interview or a job.
            </p>
          </div>
        </section>

        {/* Openings */}
        <section aria-labelledby="open" className="section !pt-14">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Open roles</p>
                <h2 id="open" className="h2 mt-4">
                  {jobs.length ? `${jobs.length} open role${jobs.length === 1 ? "" : "s"}` : "No open roles right now"}
                </h2>
              </div>
            </div>

            {jobs.length > 0 ? (
              <ul className="tray mt-10 grid gap-2 lg:grid-cols-2">
                {jobs.map(job => <li key={job.id}><JobCard job={job} /></li>)}
              </ul>
            ) : (
              <div className="mt-10 rounded-panel bg-surface px-6 py-14 text-center sm:px-10">
                <span aria-hidden="true" className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-card text-ink">
                  <Icon name="briefcase" size={22} />
                </span>
                <p className="mx-auto mt-5 max-w-md text-lg text-ink">New roles are shared in the free community first.</p>
                <p className="mx-auto mt-2 max-w-md text-base text-muted">Join to hear when the next one opens.</p>
                <div className="mt-7 flex justify-center"><WhatsAppButton location="jobs_empty" /></div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
