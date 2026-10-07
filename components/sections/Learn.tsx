import Link from "next/link";
import Reveal from "@/components/RevealOnScroll";
import Icon, { IconName } from "@/components/Icon";

const topics: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "user",
    title: "Profile & Positioning",
    desc: "How to present your skills so the right clients notice you, not just any client.",
  },
  {
    icon: "file",
    title: "Proposals That Get Replies",
    desc: "How I write proposals: short, specific and focused on the client’s problem.",
  },
  {
    icon: "globe",
    title: "International Clients",
    desc: "How to think beyond your local market and work with clients in the US and abroad.",
  },
  {
    icon: "dollar",
    title: "Pricing & Earning in USD",
    desc: "How to price your work, hold your rate in negotiations and get paid in dollars.",
  },
];

export default function Learn() {
  return (
    <section id="learn" className="section bg-bg">
      <div className="container-x">
        <Reveal className="max-w-prose">
          <p className="eyebrow">What You&apos;ll Learn</p>
          <h2 className="h2 mt-4 text-ink">The practical side of freelancing.</h2>
          <p className="lead mt-5 text-muted">
            No theory for its own sake. These are the things that made the difference in my own work on Upwork.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <ul className="stagger mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map(({ icon, title, desc }) => (
              <li key={title}>
                <div className="card group h-full transition-[transform,border-color,box-shadow] duration-200
                                hover:-translate-y-1 hover:border-[#3A414D] hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[rgba(124,92,255,0.12)] text-accent-light
                                   transition-[transform,background-color] duration-200 group-hover:scale-110 group-hover:bg-[rgba(124,92,255,0.22)]">
                    <Icon name={icon} size={20} />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Link href="/blog"
              className="group mt-8 inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent-light transition-colors hover:text-ink">
          Read my articles on freelancing
          <Icon name="arrow" size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
