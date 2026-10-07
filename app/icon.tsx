import { ImageResponse } from "next/og";

export const size        = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#0B0D10", borderRadius: 14, color: "#F5F7FA", fontSize: 30, fontWeight: 800 }}>
        AB<span style={{ color: "#7C5CFF" }}>.</span>
      </div>
    ),
    size,
  );
}
