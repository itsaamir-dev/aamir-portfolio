import { ogCard, OG_SIZE } from "@/lib/og";

export const alt         = "Free profile websites for backlinks & social proof";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Free resource",
    title:   "17 free websites for backlinks & social proof",
    footer:  "For developers & freelancers",
  });
}
