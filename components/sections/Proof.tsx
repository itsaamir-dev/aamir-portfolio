import Reveal from "@/components/RevealOnScroll";
import { proofStats } from "@/lib/site";

export default function Proof() {
  return (
    <section aria-label="Proof" className="border-y border-line bg-bg">
      <Reveal className="container-x py-10 sm:py-12">
        <dl className="stagger grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
          {proofStats.map(({ value, label }) => (
            <div key={label}
                 className="flex flex-col-reverse justify-end rounded-2xl border border-line bg-surface p-5
                            lg:rounded-none lg:border-0 lg:bg-transparent lg:px-8 lg:py-2 lg:first:pl-0">
              <dt className="mt-1 text-[0.95rem] text-muted">{label}</dt>
              <dd className="text-[1.6rem] font-bold leading-none tracking-tight text-ink sm:text-4xl">{value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
