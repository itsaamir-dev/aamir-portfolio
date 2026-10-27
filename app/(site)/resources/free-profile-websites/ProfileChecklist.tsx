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

  const count = done.filter(n => sites.some(s => s.name === n)).length;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <p className="text-sm font-medium text-muted" aria-live="polite">
          <strong className="text-ink">{count}</strong> of {sites.length} set up
          <span className="text-muted"> · tick each one as you finish it</span>
        </p>
        <div aria-hidden="true" className="flex flex-1 gap-[3px]">
          {sites.map((s, i) => (
            <span key={s.name} className={`h-2 min-w-[8px] flex-1 rounded-full ${i < count ? "bg-ink" : "bg-surface"}`} />
          ))}
        </div>
      </div>
      <ol className="tray grid gap-2 sm:grid-cols-2">
        {sites.map((site, i) => {
          const checked = done.includes(site.name);
          return (
            <li key={site.name}
                className={`flex flex-col gap-4 rounded-card p-6 transition-colors duration-200 sm:p-7 ${checked ? "bg-accent" : "bg-card"}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">#{i + 1}
                    {recommended.includes(site.name) && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[0.65rem] text-on-ink">Start here</span>}
                  </p>
                  <h3 className="mt-1.5 text-[1.375rem] font-medium tracking-[-0.04em] text-ink">{site.name}</h3>
                </div>
                <label className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full
                                  hover:bg-surface" title={checked ? "Mark as not done" : "Mark as done"}>
                  <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => toggle(site.name)}
                         aria-label={`I've set up my ${site.name} profile`} />
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors
                                    peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink
                                    ${checked ? "border-ink bg-ink text-on-ink" : "border-line-strong bg-card text-transparent"}`}>
                    <Icon name="check" size={15} />
                  </span>
                </label>
              </div>
              <p className={`text-base leading-relaxed ${checked ? "text-ink/75" : "text-muted"}`}>{site.use}</p>
              <a href={site.url} target="_blank" rel="noopener noreferrer"
                 className="group mt-auto inline-flex min-h-[44px] items-center gap-2 self-start font-semibold text-ink">
                Open {site.name}
                <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-on-ink transition-transform duration-200 group-hover:rotate-45">
                  <Icon name="external" size={14} />
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </>
  );
}
