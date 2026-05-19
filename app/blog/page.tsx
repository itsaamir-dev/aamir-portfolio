import Reveal from "@/components/RevealOnScroll";
import Footer from "@/components/Footer";
import { blogPosts } from "@/lib/data";
import BlogFilters from "./BlogFilters";

export default function BlogPage() {
  return (
    <>
      <div className="relative overflow-hidden pt-36 pb-16 px-16"
           style={{ background: "linear-gradient(160deg, #0D1B2A 0%, #0a1520 100%)" }}>
        <span className="absolute right-12 bottom-[-1rem] font-display font-black text-[12rem] leading-none
                          text-[rgba(201,168,76,0.04)] pointer-events-none select-none tracking-tight">
          BLOG
        </span>
        <div className="max-w-[1100px] mx-auto relative z-10">
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-[0.67rem] tracking-[0.2em] uppercase text-gold mb-3
                           before:content-[''] before:block before:w-8 before:h-px before:bg-gold">
              Writing &amp; Insights
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-[clamp(2.8rem,6vw,5rem)] font-black text-off-white leading-none mb-4">
              The <span className="text-gold">Blog</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-[1rem] text-mid-gray max-w-xl leading-[1.8] font-light">
              Deep dives into Android development, full-stack architecture, freelancing, and the craft of building software that lasts.
            </p>
          </Reveal>
        </div>
      </div>

      <main className="max-w-[1100px] mx-auto px-16 py-16 relative z-10">
        <BlogFilters posts={blogPosts} />

        <Reveal>
          <div className="relative overflow-hidden mt-16 px-12 py-10 border border-[rgba(201,168,76,0.2)]
                          flex items-center justify-between gap-8 flex-wrap"
               style={{ background: "linear-gradient(135deg, rgba(27,45,66,0.7), rgba(13,27,42,0.9))" }}>
            <div className="absolute top-0 left-0 right-0 h-0.5"
                 style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
            <div>
              <h3 className="font-display text-[1.4rem] text-off-white mb-1">Get new articles in your inbox</h3>
              <p className="text-[0.85rem] text-mid-gray">No spam. One email when something worth reading is published.</p>
            </div>
            <form className="flex flex-1 max-w-md">
              <input type="email" placeholder="your@email.com"
                className="flex-1 bg-[rgba(13,27,42,0.8)] border border-[rgba(201,168,76,0.2)] border-r-0
                           text-cream px-5 py-3 font-body text-[0.88rem] outline-none focus:border-[rgba(201,168,76,0.5)]
                           placeholder:text-mid-gray/50" />
              <button type="submit"
                className="px-6 py-3 bg-gold text-navy font-mono text-[0.63rem] tracking-[0.1em] uppercase font-semibold
                           border border-gold transition-colors duration-200 hover:bg-gold2 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </Reveal>
      </main>

      <Footer />
    </>
  );
}
