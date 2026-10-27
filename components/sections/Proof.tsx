import Reveal from "@/components/RevealOnScroll";
import { proofStats, PROOF_NOTE } from "@/lib/site";

// Bento tones, in stat order: headline figure in ink, one lime, the rest grey.
const tones = [
  "bg-night text-white sm:col-span-2 lg:row-span-2",
  "bg-surface text-ink",
  "bg-accent text-ink",
  "bg-surface text-ink sm:col-span-2",
];

export default function Proof() {
  return (
    <section aria-labelledby="proof-heading" className="pb-4 pt-16 sm:pt-20 lg:pt-24">
      <Reveal className="container-x">
        <div className="text-center">
          <p className="eyebrow">Results so far</p>
          <h2 id="proof-heading" className="h2 mx-auto mt-4 max-w-[20ch]">My freelancing results so far</h2>
        </div>

        <dl className="stagger mt-10 grid gap-2 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {proofStats.map(({ value, label }, i) => (
            <div key={label}
                 className={`flex min-h-[150px] flex-col-reverse justify-between gap-6 rounded-panel p-6 sm:p-7 ${tones[i] ?? tones[1]}
                             ${i === 0 ? "lg:min-h-[316px]" : ""}`}>
              <dt className={`text-[0.95rem] ${i === 0 ? "text-night-muted" : "text-ink/70"}`}>{label}</dt>
              <dd className={`font-medium leading-none tracking-[-0.06em]
                              ${i === 0 ? "text-[4rem] text-accent sm:text-[5rem] lg:text-[6rem]" : "text-[2.5rem] sm:text-[3rem]"}`}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-center text-sm text-muted">{PROOF_NOTE}</p>
      </Reveal>
    </section>
  );
}
