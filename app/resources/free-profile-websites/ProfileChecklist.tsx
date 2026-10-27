"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import type { ProfileSite } from "@/lib/resources";

const STORAGE_KEY = "bwa:profile-sites-done";

function load(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}

/** Top platforms as cards; visitors can tick off the ones they've set up (saved in their browser). */
export default function ProfileChecklist({ sites, recommended }: { sites: ProfileSite[]; recommended: string[] }) {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => setDone(load()), []);

  const toggle = (name: string) => {
    const next = done.includes(name) ? done.filter(n => n !== name) : [...done, name];
    setDone(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* private mode */ }
  };

  return (
    <>
      <p className="mb-5 text-sm font-medium text-muted" aria-live="polite">
        <strong className="text-ink">{done.filter(n => sites.some(s => s.name === n)).length}</strong> of {sites.length} set up
        <span className="text-muted"> · tick each one as you finish it</span>
      </p>
      <ol className="grid gap-4 sm:grid-cols-2">
        {sites.map((site, i) => {
          const checked = done.includes(site.name);
          return (
            <li key={site.name}
                className={`card flex flex-col gap-4 transition-colors duration-200 ${checked ? "border-[rgba(37,211,102,0.45)]" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted">#{i + 1}
                    {recommended.includes(site.name) && <span className="ml-2 rounded-md bg-[rgba(57,245,106,0.12)] px-2 py-0.5 text-xs font-semibold text-accent-light">Start here</span>}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-ink">{site.name}</h3>
                </div>
                <label className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line
                                  hover:border-[#3A4047]" title={checked ? "Mark as not done" : "Mark as done"}>
                  <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => toggle(site.name)}
                         aria-label={`I've set up my ${site.name} profile`} />
                  <span className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors
                                    peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent-light
                                    ${checked ? "border-wa bg-wa text-wa-ink" : "border-[#3A4047] text-transparent"}`}>
                    <Icon name="check" size={16} />
                  </span>
                </label>
              </div>
              <p className="text-base leading-relaxed text-muted">{site.use}</p>
              <a href={site.url} target="_blank" rel="noopener noreferrer"
                 className="group mt-auto inline-flex min-h-[44px] items-center gap-2 self-start font-semibold text-accent-light hover:text-ink">
                Open {site.name}
                <Icon name="external" size={16} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </li>
          );
        })}
      </ol>
    </>
  );
}
