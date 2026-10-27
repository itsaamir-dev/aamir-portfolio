import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BtnArrow from "@/components/BtnArrow";
import { ArrowOverlay } from "@/components/ui/arrow-cta";

// Unmatched URLs render outside app/(site), so this brings its own chrome.
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="pt-[72px] lg:pt-[80px]">
        <div className="panel sky on-dark flex min-h-[70vh] flex-col items-center justify-center px-5 py-20 text-center text-white">
          <p className="eyebrow-light">404</p>
          <h1 className="h1 mt-4">Page not found</h1>
          <p className="lead mt-4 max-w-md text-white/90">That page doesn&apos;t exist or has moved. Try the homepage or the blog.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="btn-primary">Go to homepage <BtnArrow /></Link>
            <Link href="/blog" className="btn-glass">Browse the blog</Link>
          </div>
        </div>
      </main>
      <div className="mt-2"><Footer /></div>
      <ArrowOverlay />
    </>
  );
}
