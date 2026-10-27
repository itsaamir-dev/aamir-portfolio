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
      className={`group flex items-center justify-between gap-4 rounded-panel bg-accent p-5 text-ink transition-colors
                  hover:bg-accent-strong sm:p-6 ${className}`}
    >
      <span>
        <span className="font-mono text-xs uppercase tracking-[0.12em]">Coming soon · {ebook.discountPercent}% off at launch</span>
        <span className="mt-1.5 block text-xl font-medium tracking-[-0.04em]">{ebook.title}</span>
        <span className="mt-1 block text-sm text-ink/75">Join the free waiting list for launch updates and the planned early-bird offer.</span>
      </span>
      <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-on-ink transition-transform group-hover:rotate-45">
        <Icon name="external" size={18} />
      </span>
    </TrackedLink>
  );
}
