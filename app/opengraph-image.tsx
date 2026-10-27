import { ogCard, OG_SIZE } from "@/lib/og";

export const alt         = "Build With Aamir — Learn Freelancing & Get International Clients";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Build With Aamir",
    title:   "I built my freelancing career. Now I’m showing others how to build theirs.",
    footer:  "$80K+ on Upwork · Free community",
  });
}
