import { ImageResponse } from "next/og";

export const size        = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#080A09", borderRadius: 14, color: "#FFFFFF", fontSize: 30, fontWeight: 800 }}>
        AB<span style={{ color: "#39F56A" }}>.</span>
      </div>
    ),
    size,
  );
}
