"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Empty state with a small Lottie loop (lazy-loaded, ~light player). Static frame under reduced motion. */
export default function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyed = false;
    let anim: { destroy: () => void } | null = null;
    (async () => {
      const [{ default: lottie }, data] = await Promise.all([
        import("lottie-web/build/player/lottie_light"),
        import("./lottie/empty-waitlist.json"),
      ]);
      if (destroyed || !box.current) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const a = lottie.loadAnimation({
        container: box.current, renderer: "svg", loop: !reduce, autoplay: !reduce,
        animationData: data.default ?? data,
      });
      if (reduce) a.goToAndStop(30, true);
      anim = a;
    })();
    return () => { destroyed = true; anim?.destroy(); };
  }, []);

  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div ref={box} aria-hidden="true" className="h-[100px] w-[160px]" />
      <h2 className="mt-4 text-lg font-medium text-md-on-surface">{title}</h2>
      {children && <div className="mt-2 max-w-md text-sm leading-relaxed text-md-on-surface-variant">{children}</div>}
    </div>
  );
}
