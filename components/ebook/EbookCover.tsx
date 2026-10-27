import { ebook } from "@/lib/ebook";

/** Typographic cover built in CSS — there's no designed cover asset yet. */
export default function EbookCover({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Cover of ${ebook.title}: ${ebook.subtitle}, by Build With Aamir`}
      className={`relative mx-auto flex aspect-[3/4] w-full max-w-[18rem] -rotate-2 flex-col justify-between overflow-hidden
                  rounded-l-md rounded-r-2xl bg-night p-6 text-white shadow-[0_30px_60px_rgba(19,40,90,0.35)]
                  transition-transform duration-500 hover:rotate-0 ${className}`}
    >
      {/* Spine */}
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/60 to-transparent" />
      <span aria-hidden="true" className="absolute inset-y-0 left-3 w-px bg-white/10" />

      <div className="relative">
        <span className="inline-block rounded-full bg-accent px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink">
          {ebook.discountPercent}% off at launch
        </span>
      </div>

      <div className="relative">
        <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-accent" />
        <p className="mt-4 text-[1.75rem] font-medium leading-[1.02] tracking-[-0.05em]">{ebook.title}</p>
        <p className="mt-3 text-sm leading-snug text-night-muted">{ebook.subtitle}</p>
      </div>

      <p className="relative font-mono text-[0.65rem] uppercase tracking-[0.14em] text-night-muted">Build With Aamir</p>
    </div>
  );
}
