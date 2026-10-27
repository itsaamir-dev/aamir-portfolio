import { ebook } from "@/lib/ebook";

/** Typographic cover built in CSS — there's no designed cover asset yet. */
export default function EbookCover({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Cover of ${ebook.title}: ${ebook.subtitle}, by Build With Aamir`}
      className={`relative mx-auto flex aspect-[3/4] w-full max-w-[18rem] flex-col justify-between overflow-hidden
                  rounded-r-xl rounded-l-sm border border-line bg-surface p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${className}`}
    >
      {/* Spine */}
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/50 to-transparent" />
      <span aria-hidden="true" className="absolute inset-y-0 left-3 w-px bg-white/5" />

      <div className="relative">
        <span className="inline-block rounded-md bg-highlight px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#080A09]">
          {ebook.discountPercent}% off at launch
        </span>
      </div>

      <div className="relative">
        <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-accent" />
        <p className="mt-4 text-[1.65rem] font-bold leading-[1.05] tracking-tight text-ink">{ebook.title}</p>
        <p className="mt-3 text-sm leading-snug text-muted">{ebook.subtitle}</p>
      </div>

      <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-muted">Build With Aamir</p>
    </div>
  );
}
