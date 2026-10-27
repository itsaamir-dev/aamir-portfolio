"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { animate, stagger, svg, utils } from "animejs";

/**
 * One orchestrated load-in for a dashboard view (anime.js):
 *   [data-anim]  fade + rise, staggered
 *   [data-count] numbers count up to their final value
 *   [data-draw]  SVG lines draw in
 *   [data-bar]   bars grow from their baseline (scaleX)
 * Skipped entirely under prefers-reduced-motion — the content is already final.
 */
export default function Motion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !document.getElementById("admin-root")?.classList.contains("js-motion")) return;
    const q = <T extends Element>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const anims: { pause: () => unknown }[] = [];

    const fades = q<HTMLElement>("[data-anim]");
    if (fades.length) {
      anims.push(animate(fades, { opacity: [0, 1], translateY: [8, 0], duration: 420, delay: stagger(45), ease: "out(3)" }));
    }

    q<HTMLElement>("[data-count]").forEach((el, i) => {
      const end = Number(el.dataset.count);
      if (!Number.isFinite(end) || end === 0) return;
      const suffix = el.dataset.suffix ?? "";
      const obj = { v: 0 };
      el.textContent = `0${suffix}`;
      anims.push(animate(obj, {
        v: end, duration: 900, delay: 120 + i * 60, ease: "out(4)", modifier: utils.round(0),
        onUpdate: () => { el.textContent = `${obj.v.toLocaleString("en-US")}${suffix}`; },
        onComplete: () => { el.textContent = `${end.toLocaleString("en-US")}${suffix}`; },
      }));
    });

    const lines = q<SVGPathElement>("[data-draw]");
    if (lines.length) {
      anims.push(animate(svg.createDrawable(lines), {
        draw: ["0 0", "0 1"], duration: 900, delay: 200, ease: "inOut(2)",
        // The chart can redraw at a new width later; drop the dash styles once done.
        onComplete: () => lines.forEach(l => { l.style.strokeDasharray = ""; l.style.strokeDashoffset = ""; l.removeAttribute("pathLength"); }),
      }));
    }

    const bars = q<HTMLElement>("[data-bar]");
    if (bars.length) anims.push(animate(bars, { scaleX: [0, 1], duration: 600, delay: stagger(50, { start: 250 }), ease: "out(3)" }));

    return () => anims.forEach(a => a.pause());
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}
