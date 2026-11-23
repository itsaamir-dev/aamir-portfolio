"use client";
import { useMemo, useRef, useState, type PointerEvent } from "react";

type Shape = { d: string; name: string; views: number };
type Point = { x: number; y: number; label: string; views: number; visitors: number };
type Tip = { x: number; y: number; title: string; lines: string[] } | null;

const n = (v: number) => v.toLocaleString("en-US");

/**
 * World map: countries shaded by views (log scale, so one busy country doesn't
 * wash out the rest), cities as glowing dots sized by views. Hover or focus a
 * dot or country for numbers. The busiest cities pulse (not with reduced motion).
 */
export default function WorldMap({ shapes, points, width, height, label }: {
  shapes: Shape[]; points: Point[]; width: number; height: number; label: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip>(null);
  const [hover, setHover] = useState<string | null>(null);

  const maxCountry = Math.max(1, ...shapes.map(s => s.views));
  const maxPoint = Math.max(1, ...points.map(p => p.views));
  const shade = (v: number) => (v ? Math.round((0.22 + 0.73 * (Math.log1p(v) / Math.log1p(maxCountry))) * 1000) / 1000 : 0);
  const radius = (v: number) => 2.6 + 9.4 * Math.sqrt(v / maxPoint);
  // Draw small dots last so big ones don't cover them.
  const sorted = useMemo(() => [...points].sort((a, b) => b.views - a.views), [points]);
  const top = new Set(sorted.slice(0, 5).map(p => p.label));

  const place = (clientX: number, clientY: number) => {
    const r = boxRef.current!.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };
  const showAt = (e: PointerEvent, title: string, lines: string[]) => setTip({ ...place(e.clientX, e.clientY), title, lines });
  const showFor = (el: Element, title: string, lines: string[]) => {
    const b = el.getBoundingClientRect();
    setTip({ ...place(b.left + b.width / 2, b.top), title, lines });
  };

  return (
    <div ref={boxRef} className="relative" onPointerLeave={() => { setTip(null); setHover(null); }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="img" aria-label={label}>
        <defs>
          <radialGradient id="wm-glow">
            <stop offset="0%" stopColor="var(--md-series-2)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--md-series-2)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g>
          {shapes.map(s => (
            <path key={s.name} d={s.d}
                  className="transition-[fill-opacity] duration-150"
                  fill={s.views ? "var(--md-series-1)" : "var(--md-surface-container-highest)"}
                  fillOpacity={s.views ? (hover === s.name ? 1 : shade(s.views)) : 1}
                  stroke="var(--md-surface-container-low)" strokeWidth={0.6}
                  onPointerMove={e => { setHover(s.name); showAt(e, s.name, [s.views ? `${n(s.views)} view${s.views === 1 ? "" : "s"}` : "No visits"]); }}
                  onPointerLeave={() => setHover(null)} />
          ))}
        </g>

        <g>
          {[...sorted].reverse().map(p => {
            const r = radius(p.views);
            const pulse = top.has(p.label);
            const lines = [`${n(p.views)} view${p.views === 1 ? "" : "s"}`, `${n(p.visitors)} visitor${p.visitors === 1 ? "" : "s"}`];
            return (
              <g key={p.label} transform={`translate(${p.x} ${p.y})`}
                 tabIndex={pulse || sorted.indexOf(p) < 20 ? 0 : -1} role="img" aria-label={`${p.label}: ${lines.join(", ")}`}
                 className="cursor-default outline-none [&:focus-visible>circle:last-child]:stroke-md-on-surface [&:focus-visible>circle:last-child]:stroke-2"
                 onPointerMove={e => { e.stopPropagation(); showAt(e, p.label, lines); }}
                 onFocus={e => showFor(e.currentTarget, p.label, lines)} onBlur={() => setTip(null)}>
                <circle r={r * 2.6} fill="url(#wm-glow)" />
                {pulse && <circle r={r} fill="none" stroke="var(--md-series-2)" strokeWidth={1.5} className="wm-pulse" />}
                <circle r={r} fill="var(--md-series-2)" fillOpacity={0.92} stroke="var(--md-surface-container-low)" strokeWidth={1.2} />
              </g>
            );
          })}
        </g>
      </svg>

      {tip && (
        <div role="tooltip"
             className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-xl bg-md-inverse-surface px-3 py-2 text-xs text-md-inverse-on-surface shadow-lg"
             style={{ left: tip.x, top: tip.y }}>
          <span className="block text-sm font-medium">{tip.title}</span>
          {tip.lines.map(l => <span key={l} className="block opacity-90">{l}</span>)}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-md-on-surface-variant">
        <span className="flex items-center gap-2">
          Fewer
          <span aria-hidden="true" className="h-2.5 w-24 rounded-full"
                style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--md-series-1) 22%, transparent), var(--md-series-1))" }} />
          More views by country
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: "var(--md-series-2)", boxShadow: "0 0 0 4px color-mix(in srgb, var(--md-series-2) 25%, transparent)" }} />
          City (size = views)
        </span>
      </div>

      <style>{`
        .wm-pulse { transform-box: fill-box; transform-origin: center; animation: wm-pulse 2.4s ease-out infinite; }
        @keyframes wm-pulse { from { transform: scale(1); opacity: .9 } to { transform: scale(3.2); opacity: 0 } }
        @media (prefers-reduced-motion: reduce) { .wm-pulse { animation: none; opacity: 0 } }
      `}</style>
    </div>
  );
}
