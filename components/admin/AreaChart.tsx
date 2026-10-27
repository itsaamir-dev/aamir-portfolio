"use client";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

// Measure before paint in the browser; plain effect on the server (no warning).
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Point = { date: string; count: number };

const PAD = { t: 16, r: 16, b: 28, l: 36 };
const fmtDay = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function niceMax(v: number) {
  if (v <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / pow) * pow;
}

/** Single-series area chart with crosshair + tooltip (pointer and keyboard). */
export default function AreaChart({ data, label }: { data: Point[]; label: string }) {
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  // Draw at the real pixel width so labels stay 11px on every screen.
  const [W, setW] = useState(960);
  const H = Math.round(Math.min(260, Math.max(180, W * 0.3)));

  useIsoLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    setW(Math.max(280, Math.round(el.getBoundingClientRect().width)));
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { line, area, xs, ys, max, ticks } = useMemo(() => {
    const max = niceMax(Math.max(...data.map(d => d.count), 0));
    const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
    const xs = data.map((_, i) => PAD.l + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw));
    const ys = data.map(d => PAD.t + ih - (d.count / max) * ih);
    const line = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join("");
    const area = `${line}L${xs[xs.length - 1].toFixed(1)},${PAD.t + ih}L${xs[0].toFixed(1)},${PAD.t + ih}Z`;
    const ticks = [0, max / 2, max];
    return { line, area, xs, ys, max, ticks };
  }, [data, W, H]);

  const total = data.reduce((s, d) => s + d.count, 0);
  const peak  = data.reduce((p, d) => (d.count > p.count ? d : p), data[0]);
  const xLabelIdx = [0, Math.floor((data.length - 1) / 2), data.length - 1];

  const pick = (e: PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    xs.forEach((px, i) => { if (Math.abs(px - x) < Math.abs(xs[best] - x)) best = i; });
    setActive(best);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { setActive(a => Math.min(data.length - 1, (a ?? -1) + 1)); e.preventDefault(); }
    if (e.key === "ArrowLeft")  { setActive(a => Math.max(0, (a ?? data.length) - 1)); e.preventDefault(); }
    if (e.key === "Escape") setActive(null);
  };

  const a = active != null ? data[active] : null;
  const tipLeft = active != null ? `clamp(3.5rem, ${(xs[active] / W) * 100}%, calc(100% - 3.5rem))` : "0";

  return (
    <figure ref={boxRef} className="relative m-0">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width={W} height={H}
        className="block h-auto w-full touch-none select-none outline-none"
        role="img"
        tabIndex={0}
        aria-label={`${label}: ${total} sign-ups over ${data.length} days, peak ${peak.count} on ${fmtDay(peak.date)}. Use left and right arrow keys to read each day.`}
        onPointerMove={pick}
        onPointerDown={pick}
        onPointerLeave={() => setActive(null)}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--md-primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--md-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Recessive grid + y labels */}
        {ticks.map(t => {
          const y = PAD.t + (H - PAD.t - PAD.b) * (1 - t / max);
          return (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="var(--md-outline-variant)" strokeWidth="1" strokeDasharray={t ? "2 4" : undefined} />
              <text x={PAD.l - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--md-on-surface-variant)">{t}</text>
            </g>
          );
        })}
        {xLabelIdx.map((i, k) => (
          <text key={i} x={xs[i]} y={H - 8} fontSize="11" fill="var(--md-on-surface-variant)"
                textAnchor={k === 0 ? "start" : k === 2 ? "end" : "middle"}>{fmtDay(data[i].date)}</text>
        ))}

        <path d={area} fill={`url(#${id}-fill)`} data-anim="fade" />
        <path d={line} fill="none" stroke="var(--md-primary)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" data-draw />

        {a && active != null && (
          <g pointerEvents="none">
            <line x1={xs[active]} x2={xs[active]} y1={PAD.t} y2={H - PAD.b} stroke="var(--md-outline)" strokeWidth="1" />
            <circle cx={xs[active]} cy={ys[active]} r="5" fill="var(--md-primary)" stroke="var(--md-surface-container)" strokeWidth="2" />
          </g>
        )}
      </svg>

      {a && (
        <div role="status" aria-live="polite"
             className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg bg-md-inverse-surface px-3 py-2 text-xs text-md-inverse-on-surface shadow-lg"
             style={{ left: tipLeft }}>
          <span className="block font-medium">{fmtDay(a.date)}</span>
          <span>{a.count} sign-up{a.count === 1 ? "" : "s"}</span>
        </div>
      )}
    </figure>
  );
}
