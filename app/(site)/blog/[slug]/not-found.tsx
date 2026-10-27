import Link from "next/link";
import BtnArrow from "@/components/BtnArrow";

export default function NotFound() {
  return (
    <div className="pt-[72px] lg:pt-[80px]">
      <div className="panel flex min-h-[70vh] flex-col items-center justify-center bg-surface px-5 py-20 text-center">
        <p className="eyebrow">404</p>
        <h1 className="h1 mt-4 text-ink">Post Not Found</h1>
        <p className="lead mt-4 text-muted">That article doesn&apos;t exist or has been moved.</p>
        <Link href="/blog" className="btn-dark mt-8">Back to Blog <BtnArrow tone="lime" /></Link>
      </div>
    </div>
  );
}
