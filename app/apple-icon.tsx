import { ImageResponse } from "next/og";

export const size        = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#080A09", color: "#FFFFFF", fontSize: 84, fontWeight: 800 }}>
        AB<span style={{ color: "#39F56A" }}>.</span>
      </div>
    ),
    size,
  );
}
