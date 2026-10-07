import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const font = (file: string) => fs.readFileSync(path.join(process.cwd(), "assets", "fonts", file));
const FONTS = [
  { name: "Space Grotesk", data: font("space-grotesk-500.woff"), weight: 500 as const, style: "normal" as const },
  { name: "Space Grotesk", data: font("space-grotesk-700.woff"), weight: 700 as const, style: "normal" as const },
];

/** Shared 1200×630 social card in the site's visual style. */
export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  const titleSize = title.length > 70 ? 54 : title.length > 45 ? 64 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "72px 80px", background: "#0B0D10", color: "#F5F7FA", fontFamily: "Space Grotesk", fontWeight: 500,
          backgroundImage: "radial-gradient(ellipse 70% 60% at 100% 0%, rgba(124,92,255,0.28), transparent 70%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#7C5CFF" }} />
          <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#A78BFA", fontWeight: 700 }}>
            {eyebrow}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1040 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, color: "#A7AFBA" }}>
          <div style={{ display: "flex" }}>{footer}</div>
          <div style={{ display: "flex", color: "#F5F7FA", fontWeight: 700 }}>buildwithaamir.com</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: FONTS },
  );
}
