import Link from "next/link";
import type { ReactNode } from "react";

/** Standard dark header for inner pages: breadcrumb, eyebrow, H1, intro, optional actions. */
export default function PageHeader({ crumb, eyebrow, title, children, actions }: {
  crumb: string; eyebrow: string; title: ReactNode; children?: ReactNode; actions?: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-bg pb-12 pt-28 sm:pb-16 sm:pt-36">
      <div className="container-x max-w-[880px]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-accent-light">{crumb}</span>
        </nav>
        <p className="eyebrow mt-8">{eyebrow}</p>
        <h1 className="mt-4 text-[2.1rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">{title}</h1>
        {children && <div className="lead mt-5 space-y-4 text-muted">{children}</div>}
        {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>}
      </div>
    </header>
  );
}
