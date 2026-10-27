import Image from "next/image";
import Link from "next/link";

/** Brand mark (logo icon) plus the wordmark. */
export default function Logo({ onClick, dark = false }: { onClick?: () => void; dark?: boolean }) {
  return (
    <Link href="/" onClick={onClick} aria-label="Build With Aamir — home"
          className={`group inline-flex shrink-0 items-center gap-2.5 ${dark ? "text-white" : "text-ink"}`}>
      <Image
        src="/brand/logo-icon.png"
        alt=""
        width={36}
        height={36}
        priority
        className={`h-9 w-9 rounded-[10px] transition-transform duration-200 group-hover:-rotate-6
                    ${dark ? "ring-1 ring-white/15" : ""}`}
      />
      <span className="whitespace-nowrap font-display text-[1.125rem] font-semibold tracking-[-0.03em]">Build With Aamir</span>
    </Link>
  );
}
