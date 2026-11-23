import Link from "next/link";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { LEGAL_UPDATED, legalPages } from "@/lib/legal";

export type LegalSection = { id: string; title: string; body: ReactNode };

/**
 * Shared layout for the policy pages (terms, privacy, refunds, contact):
 * header, "last updated", a contents list and plain readable sections.
 */
export default function LegalPage({ path, crumb, title, intro, sections }: {
  path: string; crumb: string; title: string; intro: ReactNode; sections: LegalSection[];
}) {
  const others = legalPages.filter(p => p.href !== path);
  return (
    <>
      <PageHeader crumb={crumb} eyebrow="Policies" title={title}>
        {intro}
        <p className="text-base">Last updated: {LEGAL_UPDATED}</p>
      </PageHeader>

      <main>
        <section className="section">
          <div className="container-x grid max-w-[960px] gap-12 lg:grid-cols-[14rem_minmax(0,1fr)]">
            {sections.length > 2 && (
              <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
                <p className="eyebrow">On this page</p>
                <ol className="mt-4 space-y-2 text-sm">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="text-muted transition-colors hover:text-ink">{i + 1}. {s.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className={`legal max-w-prose space-y-10 ${sections.length > 2 ? "" : "lg:col-span-2"}`}>
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28">
                  <h2 id={`${s.id}-h`} className="text-[1.375rem] font-medium tracking-[-0.03em] text-ink">
                    {sections.length > 2 ? `${i + 1}. ` : ""}{s.title}
                  </h2>
                  <div className="mt-3 space-y-3 text-[1.0625rem] leading-relaxed text-muted">{s.body}</div>
                </section>
              ))}

              <nav aria-label="Other policies" className="rounded-2xl bg-surface p-5">
                <p className="text-sm font-semibold text-ink">Other policies</p>
                <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                  {others.map(p => (
                    <li key={p.href}><Link href={p.href} className="text-[0.95rem] text-ink underline underline-offset-4">{p.label}</Link></li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
