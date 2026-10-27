import Link from "next/link";
import type { ReactNode } from "react";

export function Breadcrumb({ items, className = "" }: { items: { href?: string; label: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-2 text-sm text-muted ${className}`}>
      <Link href="/" className="rounded-full transition-colors hover:text-ink">Home</Link>
      {items.map(({ href, label }, i) => {
        const last = i === items.length - 1;
        return (
          <span key={label} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-[#B5B5B5]">/</span>
            {href && !last
              ? <Link href={href} className="transition-colors hover:text-ink">{label}</Link>
              : <span aria-current={last ? "page" : undefined} className="font-medium text-ink">{label}</span>}
          </span>
        );
      })}
    </nav>
  );
}

/**
 * Header for inner pages: a grey inset panel with breadcrumb, label, H1,
 * intro and optional actions. Pass `visual` to add a sky panel beside it.
 */
export default function PageHeader({ crumb, eyebrow, title, children, actions, visual }: {
  crumb: string; eyebrow: string; title: ReactNode; children?: ReactNode; actions?: ReactNode; visual?: ReactNode;
}) {
  const body = (
    <div className="hero-stagger">
      <Breadcrumb items={[{ label: crumb }]} />
      <p className="eyebrow mt-8 sm:mt-10">{eyebrow}</p>
      <h1 className="h1 mt-4 max-w-[18ch] text-ink">{title}</h1>
      {children && <div className="lead mt-6 max-w-[40rem] space-y-4 text-muted">{children}</div>}
      {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>}
    </div>
  );

  return (
    <header className="pt-[72px] lg:pt-[80px]">
      {visual ? (
        <div className="mx-2 grid gap-2 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex items-center rounded-panel bg-surface px-5 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            {body}
          </div>
          <div className="sky relative min-h-[320px] overflow-hidden rounded-panel sm:min-h-[420px]">{visual}</div>
        </div>
      ) : (
        <div className="panel bg-surface py-12 sm:py-16 lg:py-20">
          <div className="container-x max-w-[960px]">{body}</div>
        </div>
      )}
    </header>
  );
}
