import Reveal from "@/components/RevealOnScroll";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { blogPosts } from "@/lib/data";
import { PROMISE } from "@/lib/site";
import BlogFilters from "./BlogFilters";

export default function BlogPage() {
  return (
    <>
      <header className="border-b border-line bg-bg pb-12 pt-32 sm:pb-16 sm:pt-36">
        <div className="container-x">
          <p className="eyebrow">Writing &amp; Insights</p>
          <h1 className="mt-4 text-[2.25rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            The Blog
          </h1>
          <p className="lead mt-5 max-w-2xl text-muted">
            Deep dives into Android development, full-stack architecture, freelancing, and the craft of building software that lasts.
          </p>
        </div>
      </header>

      <main className="container-x section">
        <BlogFilters posts={blogPosts} />

        <Reveal>
          <div className="relative mt-16 overflow-hidden rounded-2xl border border-line bg-surface px-6 py-10 sm:px-10
                          flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Learning to freelance?</h2>
              <p className="mt-2 text-base text-muted">{PROMISE} Join the free community.</p>
            </div>
            <WhatsAppButton className="shrink-0" />
          </div>
        </Reveal>
      </main>

      <Footer />
    </>
  );
}
