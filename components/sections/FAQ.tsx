import Icon from "@/components/Icon";
import { faqs } from "@/lib/site";

// Native <details>/<summary> — keyboard accessible with no JavaScript.
export default function FAQ() {
  return (
    <section id="faq" className="section bg-paper text-ink-dark">
      <div className="container-x max-w-[860px]">
        <p className="eyebrow-light">FAQ</p>
        <h2 className="h2 mt-4">Questions, answered honestly.</h2>

        <div className="faq mt-10 border-t border-line-light">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group border-b border-line-light">
              <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-6 py-5 text-lg font-semibold transition-colors duration-200 hover:text-accent-dark">
                {q}
                <Icon name="plus" size={22} className="faq-icon shrink-0 text-muted-dark" />
              </summary>
              <p className="faq-answer max-w-prose pb-6 text-base leading-relaxed text-muted-dark sm:text-[1.0625rem]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
