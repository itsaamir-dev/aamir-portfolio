/**
 * Renders admin-written plain text safely: blank lines separate blocks,
 * lines starting with "-", "•" or "*" become a bulleted list, "1." a
 * numbered list. React escapes everything, so no HTML is ever injected.
 */
export default function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  return (
    <div className={`space-y-4 text-[1.0625rem] leading-relaxed text-muted ${className}`}>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.every(l => /^[-•*]\s+/.test(l))) {
          return (
            <ul key={i} className="space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="relative pl-6">
                  <span aria-hidden="true" className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-ink ring-[3px] ring-accent" />
                  {l.replace(/^[-•*]\s+/, "")}
                </li>
              ))}
            </ul>
          );
        }
        if (lines.every(l => /^\d+[.)]\s+/.test(l))) {
          return (
            <ol key={i} className="list-decimal space-y-2 pl-6 marker:text-ink">
              {lines.map((l, j) => <li key={j} className="pl-1">{l.replace(/^\d+[.)]\s+/, "")}</li>)}
            </ol>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => <span key={j}>{j > 0 && <br />}{l}</span>)}
          </p>
        );
      })}
    </div>
  );
}
