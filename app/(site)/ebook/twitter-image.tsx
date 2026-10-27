import { ogCard, OG_SIZE } from "@/lib/og";
import { ebook } from "@/lib/ebook";

export const alt         = `${ebook.title} — e-book waiting list`;
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: `Waiting list · ${ebook.discountPercent}% off at launch`,
    title:   `${ebook.title}: ${ebook.subtitle}`,
    footer:  "Free to join · Build With Aamir",
  });
}
