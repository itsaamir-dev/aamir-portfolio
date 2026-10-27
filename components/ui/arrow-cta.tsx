"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Sections the arrow works in: mark them with data-arrow-zone.
const ZONES = "[data-arrow-zone]";
// Pill buttons from globals.css, plus anything opted in with data-arrow-target.
const TARGETS = ".btn, .btn-primary, .btn-wa, .btn-dark, .btn-ghost, .btn-glass, [data-arrow-target]";
// The arrow steps aside on the buttons themselves and while typing in a field.
const HIDE_OVER = `${TARGETS}, input, textarea, select`;

const LIME = "214, 253, 112";
const INK  = "19, 19, 19";

function isShown(el: Element) {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) return null;
  if (getComputedStyle(el).visibility !== "visible") return null;
  return rect;
}

/** The arrow zone under (x, y), if any. */
function zoneAt(x: number, y: number) {
  return Array.from(document.querySelectorAll(ZONES)).find(zone => {
    const r = zone.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }) ?? null;
}

/** The on-screen call-to-action in `zone` closest to (x, y), measured to its edge. */
function nearestTarget(zone: Element, x: number, y: number) {
  let best: DOMRect | null = null;
  let bestDist = Infinity;
  zone.querySelectorAll(TARGETS).forEach(el => {
    const rect = isShown(el);
    if (!rect) return;
    const dx = Math.max(rect.left - x, 0, x - rect.right);
    const dy = Math.max(rect.top - y, 0, y - rect.bottom);
    const d = Math.hypot(dx, dy);
    if (d < bestDist) { bestDist = d; best = rect; }
  });
  return best as DOMRect | null;
}

/**
 * Draws a dashed curved arrow from the cursor to the nearest call-to-action
 * button, while the cursor is inside a section marked data-arrow-zone (the
 * hero and the footer). Adapted from a shadcn "arrow overlay" demo.
 * Lime with an ink outline so it reads on white, sky and dark panels. Draws
 * only on pointer/scroll/resize, and is off on touch devices and for reduced
 * motion. Mount once per page.
 */
export function ArrowOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced     = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(finePointer && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let mouse: { x: number; y: number } | null = null;
    let hidden = false;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    };

    // Stroke the same path twice: dark outline, then lime core.
    const strokeTwice = (path: () => void, opacity: number, dash: number[]) => {
      ctx.setLineDash(dash);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath(); path();
      ctx.strokeStyle = `rgba(${INK}, ${0.85 * opacity})`;
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.beginPath(); path();
      ctx.strokeStyle = `rgba(${LIME}, ${opacity})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    };

    const draw = () => {
      frame = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (!mouse || hidden) return;

      const zone = zoneAt(mouse.x, mouse.y);
      if (!zone) return;
      const rect = nearestTarget(zone, mouse.x, mouse.y);
      if (!rect) return;

      const { x: x0, y: y0 } = mouse;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // End point just outside the button, on the line towards the cursor
      const a  = Math.atan2(cy - y0, cx - x0);
      const x1 = cx - Math.cos(a) * (rect.width / 2 + 14);
      const y1 = cy - Math.sin(a) * (rect.height / 2 + 14);

      // Quick fade-in with distance from the button
      const r = Math.hypot(x1 - x0, y1 - y0);
      const opacity = Math.min(1, Math.max(0, (r - 16) / 120));
      if (opacity <= 0.02) return;

      const midX = (x0 + x1) / 2;
      const midY = (y0 + y1) / 2;
      const bend = Math.min(200, r * 0.5) * Math.max(-1, Math.min(1, (y0 - y1) / 200));
      const controlX = midX;
      const controlY = midY + bend;

      // Curve
      strokeTwice(() => {
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(controlX, controlY, x1, y1);
      }, opacity, [12, 7]);

      // Arrowhead
      const angle = Math.atan2(y1 - controlY, x1 - controlX);
      const head = 14;
      strokeTwice(() => {
        ctx.moveTo(x1 - head * Math.cos(angle - Math.PI / 6), y1 - head * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x1, y1);
        ctx.lineTo(x1 - head * Math.cos(angle + Math.PI / 6), y1 - head * Math.sin(angle + Math.PI / 6));
      }, opacity, []);
    };

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    const onMove = (e: PointerEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
      hidden = e.target instanceof Element && Boolean(e.target.closest(HIDE_OVER));
      schedule();
    };
    const onLeave = () => { mouse = null; schedule(); };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  // Portalled to <body>, above the fixed header, below the mobile drawer.
  return enabled
    ? createPortal(
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[105] h-full w-full" />,
        document.body,
      )
    : null;
}
