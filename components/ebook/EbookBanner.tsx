import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { ebook } from "@/lib/ebook";

/** Compact, contextual pointer to the e-book waiting list (blog, learn). */
export default function EbookBanner({ location, className = "" }: { location: string; className?: string }) {
  return (
    <TrackedLink
      href="/ebook"
      event="ebook_waitlist_cta_click"
      params={{ location }}
      className={`group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-[#3A4047] sm:p-6 ${className}`}
    >
      <span>
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-highlight">Coming soon · {ebook.discountPercent}% off at launch</span>
        <span className="mt-1 block text-lg font-semibold text-ink">{ebook.title}</span>
        <span className="mt-1 block text-sm text-muted">Join the free waiting list for launch updates and the planned early-bird offer.</span>
      </span>
      <Icon name="arrow" size={20} className="shrink-0 text-accent-light transition-transform group-hover:translate-x-1" />
    </TrackedLink>
  );
}
