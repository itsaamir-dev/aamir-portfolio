import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-screen flex-col items-center justify-center text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl">Post Not Found</h1>
      <p className="lead mt-4 text-muted">That article doesn&apos;t exist or has been moved.</p>
      <Link href="/blog" className="btn-primary mt-8">Back to Blog</Link>
    </div>
  );
}
