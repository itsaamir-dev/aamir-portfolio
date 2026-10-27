import Icon from "@/components/Icon";
import { faqs } from "@/lib/site";

// Native <details>/<summary> — keyboard accessible with no JavaScript.
export default function FAQ({ items = faqs, title = "Questions, Answered Honestly" }: {
  items?: { q: string; a: string }[];
  title?: string;
}) {
  return (
    <section id="faq" className="section">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">FAQ</p>
          <h2 className="h2 mt-4">{title}</h2>
        </div>

        <div className="faq space-y-2">
          {items.map(({ q, a }) => (
            <details key={q} className="group rounded-card bg-surface transition-colors open:bg-surface-2">
              <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-6 rounded-card px-5 py-4 text-lg font-medium tracking-[-0.03em] sm:px-6">
                {q}
                <span className="faq-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card text-ink">
                  <Icon name="plus" size={18} />
                </span>
              </summary>
              <p className="faq-answer max-w-prose px-5 pb-6 text-base leading-relaxed text-muted sm:px-6 sm:text-[1.0625rem]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
