const BULLET = /^[-•*]\s+/;
const NUMBER = /^\d+[.)]\s+/;

type Run = { kind: "ul" | "ol" | "p"; lines: string[] };

/** Splits a block into consecutive runs of bullet lines, numbered lines and plain lines. */
function runs(lines: string[]): Run[] {
  const out: Run[] = [];
  for (const l of lines) {
    const kind = BULLET.test(l) ? "ul" : NUMBER.test(l) ? "ol" : "p";
    const last = out[out.length - 1];
    if (last?.kind === kind) last.lines.push(l);
    else out.push({ kind, lines: [l] });
  }
  return out;
}

/**
 * Renders admin-written plain text safely: blank lines separate blocks,
 * lines starting with "-", "•" or "*" become a bulleted list, "1." a
 * numbered list — also when they follow an intro line in the same block
 * ("Interview process:\n- HR round"). React escapes everything, so no HTML
 * is ever injected.
 */
export default function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  return (
    <div className={`space-y-4 text-[1.0625rem] leading-relaxed text-muted ${className}`}>
      {blocks.flatMap((block, i) =>
        runs(block.split("\n").map(l => l.trim()).filter(Boolean)).map((run, r) => {
          const key = `${i}-${r}`;
          if (run.kind === "ul") {
            return (
              <ul key={key} className="space-y-2">
                {run.lines.map((l, j) => (
                  <li key={j} className="relative pl-6">
                    <span aria-hidden="true" className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-ink ring-[3px] ring-accent" />
                    {l.replace(BULLET, "")}
                  </li>
                ))}
              </ul>
            );
          }
          if (run.kind === "ol") {
            return (
              <ol key={key} className="list-decimal space-y-2 pl-6 marker:text-ink">
                {run.lines.map((l, j) => <li key={j} className="pl-1">{l.replace(NUMBER, "")}</li>)}
              </ol>
            );
          }
          return (
            <p key={key}>
              {run.lines.map((l, j) => <span key={j}>{j > 0 && <br />}{l}</span>)}
            </p>
          );
        }),
      )}
    </div>
  );
}
