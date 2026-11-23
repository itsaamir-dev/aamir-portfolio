import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Icon, { type IconName } from "@/components/Icon";
import { Breadcrumb } from "@/components/PageHeader";
import RichText from "@/components/jobs/RichText";
import ApplyForm from "@/components/jobs/ApplyForm";
import TrackView from "@/components/TrackView";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getPublicJob } from "@/lib/jobs-data";
import { activeProviderLabel } from "@/lib/payments";
import { EMPLOYMENT_TYPES, companyLabel, formatDay, formatFee, isAcceptingApplications } from "@/lib/jobs";
import { SITE_URL, ogDefaults, jsonLd } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const job = await getPublicJob(params.slug);
  if (!job) return {};
  const path = `/jobs/${job.slug}`;
  const title = `${job.title} — ${companyLabel(job)}`;
  return {
    title,
    description: job.summary,
    alternates: { canonical: path },
    openGraph: { ...ogDefaults, type: "website", url: path, title, description: job.summary },
    twitter: { card: "summary_large_image", title, description: job.summary },
    // Closed roles stay reachable for applicants but drop out of search.
    robots: job.status === "closed" ? { index: false, follow: true } : undefined,
  };
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line pt-8 first:border-0 first:pt-0">
      <h2 id={id} className="text-[1.5rem] font-medium tracking-[-0.035em] text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function JobPage({ params }: { params: { slug: string } }) {
  const job = await getPublicJob(params.slug);
  if (!job) notFound();

  const open = isAcceptingApplications(job);
  const fee = formatFee(job.feePaise);
  const facts: { icon: IconName; label: string; value: string }[] = [
    { icon: "pin",       label: "Location",   value: job.location },
    { icon: "briefcase", label: "Type",       value: EMPLOYMENT_TYPES[job.employmentType] },
    ...(job.experienceLevel ? [{ icon: "user" as IconName, label: "Experience", value: job.experienceLevel }] : []),
    ...(job.compensation    ? [{ icon: "dollar" as IconName, label: "Pay",      value: job.compensation }] : []),
  ];
  const dates = [
    job.publishedAt && { label: "Posted",   value: formatDay(job.publishedAt.slice(0, 10)) },
    job.startDate   && { label: "Starts",   value: formatDay(job.startDate) },
    { label: "Apply by", value: job.applyBy ? formatDay(job.applyBy) : "Open until filled" },
  ].filter(Boolean) as { label: string; value: string }[];

  const url = `${SITE_URL}/jobs/${job.slug}`;
  // No JobPosting markup: Google Jobs doesn't allow listings that charge applicants.
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: job.title, description: job.summary, isPartOf: { "@id": `${SITE_URL}/#website` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Jobs", item: `${SITE_URL}/jobs` },
        { "@type": "ListItem", position: 3, name: job.title, item: url },
      ] },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <TrackView event="job_view" params={{ job: job.slug }}>
        <header className="pt-[72px] lg:pt-[80px]">
          <div className="panel bg-surface py-12 sm:py-16">
            <div className="container-x hero-stagger">
              <Breadcrumb items={[{ href: "/jobs", label: "Jobs" }, { label: job.title }]} />
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs uppercase tracking-[0.1em]
                                  ${open ? "bg-accent text-ink" : "bg-card text-muted"}`}>
                  <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${open ? "bg-ink" : "bg-muted"}`} />
                  {open ? "Accepting applications" : "Applications closed"}
                </span>
                <span className="text-sm text-muted">{companyLabel(job)}</span>
              </div>
              <h1 className="h1 mt-4 max-w-[22ch] text-ink">{job.title}</h1>
              <p className="lead mt-5 max-w-[42rem] text-muted">{job.summary}</p>

              <ul className="mt-8 flex flex-wrap gap-2">
                {facts.map(f => (
                  <li key={f.label} className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-2 text-sm text-ink">
                    <Icon name={f.icon} size={16} className="text-muted" />
                    <span className="sr-only">{f.label}: </span>{f.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>
      </TrackView>

      <main className="container-x grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
        <div className="min-w-0 space-y-10">
          <article className="space-y-8">
            <Section id="about" title="About the role"><RichText text={job.description} /></Section>
            {job.responsibilities && <Section id="do" title="What you’ll do"><RichText text={job.responsibilities} /></Section>}
            {job.requirements && <Section id="need" title="What they’re looking for"><RichText text={job.requirements} /></Section>}
            {job.skills.length > 0 && (
              <Section id="skills" title="Skills">
                <ul className="flex flex-wrap gap-2">
                  {job.skills.map(s => <li key={s} className="rounded-full bg-surface px-3 py-1.5 text-sm text-ink">{s}</li>)}
                </ul>
              </Section>
            )}
            <Section id="timeline" title="Timeline">
              {job.timeline && <RichText text={job.timeline} />}
              <dl className={`grid grid-cols-2 gap-2 sm:grid-cols-3 ${job.timeline ? "mt-6" : ""}`}>
                {dates.map(d => (
                  <div key={d.label} className="rounded-2xl bg-surface p-4">
                    <dt className="text-sm text-muted">{d.label}</dt>
                    <dd className="mt-1 font-medium text-ink">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          </article>

          {/* Apply */}
          <section id="apply" aria-labelledby="apply-h" className="scroll-mt-28">
            <h2 id="apply-h" className="h2 text-ink">{open ? "Apply for this role" : "Applications are closed"}</h2>
            {open ? (
              <>
                <p className="lead mt-3 text-muted">Takes about 5 minutes. Your application is submitted after the {fee} referral fee is paid.</p>
                <div className="mt-8"><ApplyForm jobSlug={job.slug} jobTitle={job.title} feePaise={job.feePaise} gateway={activeProviderLabel() ?? undefined} /></div>
              </>
            ) : (
              <div className="mt-6 rounded-panel bg-surface p-6 sm:p-8">
                <p className="text-base text-muted">This role isn’t accepting applications anymore. New roles are shared in the free community first.</p>
                <WhatsAppButton location={`job_closed_${job.slug}`} className="mt-5" />
              </div>
            )}
          </section>
        </div>

        {/* Summary + apply */}
        <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Apply summary">
          <div className="tray">
            <div className="tray-card">
              <p className="text-sm text-muted">Referral fee</p>
              <p className="mt-1 text-[2.25rem] font-medium leading-none tracking-[-0.05em] text-ink">{fee}</p>
              <ul className="mt-5 space-y-2.5 text-sm text-ink">
                {["Your application reviewed against the role", "Fitting profiles referred directly to the hiring team", "Status updates by email or WhatsApp"].map(t => (
                  <li key={t} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-ink"><Icon name="check" size={12} /></span>
                    {t}
                  </li>
                ))}
              </ul>
              {open ? (
                <a href="#apply" className="btn-dark mt-6 w-full">Apply now <span aria-hidden="true" className="btn-arrow bg-accent text-ink"><Icon name="arrow" size={14} /></span></a>
              ) : (
                <p className="mt-6 rounded-xl bg-surface px-4 py-3 text-sm text-muted">Applications are closed.</p>
              )}
              <p className="mt-4 text-xs leading-relaxed text-muted">The fee doesn’t guarantee an interview or a job. Paid securely via {activeProviderLabel() ?? "our payment partner"}.</p>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </>
  );
}
