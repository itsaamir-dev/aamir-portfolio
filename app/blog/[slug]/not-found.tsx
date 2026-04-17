import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8 relative z-10">
      <p className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-gold mb-4">404</p>
      <h1 className="font-display text-[3rem] font-black text-off-white mb-4">Post Not Found</h1>
      <p className="text-mid-gray mb-8 font-light">That article doesn&apos;t exist or has been moved.</p>
      <Link href="/blog"
        className="px-8 py-3 bg-gold text-navy font-mono text-[0.7rem] tracking-[0.12em] uppercase font-semibold
                   transition-colors duration-200 hover:bg-gold2">
        Back to Blog
      </Link>
    </div>
  );
}
