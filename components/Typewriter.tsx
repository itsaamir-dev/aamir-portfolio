"use client";
import { useEffect, useState } from "react";

const TYPE_MS   = 110;  // per letter while typing
const DELETE_MS = 60;   // per letter while deleting
const HOLD_MS   = 2200; // full word on screen
const EMPTY_MS  = 450;  // blank before retyping

/**
 * Types `word` out, holds, deletes and repeats. An invisible copy of the word
 * reserves its full width, so surrounding text never shifts. Shows the full
 * word on the server and for reduced-motion users; assistive tech and search
 * engines always get the full word.
 */
export default function Typewriter({ word, className = "" }: { word: string; className?: string }) {
  const [shown, setShown] = useState(word.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let count = word.length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      count += deleting ? -1 : 1;
      setShown(count);
      let delay = deleting ? DELETE_MS : TYPE_MS;
      if (count === 0)           { deleting = false; delay = EMPTY_MS; }
      if (count === word.length) { deleting = true;  delay = HOLD_MS; }
      timer = setTimeout(step, delay);
    };

    timer = setTimeout(step, HOLD_MS);
    return () => clearTimeout(timer);
  }, [word]);

  // Placeholder and typed letters are drawn with CSS `content`, so the page
  // text holds the word exactly once (the screen-reader copy).
  return (
    <span className={`inline-grid ${className}`}>
      <span className="sr-only">{word}</span>
      {/* Width reserve */}
      <span aria-hidden="true" data-text={word}
            className="invisible col-start-1 row-start-1 whitespace-nowrap before:content-[attr(data-text)]" />
      <span aria-hidden="true" className="col-start-1 row-start-1 whitespace-nowrap">
        <span data-text={word.slice(0, shown)} className="relative before:content-[attr(data-text)]">
          <span className="typewriter-caret absolute -right-[0.12em] top-[0.12em] h-[0.85em] w-[0.06em] rounded-full bg-accent" />
        </span>
      </span>
    </span>
  );
}
